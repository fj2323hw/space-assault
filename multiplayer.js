// multiplayer.js — Space Assault Multiplayer System
// PeerJS (WebRTC P2P) + Firestore Room Registry
// Star Topology: Host is authoritative for enemies/boss, all connections go through host.
'use strict';

// ========================================================
// Message Type Constants
// ========================================================
const MP_MSG = {
  JOIN:                    'JOIN',
  ACCEPT:                  'ACCEPT',
  REJECT:                  'REJECT',
  ROOM_UPDATE:             'ROOM_UPDATE',
  GAME_START:              'GAME_START',
  PLAYER_STATE:            'PLAYER_STATE',
  SKILL_EVENT:             'SKILL_EVENT',
  GAME_STATE:              'GAME_STATE',
  BULLET_HIT:              'BULLET_HIT',
  PLAYER_DOWN:             'PLAYER_DOWN',
  REVIVE_PROGRESS:         'REVIVE_PROGRESS',
  REVIVE_PROGRESS_BCAST:   'REVIVE_PROGRESS_BCAST',
  PLAYER_REVIVED:          'PLAYER_REVIVED',
  GAME_OVER:               'GAME_OVER',
};

const MP_PLAYER_COLORS = ['#58a6ff', '#f59e0b', '#10b981', '#f43f5e', '#c084fc'];
const MP_PLAYER_GLOWS  = ['#1f6feb', '#d97706', '#047857', '#b91c1c', '#7e22ce'];

// ========================================================
// RemotePlayer — renders another player from received state
// ========================================================
class RemotePlayer {
  constructor(peerId, name, colorIndex) {
    this.peerId      = peerId;
    this.name        = name;
    this.colorIndex  = colorIndex % MP_PLAYER_COLORS.length;
    this.color       = MP_PLAYER_COLORS[this.colorIndex];
    this.glowColor   = MP_PLAYER_GLOWS[this.colorIndex];

    this.x           = 0;
    this.y           = 0;
    this.displayX    = 0;
    this.displayY    = 0;
    this.angle       = 0;
    this.hp          = 100;
    this.maxHp       = 100;
    this.radius      = 18;
    this.grazeRadius = 57;
    this.isGuarding  = false;
    this.isDashing   = false;
    this.isDown      = false;
    this.grazeEffectTimer = 0;

    // Revival indicator (0–1, shown as arc when being revived)
    this.revivalProgress = 0;
    this.hasReceivedState = false;
  }

  updateState(data) {
    if (!this.hasReceivedState && data.x != null && data.y != null) {
      this.displayX = data.x;
      this.displayY = data.y;
      this.hasReceivedState = true;
    }
    this.x              = data.x            ?? this.x;
    this.y              = data.y            ?? this.y;
    this.angle          = data.angle        ?? this.angle;
    this.hp             = data.hp           ?? this.hp;
    this.maxHp          = data.maxHp        ?? this.maxHp;
    this.isGuarding     = !!data.isGuarding;
    this.isDashing      = !!data.isDashing;
    this.isDown         = !!data.isDown;
    this.grazeEffectTimer = data.grazeEffectTimer ?? 0;
  }

  draw(ctx) {
    if (!this.hasReceivedState) return;
    // Smooth interpolation toward received position
    this.displayX += (this.x - this.displayX) * 0.35;
    this.displayY += (this.y - this.displayY) * 0.35;
    const px = this.displayX;
    const py = this.displayY;

    if (this.isDown) {
      this._drawDown(ctx, px, py);
      return;
    }

    // Graze circle
    ctx.save();
    ctx.translate(px, py);
    ctx.beginPath();
    ctx.arc(0, 0, this.grazeRadius, 0, Math.PI * 2);
    if (this.grazeEffectTimer > 0) {
      ctx.strokeStyle = this.color;
      ctx.lineWidth   = 2.5;
      ctx.shadowColor = this.color;
      ctx.shadowBlur  = 12;
    } else {
      ctx.strokeStyle = this.color + '38';
      ctx.lineWidth   = 1;
      ctx.setLineDash([4, 4]);
    }
    ctx.stroke();
    ctx.restore();

    // Ship body
    ctx.save();
    ctx.translate(px, py);
    ctx.rotate(this.angle);
    ctx.shadowColor = this.isDashing ? '#38bdf8' : this.glowColor;
    ctx.shadowBlur  = this.isDashing ? 24 : 16;
    ctx.fillStyle   = this.isDashing ? '#79c0ff' : this.color;
    ctx.beginPath();
    ctx.moveTo( 22,   0);
    ctx.lineTo(-14, -13);
    ctx.lineTo( -8,   0);
    ctx.lineTo(-14,  13);
    ctx.closePath();
    ctx.fill();
    // Core
    ctx.shadowBlur  = 0;
    ctx.fillStyle   = '#f0f6fc';
    ctx.beginPath();
    ctx.arc(2, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    // Thruster
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(-9, -4);
    ctx.lineTo(-16 - (Math.random() * 6 + 2), 0);
    ctx.lineTo(-9,  4);
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Guard shield
    if (this.isGuarding) {
      ctx.save();
      ctx.translate(px, py);
      const t       = performance.now() * 0.005;
      const bRadius = 36 + Math.sin(t * 3) * 2;
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur  = 24;
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const ha = (k * Math.PI) / 3 + t * 0.8;
        if (k === 0) ctx.moveTo(Math.cos(ha) * bRadius, Math.sin(ha) * bRadius);
        else         ctx.lineTo(Math.cos(ha) * bRadius, Math.sin(ha) * bRadius);
      }
      ctx.closePath();
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth   = 3;
      ctx.stroke();
      ctx.fillStyle   = 'rgba(52,211,153,0.22)';
      ctx.fill();
      ctx.restore();
    }

    // HP bar
    const barW = 60, barH = 5;
    const barX = px - barW / 2;
    const barY = py - this.radius - 30;
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    ctx.fillRect(barX, barY, barW, barH);
    const hpPct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = hpPct > 0.3 ? this.color : '#f43f5e';
    ctx.fillRect(barX, barY, barW * hpPct, barH);

    // Name tag
    ctx.save();
    ctx.font         = 'bold 11px -apple-system, BlinkMacSystemFont, sans-serif';
    ctx.fillStyle    = this.color;
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.shadowColor  = this.glowColor;
    ctx.shadowBlur   = 6;
    ctx.fillText(this.name, px, barY - 2);
    ctx.restore();
  }

  _drawDown(ctx, px, py) {
    const t     = performance.now() * 0.003;
    const pulse = 0.35 + Math.abs(Math.sin(t)) * 0.65;

    // Broken ship silhouette
    ctx.save();
    ctx.translate(px, py);
    ctx.globalAlpha = pulse;
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth   = 3;
    ctx.shadowColor = '#f43f5e';
    ctx.shadowBlur  = 10;
    ctx.beginPath();
    ctx.moveTo( 22,   0);
    ctx.lineTo(-14, -13);
    ctx.lineTo( -8,   0);
    ctx.lineTo(-14,  13);
    ctx.closePath();
    ctx.stroke();
    ctx.restore();

    // "DOWN" text
    ctx.save();
    ctx.font         = 'bold 12px -apple-system, sans-serif';
    ctx.fillStyle    = '#f43f5e';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor  = '#f43f5e';
    ctx.shadowBlur   = 8;
    ctx.fillText('DOWN', px, py);
    ctx.restore();

    // Name
    ctx.save();
    ctx.font         = 'bold 11px -apple-system, sans-serif';
    ctx.fillStyle    = '#f85149';
    ctx.textAlign    = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(this.name, px, py - 28);
    ctx.restore();

    // Revival progress ring
    if (this.revivalProgress > 0) {
      ctx.save();
      ctx.translate(px, py);
      ctx.beginPath();
      ctx.arc(0, 0, 30, -Math.PI / 2,
        -Math.PI / 2 + Math.PI * 2 * this.revivalProgress, false);
      ctx.strokeStyle = '#7ee787';
      ctx.lineWidth   = 4;
      ctx.shadowColor = '#7ee787';
      ctx.shadowBlur  = 10;
      ctx.stroke();
      ctx.restore();

      // % text
      ctx.save();
      ctx.font         = 'bold 10px monospace';
      ctx.fillStyle    = '#7ee787';
      ctx.textAlign    = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(Math.floor(this.revivalProgress * 100) + '%', px, py + 22);
      ctx.restore();
    }
  }
}

// ========================================================
// HamGod Shared Visual Renderer (Blue Sapphire Djungarian)
// ========================================================
function drawHamGodVisual(ctx, x, y, radius, animTime, enrageLevel, laserActive, laserAngle) {
  ctx.save();
  ctx.translate(x, y);

  // Divine Glowing Aureole / Halo (Behind hamster)
  const auraPulse = Math.sin(animTime * 3.5) * 6;
  const haloColor = enrageLevel >= 5 ? '#f59e0b' : (enrageLevel >= 3 ? '#38bdf8' : '#a78bfa');
  ctx.save();
  ctx.shadowColor = haloColor;
  ctx.shadowBlur = (radius * 0.7) + auraPulse;
  ctx.strokeStyle = haloColor;
  ctx.lineWidth = Math.max(3, radius * 0.08);
  ctx.setLineDash([12, 8]);
  ctx.rotate(animTime * 0.8);
  ctx.beginPath();
  ctx.arc(0, 0, radius * 1.35 + auraPulse, 0, Math.PI * 2);
  ctx.stroke();

  // Divine Sunflower Seeds floating in orbit
  const seedCount = 6;
  for (let s = 0; s < seedCount; s++) {
    const sAng = (s * Math.PI * 2 / seedCount) + animTime * 1.2;
    const sDist = radius * 1.55;
    const sx = Math.cos(sAng) * sDist;
    const sy = Math.sin(sAng) * sDist;
    ctx.save();
    ctx.translate(sx, sy);
    ctx.rotate(sAng + Math.PI / 2);
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(0, 0, 4, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  ctx.restore();

  // Dancing Body Sway & Bounce Animation
  const danceAngle = Math.sin(animTime * 4.5) * 0.16;
  const danceBounce = Math.abs(Math.sin(animTime * 9.0)) * 6;
  ctx.translate(0, -danceBounce);
  ctx.rotate(danceAngle);

  // Feet (Cute pink dancing paws at bottom)
  const footStepL = Math.sin(animTime * 9.0) * 5;
  const footStepR = -Math.sin(animTime * 9.0) * 5;
  ctx.fillStyle = '#fbcfe8'; // Soft pink
  ctx.shadowBlur = 0;
  // Left foot
  ctx.beginPath();
  ctx.ellipse(-radius * 0.38, radius * 0.85 + footStepL, radius * 0.2, radius * 0.14, -0.2, 0, Math.PI * 2);
  ctx.fill();
  // Right foot
  ctx.beginPath();
  ctx.ellipse(radius * 0.38, radius * 0.85 + footStepR, radius * 0.2, radius * 0.14, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Fluffy Tail (tiny cotton puff at rear)
  ctx.fillStyle = '#cbd5e1';
  ctx.beginPath();
  ctx.arc(-radius * 0.65, radius * 0.55, radius * 0.16, 0, Math.PI * 2);
  ctx.fill();

  // Lower Body / Belly Base (Chubby round shape)
  // Blue Sapphire fur gradient: slate sapphire blue on sides, creamy white on center
  const bodyGrad = ctx.createRadialGradient(0, radius * 0.2, radius * 0.1, 0, radius * 0.2, radius * 0.95);
  bodyGrad.addColorStop(0, '#f8fafc'); // White/cream belly
  bodyGrad.addColorStop(0.55, '#64748b'); // Soft sapphire grey-blue
  bodyGrad.addColorStop(0.9, '#334155'); // Deep blue-grey dorsal coat
  bodyGrad.addColorStop(1, '#1e293b');

  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.3, radius * 0.82, radius * 0.72, 0, 0, Math.PI * 2);
  ctx.fill();

  // White Chest & Belly Oval
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.ellipse(0, radius * 0.36, radius * 0.52, radius * 0.54, 0, 0, Math.PI * 2);
  ctx.fill();

  // Distinct Djungarian Dorsal Stripe (Dark dorsal line down the back/head)
  ctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  ctx.beginPath();
  ctx.ellipse(0, -radius * 0.1, radius * 0.1, radius * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();

  // Head (Rounded, sitting atop torso)
  const headGrad = ctx.createRadialGradient(0, -radius * 0.35, 2, 0, -radius * 0.35, radius * 0.65);
  headGrad.addColorStop(0, '#94a3b8');
  headGrad.addColorStop(0.7, '#475569');
  headGrad.addColorStop(1, '#1e293b');
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.ellipse(0, -radius * 0.35, radius * 0.66, radius * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();

  // Cheeks (Puffy cute white cheek patches)
  ctx.fillStyle = '#f1f5f9';
  ctx.beginPath();
  ctx.ellipse(-radius * 0.34, -radius * 0.24, radius * 0.26, radius * 0.28, -0.2, 0, Math.PI * 2);
  ctx.ellipse(radius * 0.34, -radius * 0.24, radius * 0.26, radius * 0.28, 0.2, 0, Math.PI * 2);
  ctx.fill();

  // Soft Pink Blush on Cheeks
  ctx.fillStyle = 'rgba(244, 114, 182, 0.45)';
  ctx.beginPath();
  ctx.arc(-radius * 0.36, -radius * 0.22, radius * 0.13, 0, Math.PI * 2);
  ctx.arc(radius * 0.36, -radius * 0.22, radius * 0.13, 0, Math.PI * 2);
  ctx.fill();

  // Ears (Small round pink ears, Djungarian signature)
  const earWiggleL = Math.sin(animTime * 7.0) * 0.1;
  const earWiggleR = Math.cos(animTime * 7.0) * 0.1;
  // Outer ears (sapphire blue-grey)
  ctx.fillStyle = '#475569';
  ctx.beginPath();
  ctx.ellipse(-radius * 0.46, -radius * 0.78, radius * 0.2, radius * 0.25, -0.3 + earWiggleL, 0, Math.PI * 2);
  ctx.ellipse(radius * 0.46, -radius * 0.78, radius * 0.2, radius * 0.25, 0.3 + earWiggleR, 0, Math.PI * 2);
  ctx.fill();
  // Inner ears (soft pink)
  ctx.fillStyle = '#f472b6';
  ctx.beginPath();
  ctx.ellipse(-radius * 0.46, -radius * 0.78, radius * 0.13, radius * 0.17, -0.3 + earWiggleL, 0, Math.PI * 2);
  ctx.ellipse(radius * 0.46, -radius * 0.78, radius * 0.13, radius * 0.17, 0.3 + earWiggleR, 0, Math.PI * 2);
  ctx.fill();

  // Sparkling Black Eyes with divine highlights
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(-radius * 0.24, -radius * 0.38, radius * 0.12, 0, Math.PI * 2);
  ctx.arc(radius * 0.24, -radius * 0.38, radius * 0.12, 0, Math.PI * 2);
  ctx.fill();

  // Eye highlights (Large sparkly twinkle)
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  ctx.arc(-radius * 0.26, -radius * 0.41, radius * 0.045, 0, Math.PI * 2);
  ctx.arc(-radius * 0.21, -radius * 0.35, radius * 0.025, 0, Math.PI * 2);
  ctx.arc(radius * 0.22, -radius * 0.41, radius * 0.045, 0, Math.PI * 2);
  ctx.arc(radius * 0.27, -radius * 0.35, radius * 0.025, 0, Math.PI * 2);
  ctx.fill();

  // Little Pink Nose & Y-shaped Mouth
  ctx.fillStyle = '#fb7185';
  ctx.beginPath();
  ctx.arc(0, -radius * 0.22, radius * 0.055, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(0, -radius * 0.17);
  ctx.lineTo(0, -radius * 0.12);
  ctx.lineTo(-radius * 0.08, -radius * 0.08);
  ctx.moveTo(0, -radius * 0.12);
  ctx.lineTo(radius * 0.08, -radius * 0.08);
  ctx.stroke();

  // Tiny Whiskers
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  // Left whiskers
  ctx.moveTo(-radius * 0.3, -radius * 0.18);
  ctx.lineTo(-radius * 0.65, -radius * 0.22);
  ctx.moveTo(-radius * 0.3, -radius * 0.14);
  ctx.lineTo(-radius * 0.62, -radius * 0.10);
  // Right whiskers
  ctx.moveTo(radius * 0.3, -radius * 0.18);
  ctx.lineTo(radius * 0.65, -radius * 0.22);
  ctx.moveTo(radius * 0.3, -radius * 0.14);
  ctx.lineTo(radius * 0.62, -radius * 0.10);
  ctx.stroke();

  // Dancing Front Paws (Flapping up and down rhythmically!)
  const pawWaveL = Math.sin(animTime * 9.0) * (radius * 0.16);
  const pawWaveR = -Math.sin(animTime * 9.0) * (radius * 0.16);
  ctx.fillStyle = '#fbcfe8';
  ctx.beginPath();
  ctx.ellipse(-radius * 0.22, radius * 0.08 + pawWaveL, radius * 0.12, radius * 0.09, -0.4, 0, Math.PI * 2);
  ctx.ellipse(radius * 0.22, radius * 0.08 + pawWaveR, radius * 0.12, radius * 0.09, 0.4, 0, Math.PI * 2);
  ctx.fill();

  // Crown of the Hamster God (Golden heavenly coronet)
  ctx.save();
  ctx.translate(0, -radius * 0.95);
  ctx.fillStyle = '#fbbf24';
  ctx.strokeStyle = '#d97706';
  ctx.lineWidth = 2;
  ctx.shadowColor = '#f59e0b';
  ctx.shadowBlur = 10;
  ctx.beginPath();
  ctx.moveTo(-radius * 0.28, 0);
  ctx.lineTo(-radius * 0.32, -radius * 0.3);
  ctx.lineTo(-radius * 0.14, -radius * 0.14);
  ctx.lineTo(0, -radius * 0.4);
  ctx.lineTo(radius * 0.14, -radius * 0.14);
  ctx.lineTo(radius * 0.32, -radius * 0.3);
  ctx.lineTo(radius * 0.28, 0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  // Crown Gem (Blue sapphire jewel!)
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(0, -radius * 0.18, radius * 0.07, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  ctx.restore(); // Restore body sway

  // Beam / Laser Visual if currently firing
  if (laserActive) {
    ctx.save();
    ctx.rotate(laserAngle);

    // Laser core and outer blazing aura
    const laserLength = 1600;
    const lWidth = 34 + Math.sin(animTime * 18) * 8;

    // Outer glow
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 24;
    ctx.fillStyle = 'rgba(56, 189, 248, 0.4)';
    ctx.fillRect(0, -lWidth / 2, laserLength, lWidth);

    // Inner bright beam
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(0, -lWidth * 0.28, laserLength, lWidth * 0.56);

    // Core white hot line
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, -lWidth * 0.12, laserLength, lWidth * 0.24);

    // Muzzle blast rings
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, lWidth * 0.9, -Math.PI / 2, Math.PI / 2);
    ctx.stroke();

    ctx.restore();
  }

  ctx.restore();
}

// ========================================================
// RemoteEnemy — lightweight predictive enemy for clients
// ========================================================
class RemoteEnemy {
  constructor(data) {
    this.id = data.id;
    this.x = data.x || 0;
    this.y = data.y || 0;
    this.targetX = this.x;
    this.targetY = this.y;
    this.vx = data.vx || 0;
    this.vy = data.vy || 0;
    this.angle = data.angle || 0;
    this.targetAngle = this.angle;
    this.hp = data.hp;
    this.maxHp = data.maxHp;
    this.type = data.type;
    this.radius = data.radius;
    this.hasShot = data.hasShot;
    this.hasGrazed = false;
  }

  updateState(data) {
    this.targetX = data.x;
    this.targetY = data.y;
    if (data.vx != null) this.vx = data.vx;
    if (data.vy != null) this.vy = data.vy;
    if (data.angle != null) this.targetAngle = data.angle;
    this.hp = data.hp;
    this.maxHp = data.maxHp;
    this.type = data.type;
    this.radius = data.radius;
    this.hasShot = data.hasShot;

    // If position diverged drastically (> 100px), snap to avoid rubber-banding
    if (Math.hypot(this.targetX - this.x, this.targetY - this.y) > 100) {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  update(ts = 1.0) {
    // Dead reckoning: advance with known velocity
    this.x += this.vx * ts;
    this.y += this.vy * ts;
    this.targetX += this.vx * ts;
    this.targetY += this.vy * ts;

    // Smooth lerp toward authoritative server target
    this.x += (this.targetX - this.x) * 0.35;
    this.y += (this.targetY - this.y) * 0.35;
    this.angle += (this.targetAngle - this.angle) * 0.35;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);

    if (this.type === 'large') {
      ctx.shadowColor = '#ff2a6d';
      ctx.shadowBlur  = this.radius * 0.53;
      ctx.fillStyle   = '#ff2a6d';
      ctx.beginPath();
      const r = this.radius, innerR = r * 0.65;
      for (let i = 0; i < 8; i++) {
        const a1 = (i * Math.PI) / 4, a2 = a1 + Math.PI / 8;
        if (i === 0) ctx.moveTo(Math.cos(a1) * r, Math.sin(a1) * r);
        else         ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        ctx.lineTo(Math.cos(a2) * innerR, Math.sin(a2) * innerR);
      }
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle  = '#05d9e8';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.24, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'shooter') {
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur  = this.radius * 0.65;
      ctx.fillStyle   = '#1e1b4b';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth   = Math.max(2.5, this.radius * 0.1);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        if (i === 0) ctx.moveTo(Math.cos(a) * this.radius, Math.sin(a) * this.radius);
        else         ctx.lineTo(Math.cos(a) * this.radius, Math.sin(a) * this.radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.shadowBlur = 10;
      ctx.fillStyle  = this.hasShot ? '#475569' : '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.type === 'chaser') {
      // Remote Chaser Enemy
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur  = this.radius * 0.7;

      ctx.fillStyle   = '#451a03';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth   = 2.2;
      ctx.beginPath();
      ctx.moveTo(this.radius * 1.2, 0);
      ctx.lineTo(-this.radius * 0.9, -this.radius * 0.9);
      ctx.lineTo(-this.radius * 0.4, 0);
      ctx.lineTo(-this.radius * 0.9, this.radius * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.shadowBlur = 8;
      ctx.fillStyle  = '#fbbf24';
      ctx.beginPath();
      ctx.arc(this.radius * 0.1, 0, this.radius * 0.28, 0, Math.PI * 2);
      ctx.fill();

      ctx.shadowBlur  = 12;
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle   = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-this.radius * 0.4, -3);
      ctx.lineTo(-this.radius * 0.8 - Math.random() * 5, 0);
      ctx.lineTo(-this.radius * 0.4, 3);
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.shadowColor = '#ff2222';
      ctx.shadowBlur  = this.radius * 0.7;
      ctx.fillStyle   = '#ff5555';
      ctx.beginPath();
      ctx.moveTo( this.radius, 0);
      ctx.lineTo(0, -this.radius);
      ctx.lineTo(-this.radius, 0);
      ctx.lineTo(0,  this.radius);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle  = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();

    // HP bar for large/shooter/chaser
    if (this.maxHp > 2) {
      const bw = this.radius * 1.25;
      const bh = Math.max(4, this.radius * 0.13);
      const by = this.y - this.radius - (bh + 7);
      const bx = this.x - bw / 2;
      ctx.fillStyle = 'rgba(0,0,0,0.7)';
      ctx.fillRect(bx, by, bw, bh);
      ctx.fillStyle = this.type === 'large' ? '#ff2a6d' : (this.type === 'chaser' ? '#f59e0b' : '#a855f7');
      ctx.fillRect(bx, by, bw * Math.max(0, this.hp / this.maxHp), bh);
    }
  }
}

// ========================================================
// RemoteBoss — lightweight draw-only boss for clients
// ========================================================
class RemoteBoss {
  constructor(data) {
    Object.assign(this, data);
    this.targetX = data.x || 0;
    this.targetY = data.y || 0;
    this.angle   = data.angle || 0;
    this._phase  = 0;
    this.hasGrazed = false;
  }

  updateState(data) {
    this.targetX = data.x;
    this.targetY = data.y;
    this.hp      = data.hp;
    this.maxHp   = data.maxHp;
    this.radius  = data.radius;
    if (data.angle != null) this.angle = data.angle;

    if (Math.hypot(this.targetX - this.x, this.targetY - this.y) > 150) {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  update(ts = 1.0) {
    this.x += (this.targetX - this.x) * 0.35;
    this.y += (this.targetY - this.y) * 0.35;
  }

  draw(ctx) {
    this._phase = (this._phase || 0) + 0.015;
    ctx.save();
    ctx.translate(this.x, this.y);

    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur  = this.radius * 0.62;

    // Outer dashed ring
    ctx.save();
    ctx.rotate(-this._phase * 1.5);
    ctx.strokeStyle = 'rgba(255,34,85,0.45)';
    ctx.lineWidth   = Math.max(3, this.radius * 0.06);
    ctx.setLineDash([14, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Star hull
    ctx.save();
    ctx.rotate(this._phase);
    ctx.fillStyle   = '#1e1022';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth   = Math.max(4, this.radius * 0.08);
    ctx.beginPath();
    const spikes = 8, outerR = this.radius, innerR = this.radius * 0.72;
    for (let i = 0; i < spikes * 2; i++) {
      const r = (i % 2 === 0) ? outerR : innerR;
      const a = (i * Math.PI) / spikes;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else         ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Core
    ctx.shadowBlur = this.radius * 0.35;
    ctx.shadowColor = '#00f5d4';
    ctx.fillStyle   = '#00f5d4';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.27, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.12, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// ========================================================
// RemoteEventBoss — lightweight draw-only HamGod for clients
// ========================================================
class RemoteEventBoss {
  constructor(data) {
    Object.assign(this, data);
    this.targetX = data.x || 0;
    this.targetY = data.y || 0;
    this.angle   = data.angle || 0;
    this.totalDamage = data.totalDamage || 0;
    this.enrageLevel = data.enrageLevel || 1;
    this.animTime = 0;
    this.laserActive = false;
    this.laserAngle = 0;
    this.laserLength = 1500;
    this.laserWidth = 34;
    this.hasGrazed = false;
  }

  updateState(data) {
    this.targetX = data.x;
    this.targetY = data.y;
    this.hp      = data.hp;
    this.maxHp   = data.maxHp;
    this.radius  = data.radius;
    this.totalDamage = data.totalDamage || 0;
    this.enrageLevel = data.enrageLevel || 1;
    this.laserActive = !!data.laserActive;
    this.laserAngle  = data.laserAngle || 0;
    if (data.angle != null) this.angle = data.angle;

    if (Math.hypot(this.targetX - this.x, this.targetY - this.y) > 150) {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  update(ts = 1.0) {
    this.x += (this.targetX - this.x) * 0.35;
    this.y += (this.targetY - this.y) * 0.35;
    this.animTime += 0.05 * ts;
  }

  draw(ctx) {
    drawHamGodVisual(ctx, this.x, this.y, this.radius, this.animTime, this.enrageLevel, this.laserActive, this.laserAngle);
  }
}

// ========================================================
// RemoteBossBullet — lightweight draw-only boss bullet
// ========================================================
class RemoteBossBullet {
  constructor(data) {
    Object.assign(this, data);
    this.targetX = data.x || 0;
    this.targetY = data.y || 0;
    this.vx      = data.vx || 0;
    this.vy      = data.vy || 0;
    this.radius  = data.radius || 7;
    this.hasGrazed = false;
  }

  updateState(data) {
    this.targetX = data.x;
    this.targetY = data.y;
    if (data.vx != null) this.vx = data.vx;
    if (data.vy != null) this.vy = data.vy;
    if (Math.hypot(this.targetX - this.x, this.targetY - this.y) > 80) {
      this.x = this.targetX;
      this.y = this.targetY;
    }
  }

  update(ts = 1.0) {
    this.x += this.vx * ts;
    this.y += this.vy * ts;
    this.targetX += this.vx * ts;
    this.targetY += this.vy * ts;
    this.x += (this.targetX - this.x) * 0.35;
    this.y += (this.targetY - this.y) * 0.35;
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur  = 12;
    ctx.fillStyle   = '#ff3366';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    ctx.fillStyle  = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255,51,102,0.4)';
    ctx.lineWidth   = 3;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 1.8, this.y - this.vy * 1.8);
    ctx.stroke();
    ctx.restore();
  }
}

// ========================================================
// MultiplayerManager
// ========================================================
class MultiplayerManager {
  constructor() {
    this.peer         = null;
    this.connections  = {};       // peerId → DataConnection
    this.isHost       = false;
    this.roomDocId    = null;
    this.passcode     = '';
    this.myName       = '';
    this.myColorIndex = 0;
    this.playerCount  = 1;
    this.maxPlayers   = 2;
    this.gameMode     = 'SCORE_ATTACK';
    this.hostPeerId   = null;
    this.active       = false;

    this.remotePlayers  = {};  // peerId → RemotePlayer
    this.lobbyPlayers   = [];  // [{peerId, name, colorIndex}]

    // Host‑side: last received player states (for collision)
    this.lastPlayerStates = {};   // peerId → {x,y,isDown,...}

    // Host‑side: revival timers
    this.revivalTimers  = {};  // `reviverPeerId_targetPeerId` → seconds elapsed

    // Client‑side: last received game state
    this.lastGameState  = null;

    // Client‑side: rendered remote game objects
    this.remoteGameObjects = { enemies: [], boss: null, bossBullets: [] };

    // Broadcast intervals
    this._stateInterval     = null;
    this._gameStateInterval = null;

    // Callbacks set by UI code
    this.onRoomUpdate  = null;   // (lobbyPlayers[]) → void
    this.onGameStart   = null;   // (config) → void
    this.onGameOver    = null;   // (data) → void
    this.onError       = null;   // (msg) → void
    this.onConnected   = null;   // (acceptData) → void
  }

  // ── HOST: Create room ──────────────────────────────────
  async createRoom(playerName, passcode, maxPlayers, gameMode, bossLevel = 1) {
    this.myName      = playerName;
    this.passcode    = passcode;
    this.maxPlayers  = maxPlayers;
    this.gameMode    = gameMode;
    this.isHost      = true;
    this.myColorIndex = 0;
    this.lobbyPlayers = [{ peerId: null, name: playerName, colorIndex: 0 }];
    this.bossLevel   = bossLevel; // store boss level on manager

    try {
      // Generate a unique PeerJS ID from the passcode
      const suffix = Math.random().toString(36).substring(2, 7);
      const peerId = `sa-room-${passcode}-${suffix}`;
      await this._initPeer(peerId);
      this.hostPeerId = this.peer.id;
      this.lobbyPlayers[0].peerId = this.peer.id;

      // Register in Firestore
      if (window.firestoreDb) {
        const ref = await window.firestoreDb.collection('mp_rooms').add({
          passcode,
          hostPeerId:    this.peer.id,
          maxPlayers,
          gameMode,
          bossLevel,
          status:        'waiting',
          createdAt:     firebase.firestore.FieldValue.serverTimestamp(),
          players:       [{ name: playerName, colorIndex: 0 }]
        });
        this.roomDocId = ref.id;
      }

      // Listen for incoming connections
      this.peer.on('connection', conn => this._handleIncoming(conn));

      return { success: true, peerId: this.peer.id };
    } catch (err) {
      console.error('[MP] createRoom error:', err);
      return { success: false, error: err.message };
    }
  }

  // ── CLIENT: Join room ──────────────────────────────────
  async joinRoom(playerName, passcode, expectedMode = null) {
    this.myName   = playerName;
    this.passcode = passcode;
    this.isHost   = false;

    try {
      if (!window.firestoreDb) {
        return { success: false, error: 'Firestore が利用できません' };
      }

      const snap = await window.firestoreDb.collection('mp_rooms')
        .where('passcode', '==', passcode)
        .where('status',   '==', 'waiting')
        .limit(1)
        .get();

      if (snap.empty) {
        return { success: false, error: '合言葉に一致する待機中の部屋が見つかりません' };
      }

      const doc      = snap.docs[0];
      const roomData = doc.data();

      if (expectedMode && roomData.gameMode && roomData.gameMode !== expectedMode) {
        let modeName = 'スコアアタック';
        if (roomData.gameMode === 'BOSS') modeName = 'ボス戦';
        else if (roomData.gameMode === 'EVENT_BOSS') modeName = 'イベントボス (ハム神)';
        return { success: false, error: `この部屋は【${modeName}】の部屋です` };
      }

      this.roomDocId   = doc.id;
      this.hostPeerId  = roomData.hostPeerId;
      this.gameMode    = roomData.gameMode;
      this.bossLevel   = roomData.bossLevel || 1;
      this.maxPlayers  = roomData.maxPlayers;

      await this._initPeer(); // Random ID

      const conn = this.peer.connect(this.hostPeerId, { reliable: true, label: 'game' });

      conn.on('open', () => {
        this.connections[this.hostPeerId] = conn;
        this._send(conn, { type: MP_MSG.JOIN, name: playerName });
      });

      conn.on('data',  data  => this._handleMessage(this.hostPeerId, data));
      conn.on('error', err   => { if (this.onError) this.onError('接続エラー: ' + (err.message || err)); });
      conn.on('close', ()    => {
        if (this.active && this.onError) this.onError('ホストとの接続が切れました');
      });

      return { success: true };
    } catch (err) {
      console.error('[MP] joinRoom error:', err);
      return { success: false, error: err.message };
    }
  }

  // ── HOST: Start game ───────────────────────────────────
  startMultiGame() {
    if (!this.isHost) return;
    const count = this.lobbyPlayers.length;

    if (window.firestoreDb && this.roomDocId) {
      window.firestoreDb.collection('mp_rooms').doc(this.roomDocId)
        .update({ status: 'playing' }).catch(() => {});
    }

    const payload = {
      type:         MP_MSG.GAME_START,
      gameMode:     this.gameMode,
      bossLevel:    this.bossLevel || 1,
      playerCount:  count,
      hpMultiplier: count,
      players:      this.lobbyPlayers
    };
    this._broadcast(payload);

    this.active      = true;
    this.playerCount = count;
    this._startLoops();

    if (this.onGameStart) this.onGameStart({ ...payload, isHost: true });
  }

  // ── HOST: Handle incoming connection ───────────────────
  _handleIncoming(conn) {
    conn.on('open', () => {});

    conn.on('data', data => this._handleMessage(conn.peer, data, conn));

    conn.on('close', () => {
      const pid = conn.peer;
      const rp  = this.remotePlayers[pid];
      if (rp) {
        const name = rp.name;
        delete this.remotePlayers[pid];
        delete this.connections[pid];
        delete this.lastPlayerStates[pid];
        this.lobbyPlayers = this.lobbyPlayers.filter(p => p.peerId !== pid);

        if (this.onRoomUpdate) this.onRoomUpdate(this.lobbyPlayers);
        this._broadcast({ type: MP_MSG.ROOM_UPDATE, players: this.lobbyPlayers });

        if (this.active && typeof showToast === 'function') showToast(`${name} が切断しました`);
        this._checkAllDown();
      }
    });
  }

  // ── Message Router ────────────────────────────────────
  _handleMessage(fromPeerId, data, conn = null) {
    switch (data.type) {

      // ── JOIN (Host receives) ──
      case MP_MSG.JOIN:
        if (!this.isHost) break;
        if (this.lobbyPlayers.length >= this.maxPlayers || this.active) {
          if (conn) this._send(conn, { type: MP_MSG.REJECT, reason: this.active ? 'ゲームが既に始まっています' : '部屋が満員です' });
          break;
        }
        {
          const usedColors = new Set(this.lobbyPlayers.map(p => p.colorIndex));
          let colorIdx = 0;
          while (usedColors.has(colorIdx)) colorIdx++;
          this.connections[fromPeerId] = conn;
          this.remotePlayers[fromPeerId] = new RemotePlayer(fromPeerId, data.name, colorIdx);
          this.lobbyPlayers.push({ peerId: fromPeerId, name: data.name, colorIndex: colorIdx });

          this._send(conn, {
            type:          MP_MSG.ACCEPT,
            yourColorIndex: colorIdx,
            players:       this.lobbyPlayers,
            gameMode:      this.gameMode,
            maxPlayers:    this.maxPlayers
          });

          this._broadcast({ type: MP_MSG.ROOM_UPDATE, players: this.lobbyPlayers });
          if (this.onRoomUpdate) this.onRoomUpdate(this.lobbyPlayers);

          if (window.firestoreDb && this.roomDocId) {
            window.firestoreDb.collection('mp_rooms').doc(this.roomDocId)
              .update({ players: this.lobbyPlayers.map(p => ({ name: p.name, colorIndex: p.colorIndex })) })
              .catch(() => {});
          }
        }
        break;

      // ── ACCEPT (Client receives) ──
      case MP_MSG.ACCEPT:
        this.myColorIndex  = data.yourColorIndex;
        this.lobbyPlayers  = data.players;
        this.gameMode      = data.gameMode;
        this.maxPlayers    = data.maxPlayers;
        data.players.forEach(p => {
          if (p.peerId && p.peerId !== this.peer?.id && !this.remotePlayers[p.peerId]) {
            this.remotePlayers[p.peerId] = new RemotePlayer(p.peerId, p.name, p.colorIndex);
          }
        });
        if (this.onConnected)  this.onConnected(data);
        if (this.onRoomUpdate) this.onRoomUpdate(data.players);
        break;

      // ── REJECT (Client receives) ──
      case MP_MSG.REJECT:
        if (this.onError) this.onError(data.reason || '参加を拒否されました');
        break;

      // ── ROOM_UPDATE ──
      case MP_MSG.ROOM_UPDATE:
        this.lobbyPlayers = data.players;
        data.players.forEach(p => {
          if (p.peerId && p.peerId !== this.peer?.id && !this.remotePlayers[p.peerId]) {
            this.remotePlayers[p.peerId] = new RemotePlayer(p.peerId, p.name, p.colorIndex);
          }
        });
        if (this.onRoomUpdate) this.onRoomUpdate(data.players);
        break;

      // ── GAME_START (Client receives) ──
      case MP_MSG.GAME_START:
        this.active      = true;
        this.playerCount = data.playerCount;
        this.gameMode    = data.gameMode;
        this.lobbyPlayers = data.players;
        data.players.forEach(p => {
          if (p.peerId && p.peerId !== this.peer?.id && !this.remotePlayers[p.peerId]) {
            this.remotePlayers[p.peerId] = new RemotePlayer(p.peerId, p.name, p.colorIndex);
          }
        });
        this._startLoops();
        if (this.onGameStart) this.onGameStart({ ...data, isHost: false });
        break;

      // ── PLAYER_STATE ──
      case MP_MSG.PLAYER_STATE: {
        const pid = data.peerId || fromPeerId;
        if (pid && pid !== this.peer?.id) {
          if (!this.remotePlayers[pid]) {
            const lp = this.lobbyPlayers.find(p => p.peerId === pid);
            const name = lp ? lp.name : (data.name || 'Player');
            const colorIdx = lp ? lp.colorIndex : 0;
            this.remotePlayers[pid] = new RemotePlayer(pid, name, colorIdx);
          }
          this.remotePlayers[pid].updateState(data);
        }
        if (this.isHost) {
          this.lastPlayerStates[fromPeerId] = data;
          // Forward to all other clients
          this._broadcastExcept(fromPeerId, { ...data, type: MP_MSG.PLAYER_STATE, peerId: fromPeerId });
        }
        break;
      }

      // ── SKILL_EVENT ──
      case MP_MSG.SKILL_EVENT:
        this._applyRemoteSkillEffect(data.fromPeerId || fromPeerId, data);
        if (this.isHost) {
          this._broadcastExcept(fromPeerId, { ...data, fromPeerId });
        }
        break;

      // ── GAME_STATE (Client receives from host) ──
      case MP_MSG.GAME_STATE:
        if (!this.isHost) {
          this.lastGameState = data;
          this._applyGameState(data);
        }
        break;

      // ── BULLET_HIT (Client reports to host) ──
      case MP_MSG.BULLET_HIT:
        if (this.isHost) {
          this._processBulletHit(fromPeerId, data);
        }
        break;

      // ── REVIVE_PROGRESS (Client reports to host) ──
      case MP_MSG.REVIVE_PROGRESS:
        if (this.isHost) {
          this._processReviveProgress(fromPeerId, data);
        }
        break;

      // ── REVIVE_PROGRESS_BCAST (All receive from host) ──
      case MP_MSG.REVIVE_PROGRESS_BCAST:
        if (this.remotePlayers[data.targetPeerId]) {
          this.remotePlayers[data.targetPeerId].revivalProgress = data.progress;
        }
        if (!this.isHost && (data.targetPeerId === '__host__' || data.targetPeerId === this.hostPeerId)) {
          const hostRp = this.remotePlayers[this.hostPeerId] || this.remotePlayers['__host__'];
          if (hostRp) hostRp.revivalProgress = data.progress;
        }
        // Also update local player's revivalProgress if local player is being revived
        if (typeof player !== 'undefined') {
          const isMe = (this.isHost && (data.targetPeerId === '__host__' || data.targetPeerId === this.peer?.id)) ||
                       (!this.isHost && this.peer && data.targetPeerId === this.peer.id);
          if (isMe) {
            player.revivalProgress = data.progress;
          }
        }
        break;

      // ── PLAYER_DOWN ──
      case MP_MSG.PLAYER_DOWN:
        if (this.remotePlayers[data.peerId]) {
          this.remotePlayers[data.peerId].isDown = true;
          this.remotePlayers[data.peerId].hp     = 0;
        }
        if (!this.isHost && (data.peerId === '__host__' || data.peerId === this.hostPeerId)) {
          const hostRp = this.remotePlayers[this.hostPeerId] || this.remotePlayers['__host__'];
          if (hostRp) {
            hostRp.isDown = true;
            hostRp.hp     = 0;
          }
        }
        break;

      // ── PLAYER_REVIVED ──
      case MP_MSG.PLAYER_REVIVED: {
        const rp = this.remotePlayers[data.peerId];
        if (rp) {
          rp.isDown          = false;
          rp.maxHp           = data.newMaxHp;
          rp.hp              = data.newMaxHp;
          rp.revivalProgress = 0;
        }
        // If host was revived, also update remotePlayers[this.hostPeerId] for client
        if (!this.isHost && (data.peerId === '__host__' || data.peerId === this.hostPeerId)) {
          const hostRp = this.remotePlayers[this.hostPeerId] || this.remotePlayers['__host__'];
          if (hostRp) {
            hostRp.isDown          = false;
            hostRp.maxHp           = data.newMaxHp;
            hostRp.hp              = data.newMaxHp;
            hostRp.revivalProgress = 0;
          }
        }
        // If it's us
        const isMe = (!this.isHost && this.peer && data.peerId === this.peer.id) ||
                     (this.isHost && (data.peerId === '__host__' || data.peerId === this.peer?.id));
        if (isMe) {
          this._selfRevived(data.newMaxHp);
        }
        break;
      }

      // ── GAME_OVER ──
      case MP_MSG.GAME_OVER:
        if (this.onGameOver) this.onGameOver(data);
        break;
    }
  }

  // ── Apply received GAME_STATE to remoteGameObjects ────
  _applyGameState(gs) {
    const ro = this.remoteGameObjects;

    // Enemies: Map by id to preserve smooth interpolation
    const incomingEnemies = gs.enemies || [];
    const existingMap = new Map((ro.enemies || []).map(e => [e.id, e]));
    const updatedEnemies = [];

    for (const data of incomingEnemies) {
      if (existingMap.has(data.id)) {
        const existing = existingMap.get(data.id);
        existing.updateState(data);
        updatedEnemies.push(existing);
      } else {
        updatedEnemies.push(new RemoteEnemy(data));
      }
    }
    ro.enemies = updatedEnemies;

    // Boss
    if (gs.boss) {
      const isEvent = !!gs.boss.isEventBoss;
      if (!ro.boss || (isEvent && !(ro.boss instanceof RemoteEventBoss)) || (!isEvent && (ro.boss instanceof RemoteEventBoss))) {
        ro.boss = isEvent ? new RemoteEventBoss(gs.boss) : new RemoteBoss(gs.boss);
      } else {
        ro.boss.updateState(gs.boss);
      }
    } else {
      ro.boss = null;
    }
    if (typeof updateBossHUD === 'function') {
      updateBossHUD();
    }

    // Boss Bullets: Match closest existing or create new
    const incomingBullets = gs.bossBullets || [];
    const oldBullets = ro.bossBullets || [];
    const updatedBullets = [];
    const usedIndices = new Set();

    for (const bData of incomingBullets) {
      let matchedIdx = -1;
      let minDistance = 60; // Max distance to associate bullet
      for (let i = 0; i < oldBullets.length; i++) {
        if (usedIndices.has(i)) continue;
        const d = Math.hypot(oldBullets[i].x - bData.x, oldBullets[i].y - bData.y);
        if (d < minDistance) {
          minDistance = d;
          matchedIdx = i;
        }
      }
      if (matchedIdx !== -1) {
        usedIndices.add(matchedIdx);
        oldBullets[matchedIdx].updateState(bData);
        updatedBullets.push(oldBullets[matchedIdx]);
      } else {
        updatedBullets.push(new RemoteBossBullet(bData));
      }
    }
    ro.bossBullets = updatedBullets;

    // Score/time sync
    if (typeof score !== 'undefined' && gs.score != null) score = gs.score;
    if (typeof bossBattleElapsedTime !== 'undefined' && gs.bossBattleElapsedTime != null) {
      bossBattleElapsedTime = gs.bossBattleElapsedTime;
    }
    if (typeof bossWarningTimeRemaining !== 'undefined' && gs.bossWarningTimeRemaining != null) {
      // Don't overwrite if local is further along
      if (gs.bossWarningTimeRemaining < bossWarningTimeRemaining) {
        bossWarningTimeRemaining = gs.bossWarningTimeRemaining;
      }
    }
  }

  // ── Apply skill effect spawned by a remote player ─────
  _applyRemoteSkillEffect(fromPeerId, data) {
    const rp = this.remotePlayers[fromPeerId];

    try {
      switch (data.skill) {
        case 'blink':
          if (typeof Shockwave !== 'undefined') {
            shockwaves.push(new Shockwave(data.destX, data.destY, 125, rp?.color || '#38bdf8', 9));
            for (let i = 0; i < 18; i++) {
              const a = Math.random() * Math.PI * 2, s = Math.random() * 6 + 2;
              particles.push(new Particle(data.destX, data.destY, Math.cos(a)*s, Math.sin(a)*s, rp?.color || '#38bdf8', 3, 20));
            }
          }
          break;

        case 'slash':
          if (typeof SlashEffect !== 'undefined') {
            slashEffects.push(new SlashEffect(data.startX, data.startY, data.endX, data.endY, data.targetRadius || 35));
            if (typeof shockwaves !== 'undefined') {
              shockwaves.push(new Shockwave(data.targetX, data.targetY, 180, rp?.color || '#ef4444', 12));
            }
          }
          break;

        case 'homing':
          if (typeof HomingBullet !== 'undefined') {
            homingBullets.push(new HomingBullet(data.x, data.y, data.vx, data.vy));
          }
          break;

        case 'summon':
          if (typeof Shockwave !== 'undefined') {
            shockwaves.push(new Shockwave(data.x, data.y, 90, rp?.color || '#c084fc', 6));
          }
          break;

        case 'ultimate_on':
          if (typeof floatingTexts !== 'undefined' && typeof FloatingText !== 'undefined') {
            floatingTexts.push(new FloatingText(
              rp?.x ?? data.x ?? 0,
              (rp?.y ?? data.y ?? 0) - 35,
              `🔥 ${rp?.name || 'Player'} 必殺モード！`,
              rp?.color || '#f59e0b'
            ));
          }
          break;
      }
    } catch (e) {
      console.warn('[MP] skill effect error:', e);
    }
  }

  // ── HOST: Process bullet hit report ───────────────────
  _processBulletHit(fromPeerId, data) {
    try {
      if (data.targetType === 'boss') {
        if (typeof damageBoss === 'function') damageBoss(data.amount || 1);
        if (typeof addScore   === 'function') addScore(20);
      } else if (data.targetType === 'enemy') {
        if (typeof enemies === 'undefined') return;
        let e = null;
        let enemyIdx = -1;
        if (data.enemyId != null) {
          enemyIdx = enemies.findIndex(item => item.id === data.enemyId);
          if (enemyIdx !== -1) e = enemies[enemyIdx];
        }
        if (!e && data.enemyIndex != null && enemies[data.enemyIndex]) {
          enemyIdx = data.enemyIndex;
          e = enemies[enemyIdx];
        }
        if (e && e.hp > 0) {
          e.hp -= (data.amount || 1);
          if (e.hp <= 0) {
            if (typeof createExplosion === 'function') {
              const col = e.type === 'large' ? '#ff2a6d' : (e.type === 'shooter' ? '#a855f7' : (e.type === 'chaser' ? '#f59e0b' : '#ff5555'));
              createExplosion(e.x, e.y, col, e.type === 'large');
            }
            if (typeof addScore === 'function') addScore(e.type === 'large' ? 300 : (e.type === 'shooter' ? 150 : (e.type === 'chaser' ? 200 : 100)));
            if (typeof addWP    === 'function' && fromPeerId === '__self_host__') addWP(e.type === 'large' ? 3 : 1);
            if (typeof addUEP   === 'function' && fromPeerId === '__self_host__') addUEP(e.type === 'large' ? 3 : 1);
            if (enemyIdx !== -1) {
              enemies.splice(enemyIdx, 1);
            }
          }
        }
      }
    } catch (e) {
      console.warn('[MP] bullet hit error:', e);
    }
  }

  // ── HOST: Process revival progress ────────────────────
  _processReviveProgress(fromPeerId, data) {
    // Normalize targetPeerId if targeting host
    const isTargetHost = (data.targetPeerId === '__host__' || data.targetPeerId === this.peer?.id || data.targetPeerId === this.hostPeerId);
    const normalizedTarget = isTargetHost ? '__host__' : data.targetPeerId;
    const key = `${fromPeerId}_${normalizedTarget}`;

    // Confirm target is still down
    let stillDown = false;
    if (isTargetHost) {
      stillDown = (typeof player !== 'undefined') && (player.isDown || player.hp <= 0);
    } else if (this.remotePlayers[normalizedTarget]) {
      stillDown = this.remotePlayers[normalizedTarget].isDown;
    }

    if (!stillDown) { delete this.revivalTimers[key]; return; }

    this.revivalTimers[key] = (this.revivalTimers[key] || 0) + data.dt;
    const progress = Math.min(1, this.revivalTimers[key] / 3.0);

    // Broadcast using both normalized ID and host's actual peerId so all clients match
    this._broadcast({
      type:         MP_MSG.REVIVE_PROGRESS_BCAST,
      reviverPeerId: fromPeerId,
      targetPeerId:  normalizedTarget,
      progress
    });

    if (this.revivalTimers[key] >= 3.0) {
      delete this.revivalTimers[key];
      this._executeRevive(normalizedTarget);
    }
  }

  // ── HOST: Execute revival ─────────────────────────────
  _executeRevive(targetPeerId) {
    let newMaxHp = 1;
    const isTargetHost = (targetPeerId === '__host__' || targetPeerId === this.peer?.id || targetPeerId === this.hostPeerId);

    if (isTargetHost) {
      if (typeof player === 'undefined') return;
      player.maxHp           = Math.max(1, player.maxHp - 20);
      player.hp              = player.maxHp;
      player.isDown          = false;
      player.revivalProgress = 0;
      player.invincibleTimer = 120;
      newMaxHp               = player.maxHp;
      if (typeof showToast    === 'function') showToast(`✨ 復活！ (最大HP: ${player.maxHp})`);
      if (typeof floatingTexts !== 'undefined' && typeof FloatingText !== 'undefined') {
        floatingTexts.push(new FloatingText(player.x, player.y - 40, '✨ 復活！', '#7ee787'));
      }
    } else {
      const rp = this.remotePlayers[targetPeerId];
      if (!rp) return;
      newMaxHp      = Math.max(1, rp.maxHp - 20);
      rp.hp         = newMaxHp;
      rp.maxHp      = newMaxHp;
      rp.isDown     = false;
      rp.revivalProgress = 0;
      if (this.lastPlayerStates[targetPeerId]) {
        this.lastPlayerStates[targetPeerId].isDown = false;
        this.lastPlayerStates[targetPeerId].maxHp  = newMaxHp;
        this.lastPlayerStates[targetPeerId].hp      = newMaxHp;
      }
    }

    // Broadcast both __host__ and hostPeerId if host so clients update their remotePlayer and self correctly
    this._broadcast({ type: MP_MSG.PLAYER_REVIVED, peerId: isTargetHost ? '__host__' : targetPeerId, newMaxHp });
    if (isTargetHost && this.peer?.id) {
      this._broadcast({ type: MP_MSG.PLAYER_REVIVED, peerId: this.peer.id, newMaxHp });
    }
  }

  // ── CLIENT: Self-revived ──────────────────────────────
  _selfRevived(newMaxHp) {
    if (typeof player === 'undefined') return;
    player.maxHp          = newMaxHp;
    player.hp             = newMaxHp;
    player.isDown         = false;
    player.revivalProgress = 0;
    player.invincibleTimer = 120;
    if (typeof showToast === 'function') showToast(`✨ 復活！ (最大HP: ${newMaxHp})`);
    if (typeof floatingTexts !== 'undefined' && typeof FloatingText !== 'undefined') {
      floatingTexts.push(new FloatingText(player.x, player.y - 40, '✨ 復活！', '#7ee787'));
    }
  }

  // ── HOST: Check if all players are down ───────────────
  _checkAllDown() {
    if (!this.isHost || !this.active) return;
    if (typeof player === 'undefined') return;

    const hostAlive   = !player.isDown && player.hp > 0;
    const clientAlive = Object.values(this.remotePlayers).some(rp => !rp.isDown);

    if (!hostAlive && !clientAlive) {
      this._broadcast({ type: MP_MSG.GAME_OVER, reason: 'all_down' });
      if (typeof gameOver === 'function') gameOver();
    }
  }

  // ── Revival check — call from game loop ───────────────
  // Returns true if local player is actively reviving someone
  checkRevival(dt) {
    if (!this.active || typeof player === 'undefined') return;
    if (player.isDown || player.hp <= 0) return;

    for (const [peerId, rp] of Object.entries(this.remotePlayers)) {
      if (!rp.isDown) continue;

      const dist = Math.hypot(player.x - rp.displayX, player.y - rp.displayY);
      if (dist < player.grazeRadius + rp.radius + 8) {
        // If client is reviving host, targetPeerId can be '__host__' or host peerId
        const targetPeerId = (!this.isHost && (peerId === this.hostPeerId || peerId === '__host__')) ? '__host__' : peerId;
        const msg = { type: MP_MSG.REVIVE_PROGRESS, targetPeerId, dt };
        if (this.isHost) {
          this._processReviveProgress('__self_host__', { ...msg, targetPeerId });
        } else {
          const hc = this.connections[this.hostPeerId];
          if (hc && hc.open) this._send(hc, msg);
        }
        return; // Only revive one at a time
      }
    }
  }

  // ── Send player state now (called from game loop) ─────
  sendPlayerState() {
    if (!this.active || typeof player === 'undefined') return;
    const msg = {
      type:             MP_MSG.PLAYER_STATE,
      peerId:           this.peer?.id || (this.isHost ? '__host__' : null),
      x:                player.x,
      y:                player.y,
      angle:            player.angle,
      hp:               player.hp,
      maxHp:            player.maxHp,
      isGuarding:       player.isGuarding,
      isDashing:        player.isDashing,
      isDown:           player.isDown || false,
      grazeEffectTimer: player.grazeEffectTimer || 0
    };

    if (this.isHost) {
      this._broadcast(msg);
    } else {
      const hc = this.connections[this.hostPeerId];
      if (hc && hc.open) this._send(hc, msg);
    }
  }

  // ── Send skill event ──────────────────────────────────
  sendSkillEvent(eventData) {
    const msg = { type: MP_MSG.SKILL_EVENT, ...eventData };
    if (this.isHost) {
      this._broadcast(msg);
    } else {
      const hc = this.connections[this.hostPeerId];
      if (hc && hc.open) this._send(hc, msg);
    }
  }

  // ── Report bullet hit to host ─────────────────────────
  reportBulletHit(targetType, targetId, amount) {
    const msg = {
      type: MP_MSG.BULLET_HIT,
      targetType,
      enemyId: targetType === 'enemy' ? targetId : null,
      enemyIndex: (typeof targetId === 'number' && targetId < 1000) ? targetId : null,
      amount
    };
    if (this.isHost) {
      this._processBulletHit('__self_host__', msg);
    } else {
      const hc = this.connections[this.hostPeerId];
      if (hc && hc.open) this._send(hc, msg);
    }
  }

  // ── Broadcast local player's down event ──────────────
  broadcastDown() {
    const msg = { type: MP_MSG.PLAYER_DOWN, peerId: this.peer?.id || '__host__' };
    if (this.isHost) {
      this._broadcastExcept(null, msg);
    } else {
      const hc = this.connections[this.hostPeerId];
      if (hc && hc.open) this._send(hc, msg);
    }
  }

  // ── Get all alive player positions (for boss targeting) ─
  getAliveTargets() {
    const targets = [];
    if (typeof player !== 'undefined' && !player.isDown && player.hp > 0) {
      targets.push({ x: player.x, y: player.y });
    }
    for (const rp of Object.values(this.remotePlayers)) {
      if (!rp.isDown) targets.push({ x: rp.x, y: rp.y });
    }
    return targets;
  }

  // ── Broadcast intervals ───────────────────────────────
  _startLoops() {
    // Player state: ~30fps
    if (this._stateInterval) clearInterval(this._stateInterval);
    this._stateInterval = setInterval(() => {
      if (!this.active) return;
      this.sendPlayerState();
    }, 33);

    // Game state (host only): ~20fps (50ms)
    if (this.isHost) {
      if (this._gameStateInterval) clearInterval(this._gameStateInterval);
      this._gameStateInterval = setInterval(() => {
        if (!this.active || typeof gameState === 'undefined' || gameState !== 'PLAYING') return;
        this._broadcastGameState();
      }, 50);
    }
  }

  _broadcastGameState() {
    try {
      const gs = {
        type:    MP_MSG.GAME_STATE,
        enemies: (typeof enemies !== 'undefined') ? enemies.map(e => ({
          id: e.id,
          x: e.x, y: e.y, vx: e.vx, vy: e.vy, hp: e.hp, maxHp: e.maxHp, type: e.type,
          radius: e.radius, angle: e.angle, hasShot: e.hasShot
        })) : [],
        boss: (typeof boss !== 'undefined' && boss && boss.hp > 0) ? {
          x: boss.x, y: boss.y, hp: boss.hp, maxHp: boss.maxHp,
          radius: boss.radius, angle: boss.angle,
          isEventBoss: !!boss.isEventBoss,
          totalDamage: boss.totalDamage || 0,
          enrageLevel: boss.enrageLevel || 1,
          laserActive: !!boss.laserActive,
          laserAngle:  boss.laserAngle || 0
        } : null,
        bossBullets: (typeof bossBullets !== 'undefined') ? bossBullets.map(b => ({
          x: b.x, y: b.y, vx: b.vx, vy: b.vy, radius: b.radius
        })) : [],
        score:                    (typeof score                    !== 'undefined') ? score : 0,
        bossBattleElapsedTime:    (typeof bossBattleElapsedTime    !== 'undefined') ? bossBattleElapsedTime : 0,
        bossWarningTimeRemaining: (typeof bossWarningTimeRemaining !== 'undefined') ? bossWarningTimeRemaining : 0
      };
      this._broadcast(gs);
    } catch (e) {
      console.warn('[MP] broadcastGameState error:', e);
    }
  }

  // ── Send / Broadcast helpers ──────────────────────────
  _send(conn, data) {
    try { if (conn && conn.open) conn.send(data); } catch (e) { console.warn('[MP] send error:', e); }
  }

  _broadcast(data) {
    for (const conn of Object.values(this.connections)) this._send(conn, data);
  }

  _broadcastExcept(excludePeerId, data) {
    for (const [pid, conn] of Object.entries(this.connections)) {
      if (pid !== excludePeerId) this._send(conn, data);
    }
  }

  // ── PeerJS initialization ─────────────────────────────
  _initPeer(peerId = null) {
    return new Promise((resolve, reject) => {
      const cfg = {
        debug: 0,
        config: {
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' }
          ]
        }
      };

      this.peer = peerId ? new Peer(peerId, cfg) : new Peer(cfg);

      const timer = setTimeout(() => {
        if (!this.peer.open) reject(new Error('接続タイムアウト（10秒）'));
      }, 10000);

      this.peer.on('open', id => { clearTimeout(timer); resolve(id); });
      this.peer.on('error', err => {
        clearTimeout(timer);
        const msg = err.type === 'unavailable-id'
          ? 'IDが使用中です。少し待って再試行してください'
          : (err.message || 'ネットワークエラー');
        reject(new Error(msg));
      });
    });
  }

  // ── Cleanup ───────────────────────────────────────────
  cleanup() {
    this.active = false;
    if (this._stateInterval)     clearInterval(this._stateInterval);
    if (this._gameStateInterval) clearInterval(this._gameStateInterval);

    for (const conn of Object.values(this.connections)) {
      try { conn.close(); } catch (e) {}
    }
    this.connections      = {};
    this.remotePlayers    = {};
    this.lobbyPlayers     = [];
    this.lastPlayerStates = {};
    this.revivalTimers    = {};
    this.remoteGameObjects = { enemies: [], boss: null, bossBullets: [] };

    if (window.firestoreDb && this.roomDocId && this.isHost) {
      window.firestoreDb.collection('mp_rooms').doc(this.roomDocId)
        .update({ status: 'ended' }).catch(() => {});
    }

    if (this.peer && !this.peer.destroyed) {
      try { this.peer.destroy(); } catch (e) {}
    }
    this.peer = null;
  }
}

// Expose globally
window.MultiplayerManager = MultiplayerManager;
window.multiplayerManager  = null;   // Set when game is started
window.isMultiplayerMode   = false;
window.multiHpMult         = 1;      // HP multiplier for enemies/boss
