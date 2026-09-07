// 2D Action STG: WASD Movement, Right-Click Dash, Left-Click Shoot, Enemies & HP

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// UI Elements
const skillSlot = document.getElementById('skillSlot');
const cooldownOverlay = document.getElementById('cooldownOverlay');
const cooldownText = document.getElementById('cooldownText');
const bombSlot = document.getElementById('bombSlot');
const bombCooldownOverlay = document.getElementById('bombCooldownOverlay');
const bombCooldownText = document.getElementById('bombCooldownText');
const homingSlot = document.getElementById('homingSlot');
const homingCooldownOverlay = document.getElementById('homingCooldownOverlay');
const homingCooldownText = document.getElementById('homingCooldownText');
const summonSlot = document.getElementById('summonSlot');
const summonCooldownOverlay = document.getElementById('summonCooldownOverlay');
const summonCooldownText = document.getElementById('summonCooldownText');

const touchSkillBtn = document.getElementById('touchSkillBtn');
const touchCooldownOverlay = document.getElementById('touchCooldownOverlay');
const touchCooldownText = document.getElementById('touchCooldownText');
const touchBombBtn = document.getElementById('touchBombBtn');
const touchBombCooldownOverlay = document.getElementById('touchBombCooldownOverlay');
const touchBombCooldownText = document.getElementById('touchBombCooldownText');
const touchHomingBtn = document.getElementById('touchHomingBtn');
const touchHomingCooldownOverlay = document.getElementById('touchHomingCooldownOverlay');
const touchHomingCooldownText = document.getElementById('touchHomingCooldownText');
const touchSummonBtn = document.getElementById('touchSummonBtn');
const touchSummonCooldownOverlay = document.getElementById('touchSummonCooldownOverlay');
const touchSummonCooldownText = document.getElementById('touchSummonCooldownText');

// Ultimate Mode UI Elements & State
const ultBtn = document.getElementById('ultBtn');
const touchUltBtn = document.getElementById('touchUltBtn');
const ultScreenFlash = document.getElementById('ultScreenFlash');
let isUltimateMode = false;
let slowMoTimer = 0;
let timeScale = 1.0;
const slashEffects = [];

// Multiplayer UI element references (set after DOM ready)
let menuStepMultiSub, menuStepMultiCreateMode, menuStepMultiCreateForm, menuStepMultiBossCreate;
let menuStepMultiJoinMode, menuStepMultiJoinForm, menuStepMultiWait;
let multiCreateBtn, multiJoinBtn, backToModeFromMultiBtn;
let multiCreateScoreBtn, multiCreateBossBtn, multiCreateEventBossBtn, backToMultiSubFromCreateBtn;
let multiCreateName, multiCreatePasscode, playerCountMinusBtn, playerCountPlusBtn, playerCountVal;
let multiCreateRoomBtn, multiCreateError, multiCreateConnecting, backToMultiCreateModeBtn, backToMultiCreateFormBtn;
let multiJoinScoreBtn, multiJoinBossBtn, multiJoinEventBossBtn, backToMultiSubFromJoinBtn;
let multiJoinName, multiJoinPasscode, multiJoinRoomBtn, multiJoinError, multiJoinConnecting, backToMultiJoinModeBtn;
let multiPlayerList, multiWaitPasscode, multiWaitHint, multiStartGameBtn, backFromMultiWaitBtn;
let multiWaitBossLevelBar, multiWaitBossLvlMinusBtn, multiWaitBossLvlPlusBtn, multiWaitBossLvlText, multiWaitTitle;

// Multiplayer runtime state
let multiBossLevel = 1;
let _multiIsCreator  = true;  // true = host side, false = join side
let _multiMaxPlayers = 2;
let _pendingMultiMode = 'SCORE_ATTACK'; // 'SCORE_ATTACK' or 'BOSS'


const guideText = document.getElementById('guideText');
const guideOverlay = document.getElementById('guideOverlay');
const scoreVal = document.getElementById('scoreVal');
const damageFlash = document.getElementById('damageFlash');
const startScreen = document.getElementById('startScreen');
const startBtn = document.getElementById('startBtn');
const startGuideList = document.getElementById('startGuideList');
const menuStepMain = document.getElementById('menuStepMain');
const menuStepMode = document.getElementById('menuStepMode');
const menuStepSoloSub = document.getElementById('menuStepSoloSub');
const soloModeBtn = document.getElementById('soloModeBtn');
const multiModeBtn = document.getElementById('multiModeBtn');
const backToMainBtn = document.getElementById('backToMainBtn');
const scoreAttackBtn = document.getElementById('scoreAttackBtn');
const bossBattleBtn = document.getElementById('bossBattleBtn');
const eventBossBtn = document.getElementById('eventBossBtn');
const menuStepBossLevel = document.getElementById('menuStepBossLevel');
const bossStartGameBtn = document.getElementById('bossStartGameBtn');
const backToSoloSubBtn = document.getElementById('backToSoloSubBtn');
const bossLvlMinusBtn = document.getElementById('bossLvlMinusBtn');
const bossLvlPlusBtn = document.getElementById('bossLvlPlusBtn');
const bossLvlText = document.getElementById('bossLvlText');
const bossHud = document.getElementById('bossHud');
const bossHpFill = document.getElementById('bossHpFill');
const bossHpVal = document.getElementById('bossHpVal');
const bossWarningOverlay = document.getElementById('bossWarningOverlay');
const bossWarningTimer = document.getElementById('bossWarningTimer');
const toastNotice = document.getElementById('toastNotice');
const backToModeBtn = document.getElementById('backToModeBtn');
const gameOverScreen = document.getElementById('gameOverScreen');
const finalScoreVal = document.getElementById('finalScoreVal');
const finalStatLabel = document.getElementById('finalStatLabel');
const statLabel = document.getElementById('statLabel');
const restartBtn = document.getElementById('restartBtn');
const homeBtn = document.getElementById('homeBtn');

// Leaderboard Modal Elements
const soloLeaderboardBtn = document.getElementById('soloLeaderboardBtn');
const bossStepLeaderboardBtn = document.getElementById('bossStepLeaderboardBtn');
const gameoverLeaderboardBtn = document.getElementById('gameoverLeaderboardBtn');
const leaderboardModal = document.getElementById('leaderboardModal');
const closeLeaderboardBtn = document.getElementById('closeLeaderboardBtn');
const closeLeaderboardBottomBtn = document.getElementById('closeLeaderboardBottomBtn');
const lbTabScore = document.getElementById('lbTabScore');
const lbTabBoss = document.getElementById('lbTabBoss');
const lbBossLevelBar = document.getElementById('lbBossLevelBar');
const lbBossLvlMinusBtn = document.getElementById('lbBossLvlMinusBtn');
const lbBossLvlPlusBtn = document.getElementById('lbBossLvlPlusBtn');
const lbBossLvlText = document.getElementById('lbBossLvlText');
const lbTableBody = document.getElementById('lbTableBody');
const lbColStatHeader = document.getElementById('lbColStatHeader');
const lbLoadingText = document.getElementById('lbLoadingText');
const lbEmptyText = document.getElementById('lbEmptyText');

// Record Register Modal Elements
const recordModal = document.getElementById('recordModal');
const recordModalTitle = document.getElementById('recordModalTitle');
const recordModalSubtitle = document.getElementById('recordModalSubtitle');
const recordValLabel = document.getElementById('recordValLabel');
const recordValNum = document.getElementById('recordValNum');
const playerNameInput = document.getElementById('playerNameInput');
const submitRecordBtn = document.getElementById('submitRecordBtn');
const skipRecordBtn = document.getElementById('skipRecordBtn');

// Leaderboard Client State
let currentLeaderboardTab = 'SCORE_ATTACK'; // 'SCORE_ATTACK' or 'BOSS'
let currentLeaderboardDevice = 'pc'; // 'pc' or 'mobile'
let currentLeaderboardCategory = 'solo'; // 'solo' or 'multi'
let leaderboardBossLevel = 1;
const lbDeviceTabPC = document.getElementById('lbDeviceTabPC');
const lbDeviceTabMobile = document.getElementById('lbDeviceTabMobile');
const lbCatTabSolo = document.getElementById('lbCatTabSolo');
const lbCatTabMulti = document.getElementById('lbCatTabMulti');
let cachedLeaderboardData = null;
let pendingRecordToRegister = null;

// Gauges
const hpFill = document.getElementById('hpFill');
const hpVal = document.getElementById('hpVal');
const mpFill = document.getElementById('mpFill');
const mpVal = document.getElementById('mpVal');
const wpVal = document.getElementById('wpVal');
const uepVal = document.getElementById('uepVal');

// Joystick Elements
const joystickContainer = document.getElementById('joystickContainer');
const joystickBase = document.getElementById('joystickBase');
const joystickStick = document.getElementById('joystickStick');

// Canvas Resize Handling
function resizeCanvas() {
  const container = document.getElementById('gameContainer') || document.body;
  const rect = container.getBoundingClientRect();
  canvas.width = Math.floor(rect.width);
  canvas.height = Math.floor(rect.height);
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Game State & Mode
let gameState = 'START';
let gameMode = 'SCORE_ATTACK'; // 'SCORE_ATTACK' or 'BOSS'
let bossWarningTimeRemaining = 0;
let bossBattleElapsedTime = 0;
let bossLevel = 1;
let score = 0;

// Score Attack 10,000 pts Boss & Time-based Score
let scoreBossTriggered = false;
let scoreBossDefeated = false;
let timeScoreAccumulator = 0;

// Input State
const keys = {
  w: false,
  a: false,
  s: false,
  d: false,
  ArrowUp: false,
  ArrowLeft: false,
  ArrowDown: false,
  ArrowRight: false
};

const mouse = {
  x: canvas.width / 2,
  y: canvas.height * 0.4
};

let isShooting = false;
let lastShootTime = 0;
const shootInterval = 130; // 130ms between bullets

let isHomingShooting = false;
let lastHomingShootTime = 0;
const homingShootInterval = 260; // 2x normal bullet span (260ms)

let isGuardHolding = false;

let isTouchMode = false;
let joystickTouchId = null;
let aimTouchId = null;
let homingTouchId = null;
let guardTouchId = null;
let joystickCenter = { x: 0, y: 0 };
let touchMoveVec = { x: 0, y: 0 };
const maxJoystickRadius = 45;

// Check if player is on Mobile/Touch device or PC
function checkIsMobile() {
  const hasTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);
  const isMobileUA = /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  return isTouchMode || hasTouch || isMobileUA;
}

function switchToTouchMode() {
  if (!isTouchMode) {
    isTouchMode = true;
    document.body.classList.add('touch-device');
    if (guideText) {
      guideText.innerHTML = `
        <div><span class="key">左下スティック</span>: 移動</div>
        <div><span class="key">画面ドラッグ</span>: 照準 & 射撃</div>
        <div><span class="key">右下🎯</span>: 追尾弾 (EP 3 長押し)</div>
        <div><span class="key">右下⚡</span>: ブリンク (EP 10)</div>
        <div><span class="key">右下🛡️</span>: 無敵ガード (10 EP/s 長押し)</div>
        <div><span class="key">右下🤖</span>: しょったー召喚 (WP 20 + EP 50)</div>
        <div><span class="key">右下🔥</span>: 必殺技 (WP 100 + EP 100)</div>
        <div style="margin-top: 3px; color: #f59e0b; font-size: 11px;">※必殺中ブリンクで「一刀両断(100dmg)」発動！</div>
      `;
    }
    if (startGuideList) {
      startGuideList.innerHTML = `
        <div class="start-guide-item"><span>移動</span><span class="key">左下スティック</span></div>
        <div class="start-guide-item"><span>照準 & 射撃</span><span class="key">画面ドラッグ</span></div>
        <div class="start-guide-item"><span>追尾弾</span><span class="key">右下🎯長押し (EP 3)</span></div>
        <div class="start-guide-item"><span>高速ブリンク</span><span class="key">右下⚡ボタン (EP 10)</span></div>
        <div class="start-guide-item"><span>無敵ガード</span><span class="key">右下🛡️長押し (10 EP/s)</span></div>
        <div class="start-guide-item"><span>味方召喚</span><span class="key">右下🤖ボタン (WP 20 + EP 50)</span></div>
        <div class="start-guide-item"><span>必殺技</span><span class="key">右下🔥ボタン (WP 100 + EP 100)</span></div>
      `;
    }
  }
}

if ('ontouchstart' in window || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0 && /Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent))) {
  switchToTouchMode();
}

// Keyboard Listeners
window.addEventListener('keydown', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'w' || e.key === 'ArrowUp') keys.w = true;
  if (k === 'a' || e.key === 'ArrowLeft') keys.a = true;
  if (k === 's' || e.key === 'ArrowDown') keys.s = true;
  if (k === 'd' || e.key === 'ArrowRight') keys.d = true;

  // R triggers Ultimate Mode Toggle (WP 100 + EP 100)
  if (k === 'r') {
    if (gameState === 'PLAYING') {
      toggleUltimateMode();
    }
  }

  // E triggers Summon Minion Skill (WP 20 + EP 50)
  if (k === 'e') {
    if (gameState === 'PLAYING') {
      activateSummonSkill();
    }
  }

  // Q or F triggers Homing Bullet (hold to fire continuously)
  if (k === 'q' || k === 'f') {
    if (gameState === 'PLAYING' && !isUltimateMode) {
      isHomingShooting = true;
    }
  }

  // Space or B triggers Guard (hold to maintain barrier) or starts game
  if (e.key === ' ' || k === 'b') {
    if (gameState === 'START') {
      if (menuStepMain && menuStepMain.style.display !== 'none') {
        showMenuStep('mode');
      } else if (menuStepMode && menuStepMode.style.display !== 'none') {
        showMenuStep('solo');
      } else if (menuStepSoloSub && menuStepSoloSub.style.display !== 'none') {
        startGame('SCORE_ATTACK');
      } else if (menuStepBossLevel && menuStepBossLevel.style.display !== 'none') {
        startGame('BOSS');
      }
    } else if (gameState === 'PLAYING') {
      if (!isUltimateMode) {
        isGuardHolding = true;
      }
    } else if (gameState === 'GAMEOVER') {
      restartGame();
    }
  } else if (e.key === 'Enter') {
    if (gameState === 'START') {
      if (menuStepMain && menuStepMain.style.display !== 'none') {
        showMenuStep('mode');
      } else if (menuStepMode && menuStepMode.style.display !== 'none') {
        showMenuStep('solo');
      } else if (menuStepSoloSub && menuStepSoloSub.style.display !== 'none') {
        startGame('SCORE_ATTACK');
      } else if (menuStepBossLevel && menuStepBossLevel.style.display !== 'none') {
        startGame('BOSS');
      }
    } else if (gameState === 'GAMEOVER') {
      restartGame();
    }
  }
});

window.addEventListener('keyup', (e) => {
  const k = e.key.toLowerCase();
  if (k === 'w' || e.key === 'ArrowUp') keys.w = false;
  if (k === 'a' || e.key === 'ArrowLeft') keys.a = false;
  if (k === 's' || e.key === 'ArrowDown') keys.s = false;
  if (k === 'd' || e.key === 'ArrowRight') keys.d = false;

  if (k === 'q' || k === 'f') {
    isHomingShooting = false;
  }

  if (e.key === ' ' || k === 'b') {
    isGuardHolding = false;
  }
});

// Mouse Listeners
window.addEventListener('mousemove', (e) => {
  if (!isTouchMode) {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  }
});

window.addEventListener('mousedown', (e) => {
  if (gameState !== 'PLAYING') return;
  if (e.button === 0) { // Left click
    isShooting = true;
  }
});

window.addEventListener('mouseup', (e) => {
  if (e.button === 0) {
    isShooting = false;
  }
});

// Prevent Context Menu on Right Click and trigger Skill (PC)
window.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  if (gameState === 'PLAYING') {
    activateSkill();
  }
});

// PC Ultimate Button Click
if (ultBtn) {
  ultBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleUltimateMode();
  });
}

// PC Skill Slots Click Handlers
if (skillSlot) {
  skillSlot.addEventListener('click', (e) => {
    e.preventDefault();
    if (gameState === 'PLAYING') activateSkill();
  });
}
if (summonSlot) {
  summonSlot.addEventListener('click', (e) => {
    e.preventDefault();
    if (gameState === 'PLAYING' && !isUltimateMode) activateSummonSkill();
  });
}

// Touch Handling
function updateJoystickCenter() {
  const rect = joystickContainer.getBoundingClientRect();
  joystickCenter = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2
  };
}
updateJoystickCenter();
window.addEventListener('resize', updateJoystickCenter);

// Joystick active touch radius is ~1.5x of joystick icon radius
function getJoystickActiveRadius() {
  return (joystickContainer.offsetWidth / 2) * 1.5;
}

window.addEventListener('touchstart', (e) => {
  switchToTouchMode();
  updateJoystickCenter();
  const activeRadius = getJoystickActiveRadius();

  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    const target = touch.target;

    // 0. Ultimate Button (Toggle Ultimate Mode)
    if (touchUltBtn && touchUltBtn.contains(target)) {
      if (gameState === 'PLAYING') toggleUltimateMode();
      continue;
    }

    // 1. Guard Button (Hold to activate barrier)
    if (touchBombBtn && touchBombBtn.contains(target)) {
      if (gameState === 'PLAYING') {
        if (!isUltimateMode) {
          guardTouchId = touch.identifier;
          isGuardHolding = true;
        }
      }
      continue;
    }

    // 2. Homing Button (Hold to fire continuously)
    if (touchHomingBtn && touchHomingBtn.contains(target)) {
      if (gameState === 'PLAYING') {
        if (!isUltimateMode) {
          homingTouchId = touch.identifier;
          isHomingShooting = true;
        }
      }
      continue;
    }

    // 3. Blink Skill Button
    if (touchSkillBtn && touchSkillBtn.contains(target)) {
      if (gameState === 'PLAYING') activateSkill();
      continue;
    }

    // 4. Summon Skill Button
    if (touchSummonBtn && touchSummonBtn.contains(target)) {
      if (gameState === 'PLAYING') {
        if (!isUltimateMode) {
          activateSummonSkill();
        }
      }
      continue;
    }

    // 4. Joystick Touch Area (1.5x of joystick icon size)
    const distToJoy = Math.hypot(touch.clientX - joystickCenter.x, touch.clientY - joystickCenter.y);
    if (distToJoy <= activeRadius && joystickTouchId === null) {
      joystickTouchId = touch.identifier;
      handleJoystickMove(touch.clientX, touch.clientY);
      continue;
    }

    // 5. Everywhere else -> Aiming & Shoot!
    if (gameState === 'PLAYING' && aimTouchId === null) {
      aimTouchId = touch.identifier;
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      isShooting = true;
    }
  }
}, { passive: false });

window.addEventListener('touchmove', (e) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];

    if (touch.identifier === joystickTouchId) {
      handleJoystickMove(touch.clientX, touch.clientY);
    } else if (touch.identifier === aimTouchId) {
      mouse.x = touch.clientX;
      mouse.y = touch.clientY;
      isShooting = true;
    }
  }
}, { passive: false });

function resetJoystick() {
  joystickTouchId = null;
  touchMoveVec.x = 0;
  touchMoveVec.y = 0;
  joystickStick.style.transform = 'translate(-50%, -50%)';
}

window.addEventListener('touchend', (e) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    if (touch.identifier === joystickTouchId) {
      resetJoystick();
    }
    if (touch.identifier === homingTouchId) {
      homingTouchId = null;
      isHomingShooting = false;
    }
    if (touch.identifier === guardTouchId) {
      guardTouchId = null;
      isGuardHolding = false;
    }
    if (touch.identifier === aimTouchId) {
      aimTouchId = null;
      isShooting = false;
    }
  }
});

window.addEventListener('touchcancel', (e) => {
  for (let i = 0; i < e.changedTouches.length; i++) {
    const touch = e.changedTouches[i];
    if (touch.identifier === joystickTouchId) resetJoystick();
    if (touch.identifier === homingTouchId) {
      homingTouchId = null;
      isHomingShooting = false;
    }
    if (touch.identifier === guardTouchId) {
      guardTouchId = null;
      isGuardHolding = false;
    }
    if (touch.identifier === aimTouchId) {
      aimTouchId = null;
      isShooting = false;
    }
  }
});

function handleJoystickMove(touchX, touchY) {
  const dx = touchX - joystickCenter.x;
  const dy = touchY - joystickCenter.y;
  const distance = Math.hypot(dx, dy);

  let clampedDist = Math.min(distance, maxJoystickRadius);
  let dirX = 0;
  let dirY = 0;

  if (distance > 0.001) {
    dirX = dx / distance;
    dirY = dy / distance;
  }

  const stickX = dirX * clampedDist;
  const stickY = dirY * clampedDist;
  joystickStick.style.transform = `translate(calc(-50% + ${stickX}px), calc(-50% + ${stickY}px))`;

  const power = Math.min(1.0, distance / maxJoystickRadius);
  touchMoveVec.x = dirX * power;
  touchMoveVec.y = dirY * power;

  if (aimTouchId === null && power > 0.15) {
    mouse.x = player.x + dirX * 150;
    mouse.y = player.y + dirY * 150;
  }
}

// Touch Button Click Listeners (fallbacks)
touchSkillBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (gameState === 'PLAYING') activateSkill();
});

if (touchBombBtn) {
  // Mouse / fallback for mobile guard button
  touchBombBtn.addEventListener('mousedown', (e) => {
    e.preventDefault();
    if (gameState === 'PLAYING') isGuardHolding = true;
  });
  window.addEventListener('mouseup', () => {
    if (isGuardHolding && isTouchMode) isGuardHolding = false;
  });
}

// Toast Notification
let toastTimeout = null;
function showToast(message) {
  if (!toastNotice) return;
  toastNotice.innerText = message;
  toastNotice.classList.add('show');
  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 2200);
}

// Menu Navigation Functions
function showMenuStep(step) {
  if (menuStepMain)     menuStepMain.style.display     = (step === 'main')           ? 'flex' : 'none';
  if (menuStepMode)     menuStepMode.style.display     = (step === 'mode')           ? 'flex' : 'none';
  if (menuStepSoloSub)  menuStepSoloSub.style.display  = (step === 'solo')           ? 'flex' : 'none';
  if (menuStepBossLevel) menuStepBossLevel.style.display = (step === 'bossLevel')    ? 'flex' : 'none';
  // Multiplayer steps
  if (menuStepMultiSub)        menuStepMultiSub.style.display        = (step === 'multiSub')        ? 'flex' : 'none';
  if (menuStepMultiCreateMode) menuStepMultiCreateMode.style.display = (step === 'multiCreateMode') ? 'flex' : 'none';
  if (menuStepMultiCreateForm) menuStepMultiCreateForm.style.display = (step === 'multiCreateForm') ? 'flex' : 'none';
  if (menuStepMultiBossCreate) menuStepMultiBossCreate.style.display = (step === 'multiBossCreate') ? 'flex' : 'none';
  if (menuStepMultiJoinMode)   menuStepMultiJoinMode.style.display   = (step === 'multiJoinMode')   ? 'flex' : 'none';
  if (menuStepMultiJoinForm)   menuStepMultiJoinForm.style.display   = (step === 'multiJoinForm')   ? 'flex' : 'none';
  if (menuStepMultiWait)       menuStepMultiWait.style.display       = (step === 'multiWait')       ? 'flex' : 'none';
}


function returnToStart() {
  gameState = 'START';
  if (gameOverScreen) gameOverScreen.style.display = 'none';
  if (recordModal) recordModal.style.display = 'none';
  if (leaderboardModal) leaderboardModal.style.display = 'none';
  if (startScreen) startScreen.style.display = 'flex';
  if (guideOverlay) guideOverlay.style.display = 'flex';
  if (bossHud) bossHud.style.display = 'none';
  if (bossWarningOverlay) bossWarningOverlay.style.display = 'none';
  // Cleanup multiplayer session if active
  if (window.multiplayerManager) {
    window.multiplayerManager.cleanup();
    window.multiplayerManager = null;
  }
  window.isMultiplayerMode = false;
  window.multiHpMult = 1;
  player.isDown    = false;
  player.revivalProgress = 0;
  player.reviveCount = 0;
  showMenuStep('main');

  // Reset battlefield state
  isUltimateMode = false;
  slowMoTimer = 0;
  timeScale = 1.0;
  slashEffects.length = 0;
  if (ultScreenFlash) ultScreenFlash.style.opacity = '0';

  boss = null;
  bossBullets.length = 0;
  bullets.length = 0;
  homingBullets.length = 0;
  summonMinions.length = 0;
  mpOrbs.length = 0;
  enemies.length = 0;
  particles.length = 0;
  shockwaves.length = 0;
  afterimages.length = 0;
  floatingTexts.length = 0;
  player.x = canvas.width / 2;
  player.y = canvas.height * 0.75;
  player.vx = 0;
  player.vy = 0;
  isShooting = false;
  isHomingShooting = false;
  aimTouchId = null;
  homingTouchId = null;
  scoreBossTriggered = false;
  scoreBossDefeated = false;
  timeScoreAccumulator = 0;
}

// Start Button -> Show Mode Select (Solo / Multi)
function addMenuBtnListeners(btn, action) {
  if (!btn) return;
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    action();
  });
  btn.addEventListener('touchend', (e) => {
    e.preventDefault();
    e.stopPropagation();
    action();
  }, { passive: false });
}


addMenuBtnListeners(startBtn, () => showMenuStep('mode'));
addMenuBtnListeners(soloModeBtn, () => showMenuStep('solo'));
addMenuBtnListeners(scoreAttackBtn, () => startGame('SCORE_ATTACK'));
addMenuBtnListeners(bossBattleBtn, () => showMenuStep('bossLevel'));
addMenuBtnListeners(eventBossBtn, () => startGame('EVENT_BOSS'));
addMenuBtnListeners(bossStartGameBtn, () => startGame('BOSS'));
addMenuBtnListeners(backToSoloSubBtn, () => showMenuStep('solo'));
addMenuBtnListeners(backToMainBtn, () => showMenuStep('main'));
addMenuBtnListeners(backToModeBtn, () => showMenuStep('mode'));

// --- Multiplayer Menu UI Initializer & Event Listeners ---
function initMultiplayerUI() {
  menuStepMultiSub        = document.getElementById('menuStepMultiSub');
  menuStepMultiCreateMode = document.getElementById('menuStepMultiCreateMode');
  menuStepMultiCreateForm = document.getElementById('menuStepMultiCreateForm');
  menuStepMultiJoinMode   = document.getElementById('menuStepMultiJoinMode');
  menuStepMultiJoinForm   = document.getElementById('menuStepMultiJoinForm');
  menuStepMultiWait       = document.getElementById('menuStepMultiWait');

  multiCreateBtn             = document.getElementById('multiCreateBtn');
  multiJoinBtn               = document.getElementById('multiJoinBtn');
  backToModeFromMultiBtn     = document.getElementById('backToModeFromMultiBtn');
  multiCreateScoreBtn        = document.getElementById('multiCreateScoreBtn');
  backToMultiSubFromCreateBtn= document.getElementById('backToMultiSubFromCreateBtn');
  multiCreateName            = document.getElementById('multiCreateName');
  multiCreatePasscode        = document.getElementById('multiCreatePasscode');
  playerCountMinusBtn        = document.getElementById('playerCountMinusBtn');
  playerCountPlusBtn         = document.getElementById('playerCountPlusBtn');
  playerCountVal             = document.getElementById('playerCountVal');
  multiCreateRoomBtn         = document.getElementById('multiCreateRoomBtn');
  multiCreateError           = document.getElementById('multiCreateError');
  multiCreateConnecting      = document.getElementById('multiCreateConnecting');
  backToMultiCreateModeBtn   = document.getElementById('backToMultiCreateModeBtn');
  multiJoinScoreBtn          = document.getElementById('multiJoinScoreBtn');
  backToMultiSubFromJoinBtn  = document.getElementById('backToMultiSubFromJoinBtn');
  multiJoinName              = document.getElementById('multiJoinName');
  multiJoinPasscode          = document.getElementById('multiJoinPasscode');
  multiJoinRoomBtn           = document.getElementById('multiJoinRoomBtn');
  multiJoinError             = document.getElementById('multiJoinError');
  multiJoinConnecting        = document.getElementById('multiJoinConnecting');
  backToMultiJoinModeBtn     = document.getElementById('backToMultiJoinModeBtn');
  menuStepMultiBossCreate    = document.getElementById('menuStepMultiBossCreate');
  backToMultiCreateFormBtn   = document.getElementById('backToMultiCreateFormBtn');
  multiBossLvlMinusBtn       = document.getElementById('multiBossLvlMinusBtn');
  multiBossLvlPlusBtn        = document.getElementById('multiBossLvlPlusBtn');
  multiBossLvlText           = document.getElementById('multiBossLvlText');
  multiBossStartBtn          = document.getElementById('multiBossStartBtn');
  multiCreateBossBtn         = document.getElementById('multiCreateBossBtn');
  multiCreateEventBossBtn    = document.getElementById('multiCreateEventBossBtn');
  multiJoinBossBtn           = document.getElementById('multiJoinBossBtn');
  multiJoinEventBossBtn      = document.getElementById('multiJoinEventBossBtn');

  multiPlayerList            = document.getElementById('multiPlayerList');
  multiWaitPasscode          = document.getElementById('multiWaitPasscode');
  multiWaitHint              = document.getElementById('multiWaitHint');
  multiStartGameBtn          = document.getElementById('multiStartGameBtn');
  backFromMultiWaitBtn       = document.getElementById('backFromMultiWaitBtn');
  multiWaitTitle             = document.getElementById('multiWaitTitle');
  multiWaitBossLevelBar      = document.getElementById('multiWaitBossLevelBar');
  multiWaitBossLvlMinusBtn   = document.getElementById('multiWaitBossLvlMinusBtn');
  multiWaitBossLvlPlusBtn    = document.getElementById('multiWaitBossLvlPlusBtn');
  multiWaitBossLvlText       = document.getElementById('multiWaitBossLvlText');

  // Step 2: Multi mode button -> Multi sub (Create / Join)
  addMenuBtnListeners(multiModeBtn, () => {
    showMenuStep('multiSub');
  });

  addMenuBtnListeners(backToModeFromMultiBtn, () => {
    showMenuStep('mode');
  });

  // Multi Sub: Create -> Multi Create Mode (Score Attack / Boss / Event Boss)
  addMenuBtnListeners(multiCreateBtn, () => {
    _multiIsCreator = true;
    showMenuStep('multiCreateMode');
  });

  // Multi Sub: Join -> Multi Join Mode (Score Attack / Boss / Event Boss)
  addMenuBtnListeners(multiJoinBtn, () => {
    _multiIsCreator = false;
    showMenuStep('multiJoinMode');
  });

  // Multi Create Mode: Score Attack -> Create Form
  addMenuBtnListeners(multiCreateScoreBtn, () => {
    _pendingMultiMode = 'SCORE_ATTACK';
    const formTitle = document.querySelector('#menuStepMultiCreateForm .menu-step-title');
    if (formTitle) formTitle.innerText = '⚡ 部屋を作る';
    if (multiCreateRoomBtn) multiCreateRoomBtn.innerText = '🏠 部屋を作成';
    showMenuStep('multiCreateForm');
    updateCreateBtnState();
  });

  // Multi Create Mode: Boss Battle -> Create Form (Same flow as score attack)
  addMenuBtnListeners(multiCreateBossBtn, () => {
    _pendingMultiMode = 'BOSS';
    const formTitle = document.querySelector('#menuStepMultiCreateForm .menu-step-title');
    if (formTitle) formTitle.innerText = '👹 ボス戦 — 部屋を作る';
    if (multiCreateRoomBtn) multiCreateRoomBtn.innerText = '🏠 部屋を作成';
    showMenuStep('multiCreateForm');
    updateCreateBtnState();
  });

  // Multi Create Mode: Event Boss -> Create Form
  addMenuBtnListeners(multiCreateEventBossBtn, () => {
    _pendingMultiMode = 'EVENT_BOSS';
    const formTitle = document.querySelector('#menuStepMultiCreateForm .menu-step-title');
    if (formTitle) formTitle.innerText = '🐹 イベントボス(ハム神) — 部屋を作る';
    if (multiCreateRoomBtn) multiCreateRoomBtn.innerText = '🏠 部屋を作成';
    showMenuStep('multiCreateForm');
    updateCreateBtnState();
  });

  addMenuBtnListeners(backToMultiCreateFormBtn, () => {
    showMenuStep('multiCreateForm');
  });

  addMenuBtnListeners(backToMultiSubFromCreateBtn, () => {
    showMenuStep('multiSub');
  });

  // Multi Join Mode: Score Attack -> Join Form
  addMenuBtnListeners(multiJoinScoreBtn, () => {
    _pendingMultiMode = 'SCORE_ATTACK';
    showMenuStep('multiJoinForm');
    updateJoinBtnState();
    const formTitle = document.querySelector('#menuStepMultiJoinForm .menu-step-title');
    if (formTitle) formTitle.innerText = '🔗 部屋に参加 (スコアアタック)';
  });

  // Multi Join Mode: Boss Battle -> Join Form
  addMenuBtnListeners(multiJoinBossBtn, () => {
    _pendingMultiMode = 'BOSS';
    showMenuStep('multiJoinForm');
    updateJoinBtnState();
    const formTitle = document.querySelector('#menuStepMultiJoinForm .menu-step-title');
    if (formTitle) formTitle.innerText = '🔗 部屋に参加 (ボス戦)';
  });

  // Multi Join Mode: Event Boss -> Join Form
  addMenuBtnListeners(multiJoinEventBossBtn, () => {
    _pendingMultiMode = 'EVENT_BOSS';
    showMenuStep('multiJoinForm');
    updateJoinBtnState();
    const formTitle = document.querySelector('#menuStepMultiJoinForm .menu-step-title');
    if (formTitle) formTitle.innerText = '🔗 部屋に参加 (イベントボス: ハム神)';
  });

  addMenuBtnListeners(backToMultiSubFromJoinBtn, () => {
    showMenuStep('multiSub');
    _pendingMultiMode = 'SCORE_ATTACK';
  });

  addMenuBtnListeners(backToMultiCreateModeBtn, () => {
    showMenuStep('multiCreateMode');
    _pendingMultiMode = 'SCORE_ATTACK';
    if (multiCreateError) {
      multiCreateError.innerText = '';
      multiCreateError.classList.remove('visible');
    }
    if (multiCreateConnecting) multiCreateConnecting.style.display = 'none';
  });

  addMenuBtnListeners(backToMultiJoinModeBtn, () => {
    showMenuStep('multiJoinMode');
    _pendingMultiMode = 'SCORE_ATTACK';
    if (multiJoinError) {
      multiJoinError.innerText = '';
      multiJoinError.classList.remove('visible');
    }
    if (multiJoinConnecting) multiJoinConnecting.style.display = 'none';
  });

  // Player count +/- buttons
  if (playerCountMinusBtn) {
    playerCountMinusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (_multiMaxPlayers > 2) {
        _multiMaxPlayers--;
        if (playerCountVal) playerCountVal.innerText = `${_multiMaxPlayers}人`;
      }
    });
  }
  if (playerCountPlusBtn) {
    playerCountPlusBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (_multiMaxPlayers < 5) {
        _multiMaxPlayers++;
        if (playerCountVal) playerCountVal.innerText = `${_multiMaxPlayers}人`;
      }
    });
  }

  function updateCreateBtnState() {
    if (!multiCreateRoomBtn) return;
    const name = multiCreateName ? multiCreateName.value.trim() : '';
    const pass = multiCreatePasscode ? multiCreatePasscode.value.trim() : '';
    multiCreateRoomBtn.disabled = !(name.length > 0 && pass.length === 4 && /^\d{4}$/.test(pass));
  }

  function updateJoinBtnState() {
    if (!multiJoinRoomBtn) return;
    const name = multiJoinName ? multiJoinName.value.trim() : '';
    const pass = multiJoinPasscode ? multiJoinPasscode.value.trim() : '';
    multiJoinRoomBtn.disabled = !(name.length > 0 && pass.length === 4 && /^\d{4}$/.test(pass));
  }

  if (multiCreateName) multiCreateName.addEventListener('input', updateCreateBtnState);
  if (multiCreatePasscode) multiCreatePasscode.addEventListener('input', updateCreateBtnState);
  if (multiJoinName) multiJoinName.addEventListener('input', updateJoinBtnState);
  if (multiJoinPasscode) multiJoinPasscode.addEventListener('input', updateJoinBtnState);

  // Host: Create Room Action
  addMenuBtnListeners(multiCreateRoomBtn, async () => {
    const name = multiCreateName.value.trim();
    const pass = multiCreatePasscode.value.trim();
    if (!name || pass.length !== 4) return;

    if (multiCreateError) {
      multiCreateError.innerText = '';
      multiCreateError.classList.remove('visible');
    }
    if (multiCreateConnecting) multiCreateConnecting.style.display = 'flex';
    multiCreateRoomBtn.disabled = true;

    window.multiplayerManager = new MultiplayerManager();
    setupMultiplayerCallbacks();

    const res = await window.multiplayerManager.createRoom(name, pass, _multiMaxPlayers, _pendingMultiMode, multiBossLevel);
    if (multiCreateConnecting) multiCreateConnecting.style.display = 'none';

    if (res.success) {
      bossLevel = multiBossLevel;
      if (multiWaitPasscode) multiWaitPasscode.innerText = pass;
      if (multiWaitHint) multiWaitHint.innerText = `合言葉【${pass}】を仲間に伝えてください`;
      if (multiStartGameBtn) {
        multiStartGameBtn.style.display = 'flex';
        multiStartGameBtn.disabled = true; // Enabled when at least 2 players in room
      }
      updateWaitingRoomUI();
      renderWaitingRoomPlayers(window.multiplayerManager.lobbyPlayers, _multiMaxPlayers);
      showMenuStep('multiWait');
    } else {
      multiCreateRoomBtn.disabled = false;
      if (multiCreateError) {
        multiCreateError.innerText = res.error || '部屋の作成に失敗しました';
        multiCreateError.classList.add('visible');
      }
    }
  });

  // Client: Join Room Action
  addMenuBtnListeners(multiJoinRoomBtn, async () => {
    const name = multiJoinName.value.trim();
    const pass = multiJoinPasscode.value.trim();
    if (!name || pass.length !== 4) return;

    if (multiJoinError) {
      multiJoinError.innerText = '';
      multiJoinError.classList.remove('visible');
    }
    if (multiJoinConnecting) multiJoinConnecting.style.display = 'flex';
    multiJoinRoomBtn.disabled = true;

    window.multiplayerManager = new MultiplayerManager();
    setupMultiplayerCallbacks();

    const res = await window.multiplayerManager.joinRoom(name, pass, _pendingMultiMode);
    if (multiJoinConnecting) multiJoinConnecting.style.display = 'none';

    if (res.success) {
      if (multiWaitPasscode) multiWaitPasscode.innerText = pass;
      if (multiWaitHint) multiWaitHint.innerText = 'ホストがゲームを開始するまでお待ちください...';
      if (multiStartGameBtn) multiStartGameBtn.style.display = 'none';
      updateWaitingRoomUI();
      showMenuStep('multiWait');
    } else {
      multiJoinRoomBtn.disabled = false;
      if (multiJoinError) {
        multiJoinError.innerText = res.error || '部屋が見つかりませんでした';
        multiJoinError.classList.add('visible');
      }
    }
  });

  // Host: Start Multi Game
  addMenuBtnListeners(multiStartGameBtn, () => {
    if (!window.multiplayerManager || !window.multiplayerManager.isHost) return;
    window.multiplayerManager.startMultiGame();
  });

  // Back from Waiting room
  addMenuBtnListeners(backFromMultiWaitBtn, () => {
    if (window.multiplayerManager) {
      window.multiplayerManager.cleanup();
      window.multiplayerManager = null;
    }
    showMenuStep('multiSub');
  });
}

function renderWaitingRoomPlayers(players, maxP) {
  if (!multiPlayerList) return;
  multiPlayerList.innerHTML = '';
  const total = maxP || 2;
  const currentCount = (players && players.length) || 1;

  for (let i = 0; i < total; i++) {
    const p = players && players[i];
    const slot = document.createElement('div');
    if (p) {
      slot.className = 'multi-player-slot joined';
      const color = MP_PLAYER_COLORS[p.colorIndex % MP_PLAYER_COLORS.length] || '#58a6ff';
      slot.innerHTML = `
        <span class="player-dot" style="background: ${color}; box-shadow: 0 0 6px ${color};"></span>
        <span>${escapeHtml(p.name)}</span>
        ${i === 0 ? '<span class="multi-status-badge host-badge">HOST</span>' : '<span class="multi-status-badge">READY</span>'}
      `;
    } else {
      slot.className = 'multi-player-slot empty';
      slot.innerHTML = `
        <span class="player-dot" style="background: #484f58;"></span>
        <span>プレイヤー待機中...</span>
      `;
    }
    multiPlayerList.appendChild(slot);
  }

  if (multiStartGameBtn && window.multiplayerManager && window.multiplayerManager.isHost) {
    multiStartGameBtn.disabled = (currentCount < 2);
  }
}

function escapeHtml(str) {
  return String(str || '').replace(/[&<>'"]/g, tag => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[tag] || tag));
}

function setupMultiplayerCallbacks() {
  const mp = window.multiplayerManager;
  if (!mp) return;

  mp.onRoomUpdate = (players) => {
    updateWaitingRoomUI();
    renderWaitingRoomPlayers(players, mp.maxPlayers);
  };

  mp.onGameStart = (cfg) => {
    window.isMultiplayerMode = true;
    window.multiHpMult = cfg.playerCount || 1;
    if (cfg.gameMode === 'BOSS') {
      bossLevel = cfg.bossLevel || 1;
      multiBossLevel = bossLevel;
    }
    startGame(cfg.gameMode || 'SCORE_ATTACK');
    showToast(`👥 マルチプレイ開始！ (${cfg.playerCount}人)`);
  };

  mp.onGameOver = (data) => {
    if (data && data.reason === 'boss_clear') {
      if (data.bossClearTime != null) {
        bossBattleElapsedTime = data.bossClearTime;
      }
      gameOver('VICTORY');
    } else {
      gameOver();
    }
  };

  mp.onError = (msg) => {
    showToast(`⚠️ ${msg}`);
  };
}

// Boss Level Minus Button: "1より下はありません"
function bossLvlMinus() {
  if (bossLevel > 1) {
    bossLevel--;
    if (bossLvlText) bossLvlText.innerText = `レベル${bossLevel}`;
  } else {
    showToast('1より下はありません');
  }
}
function bossLvlPlus() {
  if (bossLevel < 5) {
    bossLevel++;
    if (bossLvlText) bossLvlText.innerText = `レベル${bossLevel}`;
    showToast(`ボスレベルを ${bossLevel} に変更しました`);
  } else {
    showToast('レベル5が上限です');
  }
}
addMenuBtnListeners(bossLvlMinusBtn, bossLvlMinus);
addMenuBtnListeners(bossLvlPlusBtn, bossLvlPlus);

// Multiplayer waiting room UI update
function updateWaitingRoomUI() {
  const currentMode = window.multiplayerManager?.gameMode || _pendingMultiMode;
  const isBoss = (currentMode === 'BOSS');
  const isEventBoss = (currentMode === 'EVENT_BOSS');
  if (multiWaitTitle) {
    if (isEventBoss) {
      multiWaitTitle.innerText = '🐹 イベントボス(ハム神) 待機室';
    } else if (isBoss) {
      multiWaitTitle.innerText = '👹 ボス戦 待機室';
    } else {
      multiWaitTitle.innerText = '待機室';
    }
  }
  if (multiWaitBossLevelBar) {
    multiWaitBossLevelBar.style.display = isBoss ? 'block' : 'none';
  }
  if (multiWaitBossLvlText) {
    multiWaitBossLvlText.innerText = `レベル${multiBossLevel}`;
  }
  const isHost = !window.multiplayerManager || window.multiplayerManager.isHost;
  if (multiWaitBossLvlMinusBtn) multiWaitBossLvlMinusBtn.style.visibility = isHost ? 'visible' : 'hidden';
  if (multiWaitBossLvlPlusBtn) multiWaitBossLvlPlusBtn.style.visibility = isHost ? 'visible' : 'hidden';
}

// Multiplayer waiting room boss level controls
function multiWaitBossLvlMinus() {
  if (multiBossLevel > 1) {
    multiBossLevel--;
    if (multiWaitBossLvlText) multiWaitBossLvlText.innerText = `レベル${multiBossLevel}`;
    if (multiBossLvlText) multiBossLvlText.innerText = `レベル${multiBossLevel}`;
    if (window.multiplayerManager) window.multiplayerManager.bossLevel = multiBossLevel;
    bossLevel = multiBossLevel;
  } else {
    showToast('1より下はありません');
  }
}
function multiWaitBossLvlPlus() {
  if (multiBossLevel < 5) {
    multiBossLevel++;
    if (multiWaitBossLvlText) multiWaitBossLvlText.innerText = `レベル${multiBossLevel}`;
    if (multiBossLvlText) multiBossLvlText.innerText = `レベル${multiBossLevel}`;
    if (window.multiplayerManager) window.multiplayerManager.bossLevel = multiBossLevel;
    bossLevel = multiBossLevel;
    showToast(`ボスレベルを ${multiBossLevel} に変更しました`);
  } else {
    showToast('レベル5が上限です');
  }
}
addMenuBtnListeners(multiWaitBossLvlMinusBtn, multiWaitBossLvlMinus);
addMenuBtnListeners(multiWaitBossLvlPlusBtn, multiWaitBossLvlPlus);

// Multiplayer boss level controls (backward compatibility)
function multiBossLvlMinus() { multiWaitBossLvlMinus(); }
function multiBossLvlPlus() { multiWaitBossLvlPlus(); }
addMenuBtnListeners(multiBossLvlMinusBtn, multiBossLvlMinus);
addMenuBtnListeners(multiBossLvlPlusBtn, multiBossLvlPlus);

addMenuBtnListeners(multiBossStartBtn, async () => {
  const name = multiCreateName.value.trim();
  const pass = multiCreatePasscode.value.trim();
  if (!name || pass.length !== 4) return;
  if (multiCreateError) { multiCreateError.innerText=''; multiCreateError.classList.remove('visible'); }
  if (multiCreateConnecting) multiCreateConnecting.style.display='flex';
  multiCreateRoomBtn.disabled = true;
  window.multiplayerManager = new MultiplayerManager();
  setupMultiplayerCallbacks();
  const res = await window.multiplayerManager.createRoom(name, pass, _multiMaxPlayers, 'BOSS', multiBossLevel);
  if (multiCreateConnecting) multiCreateConnecting.style.display='none';
  if (res.success) {
    bossLevel = multiBossLevel;
    if (multiWaitPasscode) multiWaitPasscode.innerText = pass;
    if (multiWaitHint) multiWaitHint.innerText = `合言葉【${pass}】を仲間に伝えてください`;
    if (multiStartGameBtn) { multiStartGameBtn.style.display='flex'; multiStartGameBtn.disabled = true; }
    renderWaitingRoomPlayers(window.multiplayerManager.lobbyPlayers, _multiMaxPlayers);
    showMenuStep('multiWait');
  } else {
    multiCreateRoomBtn.disabled = false;
    if (multiBossStartBtn) multiBossStartBtn.disabled = false;
    if (multiCreateError) { multiCreateError.innerText = res.error || '部屋の作成に失敗しました'; multiCreateError.classList.add('visible'); }
  }
});


// ==========================================
// ONLINE LEADERBOARD SYSTEM (Firestore & Local Fallback)
// ==========================================

async function fetchOnlineLeaderboard() {
  try {
    if (lbLoadingText) lbLoadingText.style.display = 'block';
    if (lbEmptyText) lbEmptyText.style.display = 'none';
    if (lbTableBody) lbTableBody.innerHTML = '';

    if (window.firestoreDb) {
      // Query Firestore collection 'leaderboard'
      const snapshot = await window.firestoreDb.collection('leaderboard').get();
      const records = [];
      snapshot.forEach((doc) => {
        records.push(doc.data());
      });

      // Organize into standard structure: { solo: { pc: ..., mobile: ... }, multi: { pc: ..., mobile: ... } }
      const formatted = {
        solo: {
          pc: { scoreAttack: [], boss: { '1': [], '2': [], '3': [], '4': [], '5': [] } },
          mobile: { scoreAttack: [], boss: { '1': [], '2': [], '3': [], '4': [], '5': [] } }
        },
        multi: {
          pc: { scoreAttack: [], boss: { '1': [], '2': [], '3': [], '4': [], '5': [] } },
          mobile: { scoreAttack: [], boss: { '1': [], '2': [], '3': [], '4': [], '5': [] } }
        }
      };

      records.forEach((rec) => {
        const cat = (rec.category === 'multi' || rec.isMulti) ? 'multi' : 'solo';
        const dev = (rec.device === 'mobile') ? 'mobile' : 'pc';
        if (rec.mode === 'SCORE_ATTACK') {
          formatted[cat][dev].scoreAttack.push(rec);
        } else if (rec.mode === 'BOSS') {
          const lvl = String(rec.level || 1);
          if (!formatted[cat][dev].boss[lvl]) formatted[cat][dev].boss[lvl] = [];
          formatted[cat][dev].boss[lvl].push(rec);
        }
      });

      // Sort Score Attack desc (high to low) and Boss time asc (fastest to slowest)
      ['solo', 'multi'].forEach((cat) => {
        ['pc', 'mobile'].forEach((dev) => {
          formatted[cat][dev].scoreAttack.sort((a, b) => (Number(b.score) || 0) - (Number(a.score) || 0));
          for (let l = 1; l <= 5; l++) {
            const lvl = String(l);
            if (formatted[cat][dev].boss[lvl]) {
              formatted[cat][dev].boss[lvl].sort((a, b) => (Number(a.time) || 999999) - (Number(b.time) || 999999));
            }
          }
        });
      });

      cachedLeaderboardData = formatted;
      try {
        localStorage.setItem('sa_leaderboard_cache', JSON.stringify(formatted));
      } catch (e) {}
      renderLeaderboardView();
      return;
    }

    // Secondary fallback: local HTTP server API if running locally without Firestore
    const res = await fetch('/api/leaderboard', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    cachedLeaderboardData = data;
    renderLeaderboardView();
  } catch (err) {
    console.warn('Leaderboard online fetch failed, using local cache fallback:', err);
    // Fallback to localStorage if offline
    try {
      const local = localStorage.getItem('sa_leaderboard_cache');
      if (local) {
        cachedLeaderboardData = JSON.parse(local);
      } else {
        cachedLeaderboardData = {
          solo: { pc: { scoreAttack: [], boss: { '1': [] } }, mobile: { scoreAttack: [], boss: { '1': [] } } },
          multi: { pc: { scoreAttack: [], boss: { '1': [] } }, mobile: { scoreAttack: [], boss: { '1': [] } } }
        };
      }
    } catch (e) {
      cachedLeaderboardData = {
        solo: { pc: { scoreAttack: [], boss: { '1': [] } }, mobile: { scoreAttack: [], boss: { '1': [] } } },
        multi: { pc: { scoreAttack: [], boss: { '1': [] } }, mobile: { scoreAttack: [], boss: { '1': [] } } }
      };
    }
    renderLeaderboardView();
  } finally {
    if (lbLoadingText) lbLoadingText.style.display = 'none';
  }
}

function renderLeaderboardView() {
  if (!lbTableBody) return;
  lbTableBody.innerHTML = '';
  if (!cachedLeaderboardData) return;

  // Retrieve partition for current category ('solo' or 'multi') and device ('pc' or 'mobile')
  const catData = cachedLeaderboardData[currentLeaderboardCategory] || cachedLeaderboardData.solo || cachedLeaderboardData;
  const deviceData = catData[currentLeaderboardDevice] || catData;

  let list = [];
  const isScoreMode = (currentLeaderboardTab === 'SCORE_ATTACK');

  if (isScoreMode) {
    if (lbColStatHeader) lbColStatHeader.innerText = 'スコア';
    if (lbBossLevelBar) lbBossLevelBar.style.display = 'none';
    list = deviceData.scoreAttack || [];
  } else {
    if (lbColStatHeader) lbColStatHeader.innerText = 'クリアタイム';
    if (lbBossLevelBar) lbBossLevelBar.style.display = 'flex';
    if (lbBossLvlText) lbBossLvlText.innerText = `レベル${leaderboardBossLevel}`;
    const bossMap = deviceData.boss || {};
    list = bossMap[leaderboardBossLevel] || [];
  }

  if (!list || list.length === 0) {
    if (lbEmptyText) lbEmptyText.style.display = 'block';
    return;
  }
  if (lbEmptyText) lbEmptyText.style.display = 'none';

  list.forEach((item, index) => {
    const rank = index + 1;
    const tr = document.createElement('tr');

    let badgeClass = 'rank-other';
    if (rank === 1) badgeClass = 'rank-1';
    else if (rank === 2) badgeClass = 'rank-2';
    else if (rank === 3) badgeClass = 'rank-3';

    const valDisplay = isScoreMode ? (Number(item.score).toLocaleString()) : formatBattleTime(Number(item.time));
    const valClass = isScoreMode ? 'lb-score-cell' : 'lb-time-cell';

    tr.innerHTML = `
      <td><span class="lb-rank-badge ${badgeClass}">${rank}</span></td>
      <td style="font-weight: 700; color: #f0f6fc;">${escapeHtml(item.name || 'Player')}</td>
      <td class="${valClass}">${valDisplay}</td>
      <td class="lb-date-cell">${item.date || '-'}</td>
    `;
    lbTableBody.appendChild(tr);
  });
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function openLeaderboardModal(tab = 'SCORE_ATTACK', bossLvl = 1, category = null) {
  currentLeaderboardTab = tab;
  leaderboardBossLevel = bossLvl;
  if (category) {
    currentLeaderboardCategory = category;
  } else {
    currentLeaderboardCategory = window.isMultiplayerMode ? 'multi' : 'solo';
  }

  // Auto-detect player's default device view
  currentLeaderboardDevice = checkIsMobile() ? 'mobile' : 'pc';

  if (lbDeviceTabPC) lbDeviceTabPC.classList.toggle('active', currentLeaderboardDevice === 'pc');
  if (lbDeviceTabMobile) lbDeviceTabMobile.classList.toggle('active', currentLeaderboardDevice === 'mobile');

  if (lbCatTabSolo) lbCatTabSolo.classList.toggle('active', currentLeaderboardCategory === 'solo');
  if (lbCatTabMulti) lbCatTabMulti.classList.toggle('active', currentLeaderboardCategory === 'multi');

  if (lbTabScore) lbTabScore.classList.toggle('active', tab === 'SCORE_ATTACK');
  if (lbTabBoss) lbTabBoss.classList.toggle('active', tab === 'BOSS');

  if (leaderboardModal) leaderboardModal.style.display = 'flex';
  fetchOnlineLeaderboard();
}

function closeLeaderboard() {
  if (leaderboardModal) leaderboardModal.style.display = 'none';
}

// Leaderboard Buttons Click
if (soloLeaderboardBtn) {
  soloLeaderboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openLeaderboardModal('SCORE_ATTACK', 1, 'solo');
  });
}
if (bossStepLeaderboardBtn) {
  bossStepLeaderboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openLeaderboardModal('BOSS', bossLevel, 'solo');
  });
}
if (gameoverLeaderboardBtn) {
  gameoverLeaderboardBtn.addEventListener('click', (e) => {
    e.preventDefault();
    openLeaderboardModal(gameMode === 'BOSS' ? 'BOSS' : 'SCORE_ATTACK', bossLevel, window.isMultiplayerMode ? 'multi' : 'solo');
  });
}
if (closeLeaderboardBtn) closeLeaderboardBtn.addEventListener('click', closeLeaderboard);
if (closeLeaderboardBottomBtn) closeLeaderboardBottomBtn.addEventListener('click', closeLeaderboard);

// Category tab switching inside Leaderboard Modal (Solo / Multi)
if (lbCatTabSolo) {
  lbCatTabSolo.addEventListener('click', () => {
    currentLeaderboardCategory = 'solo';
    lbCatTabSolo.classList.add('active');
    if (lbCatTabMulti) lbCatTabMulti.classList.remove('active');
    renderLeaderboardView();
  });
}
if (lbCatTabMulti) {
  lbCatTabMulti.addEventListener('click', () => {
    currentLeaderboardCategory = 'multi';
    lbCatTabMulti.classList.add('active');
    if (lbCatTabSolo) lbCatTabSolo.classList.remove('active');
    renderLeaderboardView();
  });
}

// Device tab switching inside Leaderboard Modal (PC / Mobile)
if (lbDeviceTabPC) {
  lbDeviceTabPC.addEventListener('click', () => {
    currentLeaderboardDevice = 'pc';
    lbDeviceTabPC.classList.add('active');
    if (lbDeviceTabMobile) lbDeviceTabMobile.classList.remove('active');
    renderLeaderboardView();
  });
}
if (lbDeviceTabMobile) {
  lbDeviceTabMobile.addEventListener('click', () => {
    currentLeaderboardDevice = 'mobile';
    lbDeviceTabMobile.classList.add('active');
    if (lbDeviceTabPC) lbDeviceTabPC.classList.remove('active');
    renderLeaderboardView();
  });
}

// Tab switching inside Leaderboard Modal (Score Attack / Boss)
if (lbTabScore) {
  lbTabScore.addEventListener('click', () => {
    currentLeaderboardTab = 'SCORE_ATTACK';
    lbTabScore.classList.add('active');
    lbTabBoss.classList.remove('active');
    renderLeaderboardView();
  });
}
if (lbTabBoss) {
  lbTabBoss.addEventListener('click', () => {
    currentLeaderboardTab = 'BOSS';
    lbTabBoss.classList.add('active');
    lbTabScore.classList.remove('active');
    renderLeaderboardView();
  });
}

// Leaderboard Boss Level - / + Buttons
if (lbBossLvlMinusBtn) {
  lbBossLvlMinusBtn.addEventListener('click', () => {
    if (leaderboardBossLevel > 1) {
      leaderboardBossLevel--;
      renderLeaderboardView();
    } else {
      showToast('1より下はありません');
    }
  });
}
if (lbBossLvlPlusBtn) {
  lbBossLvlPlusBtn.addEventListener('click', () => {
    if (leaderboardBossLevel < 5) {
      leaderboardBossLevel++;
      renderLeaderboardView();
    } else {
      showToast('レベル5が上限です');
    }
  });
}

// ==========================================
// RECORD REGISTRATION & ONLINE SUBMISSION
// ==========================================

function checkAndPromptRecordRegistration(mode, statValue, lvl = 1) {
  const isMulti = !!window.isMultiplayerMode;
  pendingRecordToRegister = {
    mode: mode,
    value: statValue,
    level: lvl,
    category: isMulti ? 'multi' : 'solo'
  };

  if (recordModalTitle) {
    recordModalTitle.innerText = (mode === 'BOSS') 
      ? (isMulti ? '👑 MULTI BOSS CLEAR RECORD!' : '👑 BOSS CLEAR RECORD!')
      : (isMulti ? '🎉 MULTI SCORE RECORD!' : '🎉 SCORE ATTACK RECORD!');
  }
  if (recordModalSubtitle) {
    recordModalSubtitle.innerText = (mode === 'BOSS')
      ? (isMulti ? `マルチボス (レベル${lvl}) のクリアタイムをオンライン共有！` : `ボス (レベル${lvl}) のクリアタイムをオンライン共有！`)
      : (isMulti ? 'マルチプレイのスコアをオンラインリーダーボードに共有！' : 'オンラインリーダーボードにあなたのスコアを共有しよう！');
  }
  if (recordValLabel) {
    recordValLabel.innerText = (mode === 'BOSS') ? 'CLEAR TIME' : 'FINAL SCORE';
  }
  if (recordValNum) {
    recordValNum.innerText = (mode === 'BOSS') ? formatBattleTime(statValue) : statValue.toLocaleString();
  }

  // Restore remembered nickname or player's multi name
  let defaultName = '';
  if (isMulti && window.multiplayerManager?.myName) {
    defaultName = window.multiplayerManager.myName;
  } else {
    defaultName = localStorage.getItem('sa_player_name') || '';
  }
  if (playerNameInput) {
    playerNameInput.value = defaultName;
  }

  if (recordModal) recordModal.style.display = 'flex';
}

async function submitRecord() {
  if (!pendingRecordToRegister) return;
  const rawName = playerNameInput ? playerNameInput.value.trim() : '';
  const playerName = rawName || 'Player';

  try {
    localStorage.setItem('sa_player_name', playerName);
  } catch (e) {}

  const isMobilePlayer = checkIsMobile();
  const dateStr = new Date().toISOString().split('T')[0];
  const payload = {
    name: playerName,
    mode: pendingRecordToRegister.mode,
    score: pendingRecordToRegister.mode === 'SCORE_ATTACK' ? Math.round(pendingRecordToRegister.value) : 0,
    time: pendingRecordToRegister.mode === 'BOSS' ? pendingRecordToRegister.value : 0,
    level: pendingRecordToRegister.level || 1,
    category: pendingRecordToRegister.category || 'solo',
    isMulti: pendingRecordToRegister.category === 'multi',
    device: isMobilePlayer ? 'mobile' : 'pc',
    date: dateStr,
    timestamp: Date.now()
  };

  if (recordModal) recordModal.style.display = 'none';
  showToast('📡 クラウドに記録を送信中...');

  try {
    if (window.firestoreDb) {
      // Save directly to Firebase Firestore
      await window.firestoreDb.collection('leaderboard').add(payload);
      showToast('✅ リーダーボードに登録完了！');

      // Fetch fresh data and show leaderboard
      setTimeout(async () => {
        await fetchOnlineLeaderboard();
        openLeaderboardModal(payload.mode, payload.level || 1, payload.category);
      }, 400);
      return;
    }

    // Fallback: Local HTTP server POST
    const res = await fetch('/api/leaderboard', {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=UTF-8' },
      body: JSON.stringify(payload),
      keepalive: true
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const updatedData = await res.json();

    cachedLeaderboardData = updatedData;
    try {
      localStorage.setItem('sa_leaderboard_cache', JSON.stringify(updatedData));
    } catch (e) {}
    showToast('✅ リーダーボードに登録完了！');

    setTimeout(() => {
      openLeaderboardModal(payload.mode, payload.level || 1, payload.category);
    }, 400);
  } catch (err) {
    console.warn('Failed to submit online record:', err);
    showToast(`⚠️ 送信失敗 (${err.message || 'オフライン'})`);
  } finally {
    pendingRecordToRegister = null;
  }
}

if (submitRecordBtn) {
  submitRecordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    submitRecord();
  });
}
if (skipRecordBtn) {
  skipRecordBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (recordModal) recordModal.style.display = 'none';
    pendingRecordToRegister = null;
  });
}
if (playerNameInput) {
  playerNameInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submitRecord();
    }
  });
}




addMenuBtnListeners(restartBtn, restartGame);
addMenuBtnListeners(homeBtn, returnToStart);


// Player Object
const player = {
  x: canvas.width / 2,
  y: canvas.height * 0.75,
  radius: 18,
  speed: 3.8, // Slower player speed for better controllability
  friction: 0.86,
  vx: 0,
  vy: 0,
  angle: 0,
  hp: 100,
  maxHp: 100,
  mp: 100,
  maxMp: 100,
  wp: 0, // Weapon Points (gained by defeating enemies)
  uep: 0, // Ultra Energy Points (gained by defeating enemies, +1 HP & EP per 10 points)
  mpRegenRate: 2.0, // 2 EP per second
  grazeRadius: 57,  // 1.5x larger graze ring (~3.2x size of player)
  grazeEffectTimer: 0,
  invincibleTimer: 0,
  color: '#58a6ff',
  glowColor: '#1f6feb',

  // Skill 1: Blink Dash (EP 10)
  skillCost: 10,
  skillCooldown: 300,
  lastSkillTime: 0,
  isDashing: false,
  dashDuration: 0,

  // Skill 2: Guard Barrier (10 EP per sec, hold to maintain, invincible while active)
  isGuarding: false,
  guardDrainRate: 10, // 10 EP per second
  guardRadius: 36,

  // Skill 3: Homing Missile (EP 3, auto-target highest HP enemy, hold to fire)
  homingCost: 3,
  homingCooldown: 260,
  lastHomingTime: 0,

  // Skill 4: Summon Minion (WP 20 + EP 50, Shoots bullets every 3s, HP 50, takes 20 dmg on hit)
  summonWpCost: 20,
  summonMpCost: 50,
  summonCooldown: 1000,
  lastSummonTime: 0,
  // Multiplayer: down/revival state
  isDown:          false,   // True when player is defeated in multiplayer (awaiting revival)
  revivalProgress: 0,       // 0–1 when being revived by an ally
  reviveCount:     0        // How many times this player has been revived (maxHp decreases each time)
};

// Floating Text Class (for Graze and MP popup)
class FloatingText {
  constructor(x, y, text, color) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.life = 35;
    this.maxLife = 35;
  }

  update() {
    this.y -= 0.8;
    this.life--;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.font = 'bold 13px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = this.color;
    ctx.textAlign = 'center';
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}

// Bullet Class
class Bullet {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 6; // 1.5x larger bullet size
    this.color = '#f2cc60';
    this.life = 120;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life--;
  }

  draw(ctx) {
    ctx.save();
    ctx.shadowColor = '#e3b341';
    ctx.shadowBlur = 12;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bullet trail tail
    ctx.strokeStyle = 'rgba(242, 204, 96, 0.45)';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.x - this.vx * 1.5, this.y - this.vy * 1.5);
    ctx.stroke();
    ctx.restore();
  }
}

// Homing Bullet Class (Skill 3: 3 MP cost, tracks highest HP enemy)
class HomingBullet {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.speed = 13.5;
    this.turnRate = 0.16; // Agile homing steering
    this.radius = 7;
    this.life = 160;
    this.damage = 1.5; // Deals 1.5 damage
    this.trail = [];
  }

  update() {
    // Record past positions for sparkling comet trail
    this.trail.push({ x: this.x, y: this.y });
    if (this.trail.length > 8) this.trail.shift();

    // Find the enemy with the highest HP
    let target = null;
    let highestHp = -1;

    const isClient = (typeof window !== 'undefined' && window.isMultiplayerMode && window.multiplayerManager && !window.multiplayerManager.isHost);
    const targetBoss = isClient ? (window.multiplayerManager?.remoteGameObjects?.boss) : boss;
    const targetEnemies = isClient ? (window.multiplayerManager?.remoteGameObjects?.enemies || []) : enemies;

    // Check Boss first
    if (targetBoss && targetBoss.hp > 0) {
      target = targetBoss;
      highestHp = targetBoss.hp;
    }

    // Check minion enemies
    for (let i = 0; i < targetEnemies.length; i++) {
      const e = targetEnemies[i];
      if (e && e.hp > highestHp) {
        highestHp = e.hp;
        target = e;
      }
    }

    // Steer velocity towards target if target exists
    if (target) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        const targetAngle = Math.atan2(dy, dx);
        const currentAngle = Math.atan2(this.vy, this.vx);

        let angleDiff = targetAngle - currentAngle;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;

        const newAngle = currentAngle + Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), this.turnRate);
        this.vx = Math.cos(newAngle) * this.speed;
        this.vy = Math.sin(newAngle) * this.speed;
      }
    }

    this.x += this.vx;
    this.y += this.vy;
    this.life--;

    // Spawn tiny stardust particles periodically
    if (Math.random() < 0.35) {
      particles.push(new Particle(
        this.x, this.y,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        '#38bdf8',
        2, 10
      ));
    }
  }

  draw(ctx) {
    ctx.save();

    // Draw radiant comet trail
    if (this.trail.length > 1) {
      ctx.beginPath();
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      for (let i = 1; i < this.trail.length; i++) {
        ctx.lineTo(this.trail[i].x, this.trail[i].y);
      }
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // Bullet body glow
    ctx.shadowColor = '#00e5ff';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#0284c7';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Bright core
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.48, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}

// Blue MP Recovery Orb Class (+30 MP when collected in Boss Battle)
class MpOrb {
  constructor(x, y, vx, vy) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.radius = 16;
    this.pulse = 0;
    this.life = 600; // ~10 seconds
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.pulse += 0.08;
    this.life--;

    // Sparkle tail
    if (Math.random() < 0.4) {
      particles.push(new Particle(
        this.x + (Math.random() - 0.5) * 10,
        this.y + (Math.random() - 0.5) * 10,
        -this.vx * 0.3 + (Math.random() - 0.5),
        -this.vy * 0.3 + (Math.random() - 0.5),
        Math.random() > 0.5 ? '#38bdf8' : '#60a5fa',
        Math.random() * 2.5 + 1.5,
        14
      ));
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    const pulseScale = 1 + Math.sin(this.pulse) * 0.14;
    const curRadius = this.radius * pulseScale;

    // Glowing outer aura
    ctx.shadowColor = '#38bdf8';
    ctx.shadowBlur = 18;

    // Rotating energy ring
    ctx.strokeStyle = 'rgba(147, 197, 253, 0.7)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, curRadius + 6, 0, Math.PI * 2);
    ctx.stroke();

    // Main orb body
    const grad = ctx.createRadialGradient(0, 0, 2, 0, 0, curRadius);
    grad.addColorStop(0, '#ffffff');
    grad.addColorStop(0.4, '#60a5fa');
    grad.addColorStop(1, '#1d4ed8');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(0, 0, curRadius, 0, Math.PI * 2);
    ctx.fill();

    // "EP" symbol inside
    ctx.shadowBlur = 0;
    ctx.font = '900 10px -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('EP', 0, 0);

    ctx.restore();
  }
}

// SummonMinion Class (Ally Shooter summoned by Player: HP 50, Shoots every 3s, stays around player's Y)
class SummonMinion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.hp = 50;
    this.maxHp = 50;
    this.scale = 1.0;
    this.radius = 22 * this.scale;
    this.angle = 0;
    this.rotSpeed = 0.035;
    this.shootTimer = 180; // 3 seconds (60 frames/sec * 3 = 180)
    this.maxShootTimer = 180;
    this.offsetX = (Math.random() - 0.5) * 80;
    this.offsetY = (Math.random() - 0.5) * 30; // たむろするY座標オフセット
    this.wobblePhase = Math.random() * Math.PI * 2;
  }

  update() {
    this.angle += this.rotSpeed;
    this.wobblePhase += 0.04;

    // プレイヤーと同じY座標付近でたむろ（ふわふわと追従）
    const targetY = player.y + this.offsetY + Math.sin(this.wobblePhase) * 16;
    let targetX;
    const isPortrait = canvas.height > canvas.width;
    if (isPortrait) {
      // 縦画面：プレイヤーの少し後ろ（下側）または横
      targetX = player.x + this.offsetX + Math.cos(this.wobblePhase * 0.8) * 20;
    } else {
      // 横画面：プレイヤーの少し後方（左側）または周囲
      targetX = player.x - 70 + this.offsetX + Math.cos(this.wobblePhase * 0.8) * 20;
    }

    this.x += (targetX - this.x) * 0.08;
    this.y += (targetY - this.y) * 0.08;

    // 3秒に1回弾を発射
    this.shootTimer--;
    if (this.shootTimer <= 0) {
      this.shootTimer = this.maxShootTimer;
      this.fireBullet();
    }
  }

  fireBullet() {
    // 最も近い敵またはボスを狙う。いなければ前方へ射撃
    let target = null;
    let minDist = 999999;

    const isClient = (typeof window !== 'undefined' && window.isMultiplayerMode && window.multiplayerManager && !window.multiplayerManager.isHost);
    const targetBoss = isClient ? (window.multiplayerManager?.remoteGameObjects?.boss) : boss;
    const targetEnemies = isClient ? (window.multiplayerManager?.remoteGameObjects?.enemies || []) : enemies;

    if (targetBoss && targetBoss.hp > 0) {
      target = targetBoss;
      minDist = Math.hypot(targetBoss.x - this.x, targetBoss.y - this.y);
    }

    for (const e of targetEnemies) {
      if (!e) continue;
      const d = Math.hypot(e.x - this.x, e.y - this.y);
      if (d < minDist) {
        minDist = d;
        target = e;
      }
    }

    let dirX = 1;
    let dirY = 0;
    const isPortrait = canvas.height > canvas.width;
    if (isPortrait) {
      dirX = 0;
      dirY = -1; // 上向き
    }

    if (target) {
      const dx = target.x - this.x;
      const dy = target.y - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 1) {
        dirX = dx / dist;
        dirY = dy / dist;
      }
    }

    const bulletSpeed = 14;
    const spawnDist = this.radius + 6;
    const bx = this.x + dirX * spawnDist;
    const by = this.y + dirY * spawnDist;

    bullets.push(new Bullet(bx, by, dirX * bulletSpeed, dirY * bulletSpeed));

    // 発射エフェクト
    for (let k = 0; k < 6; k++) {
      const spkAng = Math.random() * Math.PI * 2;
      particles.push(new Particle(
        bx, by,
        Math.cos(spkAng) * 3 + dirX * 2,
        Math.sin(spkAng) * 3 + dirY * 2,
        '#a855f7',
        2.5, 12
      ));
    }
    floatingTexts.push(new FloatingText(this.x, this.y - this.radius - 10, '🤖 SHOT!', '#c084fc'));
  }

  takeDamage(amount = 20) {
    this.hp -= amount;
    // 被弾エフェクト
    shockwaves.push(new Shockwave(this.x, this.y, 35, '#c084fc', 3));
    for (let k = 0; k < 6; k++) {
      const spkAng = Math.random() * Math.PI * 2;
      particles.push(new Particle(
        this.x, this.y,
        Math.cos(spkAng) * 3.5,
        Math.sin(spkAng) * 3.5,
        '#e879f9',
        2.5, 12
      ));
    }
    floatingTexts.push(new FloatingText(this.x, this.y - 20, `-${amount}`, '#f43f5e'));
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // 味方オーラ
    ctx.shadowColor = '#c084fc';
    ctx.shadowBlur = this.radius * 0.75;

    ctx.save();
    ctx.rotate(this.angle);

    // しょったー風の外側ヘキサゴンフレーム（味方カラー：サイバーパープル＆シアン）
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = Math.max(2.5, this.radius * 0.1);
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const r = this.radius;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // 内部キャノンスター
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-this.radius * 0.7, 0);
    ctx.lineTo(this.radius * 0.7, 0);
    ctx.moveTo(0, -this.radius * 0.7);
    ctx.lineTo(0, this.radius * 0.7);
    ctx.stroke();

    // 輝く味方コア（弾チャージ状況で脈動）
    const chargeRatio = 1 - (this.shootTimer / this.maxShootTimer);
    ctx.shadowBlur = 12 + chargeRatio * 8;
    ctx.fillStyle = chargeRatio > 0.85 ? '#38bdf8' : '#a855f7';
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.38, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();

    // 味方HPバー（HP 50）
    const barW = this.radius * 1.5;
    const barH = 5;
    const barY = -this.radius - (barH + 7);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
    ctx.fillRect(-barW / 2, barY, barW, barH);
    const hpPct = Math.max(0, this.hp / this.maxHp);
    ctx.fillStyle = hpPct > 0.3 ? '#c084fc' : '#f43f5e';
    ctx.fillRect(-barW / 2, barY, barW * hpPct, barH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.lineWidth = 1;
    ctx.strokeRect(-barW / 2, barY, barW, barH);

    // HP数値表示
    ctx.font = '800 9px monospace';
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(`${this.hp}/${this.maxHp}`, 0, barY - 2);

    ctx.restore();
  }
}

// Enemy Class (Normal & Large Heavy)
let nextEnemyId = 1;
class Enemy {
  constructor(x, y, vx, vy, isPortrait, type = 'normal') {
    this.id = nextEnemyId++;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.type = type;
    this.isPortrait = isPortrait;
    this.hasGrazed = false; // Graze flag
    this.angle = 0;

    // Monster size scale: identical on PC and Mobile (1.0)
    const scale = 1.0;

    if (type === 'large') {
      // Large Enemy: radius 34 (Mobile) / 68 (PC), 5 HP to kill
      this.radius = 34 * scale;
      this.hp = Math.ceil(5 * (window.multiHpMult || 1));
      this.maxHp = this.hp;
      this.color = '#ff2a6d';
      this.rotSpeed = (Math.random() - 0.5) * 0.03;
    } else if (type === 'shooter') {
      // New Enemy (Shooter): radius 22 (Mobile) / 44 (PC), 3 HP, fires 1 aimed bullet at player
      this.radius = 22 * scale;
      this.hp = Math.ceil(3 * (window.multiHpMult || 1));
      this.maxHp = this.hp;
      this.color = '#a855f7'; // Neon purple / violet
      this.rotSpeed = (Math.random() - 0.5) * 0.04;
      this.hasShot = false;
      this.shootDelay = 70 + Math.floor(Math.random() * 30); // ~1.1 to 1.6 seconds after spawn
    } else if (type === 'chaser') {
      // New Enemy (Chaser / 追尾敵): radius 19, 3 HP, gently steers/homes towards player position
      this.radius = 19 * scale;
      this.hp = Math.ceil(3 * (window.multiHpMult || 1));
      this.maxHp = this.hp;
      this.color = '#f59e0b'; // Neon amber / orange
      this.rotSpeed = 0;
      this.speed = Math.hypot(vx, vy);
      this.turnRate = 0.028; // Subtle / gentle homing turn rate
    } else {
      // Normal Enemy: radius 17 (Mobile) / 34 (PC), 2 HP
      this.radius = 17 * scale;
      this.hp = Math.ceil(2 * (window.multiHpMult || 1));
      this.maxHp = this.hp;
      this.color = '#ff5555';
      this.rotSpeed = (Math.random() - 0.5) * 0.06;
    }
  }

  update() {
    if (this.type === 'chaser') {
      // In multiplayer, target a live player; in solo, target player
      let targetX = player.x, targetY = player.y;
      if (window.isMultiplayerMode && window.multiplayerManager) {
        const targets = window.multiplayerManager.getAliveTargets();
        if (targets.length > 0) {
          let closestDist = Infinity;
          for (const t of targets) {
            const d = Math.hypot(t.x - this.x, t.y - this.y);
            if (d < closestDist) {
              closestDist = d;
              targetX = t.x;
              targetY = t.y;
            }
          }
        }
      }

      const dx = targetX - this.x;
      const dy = targetY - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 5) {
        const targetAngle = Math.atan2(dy, dx);
        const currentAngle = Math.atan2(this.vy, this.vx);
        let diff = targetAngle - currentAngle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;

        const steer = Math.sign(diff) * Math.min(Math.abs(diff), this.turnRate * timeScale);
        const newAngle = currentAngle + steer;
        const currentSpeed = Math.hypot(this.vx, this.vy) || this.speed || 3.0;
        this.vx = Math.cos(newAngle) * currentSpeed;
        this.vy = Math.sin(newAngle) * currentSpeed;
        this.angle = newAngle;
      }
    }

    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    if (this.type !== 'chaser') {
      this.angle += this.rotSpeed * timeScale;
    }

    // Shooter Enemy: Fire 1 aimed bullet towards player
    if (this.type === 'shooter' && !this.hasShot) {
      this.shootDelay -= timeScale;
      if (this.shootDelay <= 0) {
        this.hasShot = true;
        this.fireAimedBullet();
      }
    }
  }

  fireAimedBullet() {
    let targetX = player.x, targetY = player.y;
    if (window.isMultiplayerMode && window.multiplayerManager) {
      const targets = window.multiplayerManager.getAliveTargets();
      if (targets.length > 0) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        targetX = t.x; targetY = t.y;
      }
    }
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    let dirX = 0;
    let dirY = 1;
    if (dist > 1) {
      dirX = dx / dist;
      dirY = dy / dist;
    }

    const bulletSpeed = 6.2;
    bossBullets.push(new BossBullet(this.x, this.y, dirX * bulletSpeed, dirY * bulletSpeed));

    // Muzzle flash / sparks
    for (let k = 0; k < 5; k++) {
      const spkAng = Math.random() * Math.PI * 2;
      particles.push(new Particle(
        this.x, this.y,
        Math.cos(spkAng) * 3,
        Math.sin(spkAng) * 3,
        '#c084fc',
        2.5, 12
      ));
    }
    floatingTexts.push(new FloatingText(this.x, this.y - this.radius - 8, '⚡ FIRE!', '#c084fc'));
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.type === 'large') {
      // Heavy Enemy Body
      ctx.save();
      ctx.rotate(this.angle);

      // Outer heavy aura
      ctx.shadowColor = '#ff2a6d';
      ctx.shadowBlur = this.radius * 0.53;

      // Heavy Armored Octagon
      ctx.fillStyle = this.color;
      ctx.beginPath();
      const r = this.radius;
      const innerR = r * 0.65;
      for (let i = 0; i < 8; i++) {
        const a1 = (i * Math.PI) / 4;
        const a2 = a1 + Math.PI / 8;
        if (i === 0) ctx.moveTo(Math.cos(a1) * r, Math.sin(a1) * r);
        else ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        ctx.lineTo(Math.cos(a2) * innerR, Math.sin(a2) * innerR);
      }
      ctx.closePath();
      ctx.fill();

      // Inner Core
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#05d9e8';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.24, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Mini HP Bar above head
      const barW = this.radius * 1.25;
      const barH = Math.max(5, this.radius * 0.15);
      const barY = -this.radius - (barH + 7);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(-barW / 2, barY, barW, barH);
      const hpPct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = hpPct > 0.4 ? '#ff2a6d' : '#f85149';
      ctx.fillRect(-barW / 2, barY, barW * hpPct, barH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-barW / 2, barY, barW, barH);

    } else if (this.type === 'shooter') {
      // Shooter Enemy (Triangle Interceptor with central cannon eye)
      ctx.save();
      ctx.rotate(this.angle);

      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = this.radius * 0.65;

      // Outer Hexagonal Cannon Frame
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#a855f7';
      ctx.lineWidth = Math.max(2.5, this.radius * 0.1);
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        const r = this.radius;
        if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
        else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Internal Cannon Star / Cross
      ctx.strokeStyle = this.hasShot ? '#64748b' : '#e879f9';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-this.radius * 0.7, 0);
      ctx.lineTo(this.radius * 0.7, 0);
      ctx.moveTo(0, -this.radius * 0.7);
      ctx.lineTo(0, this.radius * 0.7);
      ctx.stroke();

      // Glowing Center Core (Changes color when bullet is ready/charging vs fired)
      ctx.shadowBlur = 10;
      ctx.fillStyle = this.hasShot ? '#475569' : '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // Mini HP Bar above head
      const barW = this.radius * 1.2;
      const barH = 4;
      const barY = -this.radius - (barH + 5);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(-barW / 2, barY, barW, barH);
      const hpPct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = '#a855f7';
      ctx.fillRect(-barW / 2, barY, barW * hpPct, barH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-barW / 2, barY, barW, barH);

    } else if (this.type === 'chaser') {
      // Chaser Enemy (Stealth Arrowhead Fighter, always facing movement direction)
      ctx.save();
      ctx.rotate(this.angle);

      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = this.radius * 0.7;

      // Outer Arrowhead Hull
      ctx.fillStyle = '#451a03';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(this.radius * 1.2, 0);                 // Nose
      ctx.lineTo(-this.radius * 0.9, -this.radius * 0.9); // Top wingtip
      ctx.lineTo(-this.radius * 0.4, 0);                 // Engine notch
      ctx.lineTo(-this.radius * 0.9, this.radius * 0.9);  // Bottom wingtip
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Glowing Core Eye
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(this.radius * 0.1, 0, this.radius * 0.28, 0, Math.PI * 2);
      ctx.fill();

      // Thruster flame effect
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ef4444';
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-this.radius * 0.4, -3);
      ctx.lineTo(-this.radius * 0.8 - Math.random() * 5, 0);
      ctx.lineTo(-this.radius * 0.4, 3);
      ctx.closePath();
      ctx.fill();

      ctx.restore();

      // Mini HP Bar above head
      const barW = this.radius * 1.2;
      const barH = 4;
      const barY = -this.radius - (barH + 5);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(-barW / 2, barY, barW, barH);
      const hpPct = Math.max(0, this.hp / this.maxHp);
      ctx.fillStyle = '#f59e0b';
      ctx.fillRect(-barW / 2, barY, barW * hpPct, barH);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.lineWidth = 1;
      ctx.strokeRect(-barW / 2, barY, barW, barH);

    } else {
      // Normal Diamond Enemy
      ctx.rotate(this.angle);
      ctx.shadowColor = '#ff2222';
      ctx.shadowBlur = this.radius * 0.7;

      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.radius, 0);
      ctx.lineTo(0, -this.radius);
      ctx.lineTo(-this.radius, 0);
      ctx.lineTo(0, this.radius);
      ctx.closePath();
      ctx.fill();

      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }
}

// Boss Bullet Class (Red glow, grazing gives MP, optional shape/type support)
class BossBullet {
  constructor(x, y, vx, vy, bulletShape = null) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.bulletShape = bulletShape; // null, 'shooter', 'normal', 'large', 'chaser', 'big_orb'
    this.radius = 7;
    this.color = '#ff3366';
    this.life = 260;
    this.hasGrazed = false;
    this.angle = Math.atan2(vy, vx);

    if (bulletShape === 'large') {
      this.radius = 16;
      this.color = '#ff2a6d';
    } else if (bulletShape === 'shooter') {
      this.radius = 12;
      this.color = '#c084fc';
    } else if (bulletShape === 'chaser') {
      this.radius = 11;
      this.color = '#f59e0b';
    } else if (bulletShape === 'normal') {
      this.radius = 10;
      this.color = '#ff5555';
    } else if (bulletShape === 'big_orb') {
      this.radius = 18;
      this.color = '#fde047';
    }
  }

  update() {
    this.x += this.vx * timeScale;
    this.y += this.vy * timeScale;
    this.life -= timeScale;
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.bulletShape === 'large') {
      // Mini Octagon Hard Enemy bullet
      ctx.rotate(this.angle);
      ctx.shadowColor = '#ff2a6d';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#ff2a6d';
      ctx.beginPath();
      const r = this.radius, innerR = r * 0.65;
      for (let i = 0; i < 8; i++) {
        const a1 = (i * Math.PI) / 4, a2 = a1 + Math.PI / 8;
        if (i === 0) ctx.moveTo(Math.cos(a1) * r, Math.sin(a1) * r);
        else ctx.lineTo(Math.cos(a1) * r, Math.sin(a1) * r);
        ctx.lineTo(Math.cos(a2) * innerR, Math.sin(a2) * innerR);
      }
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#05d9e8';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.bulletShape === 'shooter') {
      // Mini Shooter Hexagon bullet
      ctx.rotate(this.angle);
      ctx.shadowColor = '#c084fc';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#1e1b4b';
      ctx.strokeStyle = '#c084fc';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const a = (i * Math.PI) / 3;
        if (i === 0) ctx.moveTo(Math.cos(a) * this.radius, Math.sin(a) * this.radius);
        else ctx.lineTo(Math.cos(a) * this.radius, Math.sin(a) * this.radius);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#e879f9';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.bulletShape === 'chaser') {
      // Mini Chaser Arrowhead bullet
      ctx.rotate(this.angle);
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 14;
      ctx.fillStyle = '#451a03';
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(this.radius * 1.2, 0);
      ctx.lineTo(-this.radius * 0.9, -this.radius * 0.9);
      ctx.lineTo(-this.radius * 0.4, 0);
      ctx.lineTo(-this.radius * 0.9, this.radius * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.3, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.bulletShape === 'normal') {
      // Mini Diamond Normal bullet
      ctx.rotate(this.angle);
      ctx.shadowColor = '#ff5555';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#ff5555';
      ctx.beginPath();
      ctx.moveTo(this.radius, 0);
      ctx.lineTo(0, -this.radius);
      ctx.lineTo(-this.radius, 0);
      ctx.lineTo(0, this.radius);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.35, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.bulletShape === 'big_orb') {
      // Sparkling Divine Sunflower Orb
      ctx.shadowColor = '#f59e0b';
      ctx.shadowBlur = 20;
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();
      // Swirling center
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, this.radius * 0.45, 0, Math.PI * 2);
      ctx.fill();
      // Sunflower seed outline effect
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius + 3, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Default Boss Bullet
      ctx.shadowColor = '#ff1744';
      ctx.shadowBlur = 12;
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
      ctx.fill();

      // Hot energy center
      ctx.shadowBlur = 0;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 3, 0, Math.PI * 2);
      ctx.fill();

      // Trailing spark
      ctx.strokeStyle = 'rgba(255, 51, 102, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-this.vx * 1.8, -this.vy * 1.8);
      ctx.stroke();
    }

    ctx.restore();
  }
}

// Level 1 Boss Class
// Normal enemy radius is 17. 3x size = ~51 radius.
// HP = 100.
// Action every 3 seconds: Random between (1) Summon 5 heavy enemies, (2) Fire 10 aimed bullets.
// Position: Hang out at Right on PC (landscape), Top on Smartphone (portrait).
class Boss {
  constructor() {
    // Boss scale: identical on PC and Mobile (1.0)
    const scale = 1.0;
    this.radius = 51 * scale;
    this.hp = Math.ceil(100 * (window.multiHpMult || 1));
    this.maxHp = this.hp;
    this.actionInterval = 3000; // 3 seconds per action
    this.lastActionTime = performance.now();
    this.angle = 0;
    this.baseTime = performance.now();
    this.color = '#e11d48';
    this.hasGrazed = false;

    // Burst attack state (for shooting 10 bullets consecutively)
    this.burstRemaining = 0;
    this.lastBurstShot = 0;
    this.burstInterval = 90; // 90ms between shots in the 10-shot volley

    // Determine initial entry position
    const isPortrait = canvas.height > canvas.width;
    if (isPortrait) {
      this.x = canvas.width / 2;
      this.y = -80;
    } else {
      this.x = canvas.width + 80;
      this.y = canvas.height / 2;
    }
  }

  update(currentTime) {
    const isPortrait = canvas.height > canvas.width;
    const elapsed = (currentTime - this.baseTime) / 1000;

    // Target idle position: Right side on landscape (PC), Top side on portrait (Phone)
    let targetX, targetY;
    if (isPortrait) {
      // Mobile: Upper area (~20% from top), swaying horizontally
      targetX = canvas.width / 2 + Math.sin(elapsed * 1.4) * (canvas.width * 0.32);
      targetY = Math.max(90, canvas.height * 0.20 + Math.cos(elapsed * 2.2) * 15);
    } else {
      // PC: Right area (~80% from left), swaying vertically
      targetX = Math.min(canvas.width - this.radius - 30, canvas.width * 0.80 + Math.sin(elapsed * 1.5) * 15);
      targetY = canvas.height / 2 + Math.sin(elapsed * 1.2) * (canvas.height * 0.28);
    }

    // Smooth movement towards target anchor position
    this.x += (targetX - this.x) * 0.05 * timeScale;
    this.y += (targetY - this.y) * 0.05 * timeScale;

    this.angle += 0.015 * timeScale;

    // Process ongoing 10-bullet burst volley
    if (this.burstRemaining > 0 && currentTime - this.lastBurstShot >= this.burstInterval) {
      this.fireAimedBullet();
      this.burstRemaining--;
      this.lastBurstShot = currentTime;
    }

    // Trigger action every 3 seconds
    if (currentTime - this.lastActionTime >= this.actionInterval) {
      this.lastActionTime = currentTime;
      this.performRandomAction();
    }
  }

  performRandomAction() {
    // 50% chance: Summon 5 heavy enemies, 50% chance: 10 aimed bullets
    const pickSummon = Math.random() < 0.5;
    if (pickSummon) {
      this.actionSummon5();
    } else {
      this.actionShoot10();
    }
  }

  // Skill 1: Summon 5 Heavy/Armored Enemies
  actionSummon5() {
    floatingTexts.push(new FloatingText(this.x, this.y - this.radius - 14, '⚠️ ENEMY SUMMON (x5)!', '#ff2a6d'));
    screenShake = 12;

    // Summon shockwave
    shockwaves.push(new Shockwave(this.x, this.y, this.radius * 2.5, '#ff2a6d', 6));

    const isPortrait = canvas.height > canvas.width;
    const count = 5;

    for (let i = 0; i < count; i++) {
      let vx, vy;
      if (isPortrait) {
        // Downward spread towards player
        const spreadAngle = Math.PI / 2 + ((i - 2) * 0.28);
        const spd = 2.4 + Math.random() * 0.8;
        vx = Math.cos(spreadAngle) * spd;
        vy = Math.sin(spreadAngle) * spd;
      } else {
        // Leftward spread towards player
        const spreadAngle = Math.PI + ((i - 2) * 0.28);
        const spd = 2.6 + Math.random() * 0.8;
        vx = Math.cos(spreadAngle) * spd;
        vy = Math.sin(spreadAngle) * spd;
      }

      // Spawn heavy enemy with 5 HP
      const spawnX = this.x + (Math.random() - 0.5) * 30;
      const spawnY = this.y + (Math.random() - 0.5) * 30;
      enemies.push(new Enemy(spawnX, spawnY, vx, vy, isPortrait, 'large'));

      // Spawn burst particles
      for (let p = 0; p < 8; p++) {
        const pAng = Math.random() * Math.PI * 2;
        particles.push(new Particle(
          spawnX, spawnY,
          Math.cos(pAng) * 4,
          Math.sin(pAng) * 4,
          '#ff2a6d', 3, 16
        ));
      }
    }
  }

  // Skill 2: Shoot 10 Aimed Bullets
  actionShoot10() {
    floatingTexts.push(new FloatingText(this.x, this.y - this.radius - 14, '💥 RAPID BARRAGE (x10)!', '#fbbf24'));
    this.burstRemaining = 10;
    this.lastBurstShot = performance.now();
    this.fireAimedBullet();
    this.burstRemaining--;
  }

  fireAimedBullet() {
    // In multiplayer, pick a random alive player to target
    let targetX = player.x, targetY = player.y;
    if (window.isMultiplayerMode && window.multiplayerManager) {
      const targets = window.multiplayerManager.getAliveTargets();
      if (targets.length > 0) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        targetX = t.x; targetY = t.y;
      }
    }
    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy);

    let dirX = -1;
    let dirY = 0;
    if (dist > 1) {
      dirX = dx / dist;
      dirY = dy / dist;
    }

    // Slight random spread for bullet barrage (+- 0.1 rad)
    const angleOffset = (Math.random() - 0.5) * 0.22;
    const cosO = Math.cos(angleOffset);
    const sinO = Math.sin(angleOffset);
    const spreadVx = (dirX * cosO - dirY * sinO) * 7.5;
    const spreadVy = (dirX * sinO + dirY * cosO) * 7.5;

    bossBullets.push(new BossBullet(this.x, this.y, spreadVx, spreadVy));

    // Muzzle sparks
    for (let k = 0; k < 3; k++) {
      particles.push(new Particle(
        this.x, this.y,
        dirX * 3 + (Math.random() - 0.5) * 4,
        dirY * 3 + (Math.random() - 0.5) * 4,
        '#ff3366', 2.5, 10
      ));
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);

    // Glowing Aura
    ctx.shadowColor = '#ff1744';
    ctx.shadowBlur = this.radius * 0.62;

    // Outer rotating energy ring
    ctx.save();
    ctx.rotate(-this.angle * 1.5);
    ctx.strokeStyle = 'rgba(255, 34, 85, 0.45)';
    ctx.lineWidth = Math.max(3, this.radius * 0.06);
    ctx.setLineDash([14, 8]);
    ctx.beginPath();
    ctx.arc(0, 0, this.radius + 14, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();

    // Heavy Armored Outer Hull (Hexagonal / 12-point star)
    ctx.save();
    ctx.rotate(this.angle);
    ctx.fillStyle = '#1e1022';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = Math.max(4, this.radius * 0.08);
    ctx.beginPath();
    const spikes = 8;
    const outerR = this.radius;
    const innerR = this.radius * 0.72;
    for (let i = 0; i < spikes * 2; i++) {
      const r = (i % 2 === 0) ? outerR : innerR;
      const a = (i * Math.PI) / spikes;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Intermediate Energy Core (Rotating pulsing red-gold)
    ctx.save();
    ctx.rotate(-this.angle * 2.2);
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3;
      const r = this.radius * 0.48;
      if (i === 0) ctx.moveTo(Math.cos(a) * r, Math.sin(a) * r);
      else ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
    }
    ctx.closePath();
    ctx.fill();
    ctx.restore();

    // Central Glowing Reactor Eye
    ctx.shadowBlur = this.radius * 0.35;
    ctx.shadowColor = '#00f5d4';
    ctx.fillStyle = '#00f5d4';
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
// Event Boss: HamGod (ハム神 - Immortal Djungarian Hamster)
// ========================================================
class EventBossHamGod {
  constructor() {
    this.isEventBoss = true;
    const scale = 1.0;
    this.radius = 54 * scale;
    this.hp = 999999; // Never dies
    this.maxHp = 999999;
    this.totalDamage = 0;
    this.enrageLevel = 1;
    this.actionInterval = 5000; // Attacks every 5 seconds!
    this.lastActionTime = performance.now();
    this.angle = 0;
    this.baseTime = performance.now();
    this.animTime = 0;
    this.color = '#38bdf8';
    this.hasGrazed = false;

    // Pattern rotation: 0 = 4-Enemy 5-Burst, 1 = Random Big Orb, 2 = 2-Sec Tracking Laser
    this.attackPatternIndex = 0;

    // Attack 1 state: 4 types of enemies, 5 bullets fired in rapid succession
    this.enemyBurstQueue = [];
    this.lastEnemyBurstShot = 0;
    this.enemyBurstInterval = 140; // 140ms between shots

    // Attack 3 state: 2-second tracking laser
    this.laserActive = false;
    this.laserStartTime = 0;
    this.laserDuration = 2000; // 2.0 seconds
    this.laserAngle = 0;
    this.laserTurnSpeed = 0.038; // slowly tracks player
    this.laserLength = 1600;
    this.laserWidth = 34;
    this.lastLaserDamageTime = 0;

    // Determine initial entry position
    const isPortrait = canvas.height > canvas.width;
    if (isPortrait) {
      this.x = canvas.width / 2;
      this.y = -90;
    } else {
      this.x = canvas.width + 90;
      this.y = canvas.height / 2;
    }
  }

  update(currentTime) {
    const isPortrait = canvas.height > canvas.width;
    const elapsed = (currentTime - this.baseTime) / 1000;
    this.animTime += 0.05 * timeScale;

    // Enrage level scales every 15 damage
    this.enrageLevel = 1 + Math.floor(this.totalDamage / 15);

    // Target idle position: Right on PC (landscape), Top on Smartphone (portrait)
    let targetX, targetY;
    if (isPortrait) {
      targetX = canvas.width / 2 + Math.sin(elapsed * 1.6) * (canvas.width * 0.32);
      targetY = Math.max(90, canvas.height * 0.20 + Math.cos(elapsed * 2.5) * 15);
    } else {
      targetX = Math.min(canvas.width - this.radius - 30, canvas.width * 0.80 + Math.sin(elapsed * 1.7) * 18);
      targetY = canvas.height / 2 + Math.sin(elapsed * 1.3) * (canvas.height * 0.28);
    }

    this.x += (targetX - this.x) * 0.05 * timeScale;
    this.y += (targetY - this.y) * 0.05 * timeScale;
    this.angle += 0.015 * timeScale;

    // Process Attack 1: 5-enemy shot sequence
    if (this.enemyBurstQueue.length > 0 && currentTime - this.lastEnemyBurstShot >= this.enemyBurstInterval) {
      const bulletType = this.enemyBurstQueue.shift();
      this.fireEnemyShapedBullet(bulletType);
      this.lastEnemyBurstShot = currentTime;
    }

    // Process Attack 3: 2-second tracking laser
    if (this.laserActive) {
      const laserElapsed = currentTime - this.laserStartTime;
      if (laserElapsed >= this.laserDuration) {
        this.laserActive = false;
      } else {
        // Slowly steer laser angle towards player
        let targetX = player.x, targetY = player.y;
        if (window.isMultiplayerMode && window.multiplayerManager) {
          const targets = window.multiplayerManager.getAliveTargets();
          if (targets.length > 0) {
            targetX = targets[0].x;
            targetY = targets[0].y;
          }
        }
        const desiredAngle = Math.atan2(targetY - this.y, targetX - this.x);
        let angleDiff = desiredAngle - this.laserAngle;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        const turnSpd = (this.laserTurnSpeed + (this.enrageLevel - 1) * 0.005) * timeScale;
        this.laserAngle += Math.sign(angleDiff) * Math.min(Math.abs(angleDiff), turnSpd);

        // Laser beam collision with player
        if (currentTime - this.lastLaserDamageTime >= 280) {
          this.checkLaserCollision();
          this.lastLaserDamageTime = currentTime;
        }

        // Screen shake & particles during laser
        if (Math.random() < 0.35) screenShake = Math.max(screenShake, 4);
      }
    }

    // Trigger action every 5 seconds (slightly reduced by enrage level down to 3.8s)
    const currentInterval = Math.max(3800, this.actionInterval - (this.enrageLevel - 1) * 120);
    if (currentTime - this.lastActionTime >= currentInterval) {
      this.lastActionTime = currentTime;
      this.performNextAction();
    }
  }

  performNextAction() {
    switch (this.attackPatternIndex) {
      case 0:
        this.actionEnemyBarrage5();
        break;
      case 1:
        this.actionRandomBigOrb();
        break;
      case 2:
        this.actionTrackingLaser();
        break;
    }
    this.attackPatternIndex = (this.attackPatternIndex + 1) % 3;
  }

  // Skill 1: 4 types of enemies (shooter, normal, large/hard, chaser) 5 in a row fired at player!
  actionEnemyBarrage5() {
    floatingTexts.push(new FloatingText(this.x, this.y - this.radius - 16, '🐹 4種敵・5連射ラッシュ！', '#38bdf8'));
    screenShake = 14;
    shockwaves.push(new Shockwave(this.x, this.y, this.radius * 2.2, '#38bdf8', 6));

    // 4 types: shooter, normal, large, chaser. 5 in a row!
    const types = ['shooter', 'normal', 'large', 'chaser', 'shooter'];
    this.enemyBurstQueue = types.slice();
    this.lastEnemyBurstShot = performance.now() - this.enemyBurstInterval; // Fire first immediately
  }

  fireEnemyShapedBullet(enemyType) {
    let targetX = player.x, targetY = player.y;
    if (window.isMultiplayerMode && window.multiplayerManager) {
      const targets = window.multiplayerManager.getAliveTargets();
      if (targets.length > 0) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        targetX = t.x; targetY = t.y;
      }
    }

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = (6.5 + (this.enrageLevel - 1) * 0.4);
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;

    bossBullets.push(new BossBullet(this.x, this.y, vx, vy, enemyType));

    // Sparks
    for (let k = 0; k < 6; k++) {
      const pAng = Math.random() * Math.PI * 2;
      particles.push(new Particle(this.x, this.y, Math.cos(pAng) * 4, Math.sin(pAng) * 4, '#38bdf8', 3, 14));
    }
  }

  // Skill 2: Random size slightly large orb fired towards player
  actionRandomBigOrb() {
    const sizeMultiplier = 1.6 + Math.random() * 1.8; // Random big size
    floatingTexts.push(new FloatingText(this.x, this.y - this.radius - 16, '🐹 神聖ヒマワリ光弾！', '#fde047'));
    screenShake = 18;
    shockwaves.push(new Shockwave(this.x, this.y, this.radius * 2.5, '#fde047', 8));

    let targetX = player.x, targetY = player.y;
    if (window.isMultiplayerMode && window.multiplayerManager) {
      const targets = window.multiplayerManager.getAliveTargets();
      if (targets.length > 0) {
        const t = targets[Math.floor(Math.random() * targets.length)];
        targetX = t.x; targetY = t.y;
      }
    }

    const dx = targetX - this.x;
    const dy = targetY - this.y;
    const dist = Math.hypot(dx, dy) || 1;
    const speed = (5.2 + (this.enrageLevel - 1) * 0.3);
    const vx = (dx / dist) * speed;
    const vy = (dy / dist) * speed;

    // Bullet with random big size
    const orb = new BossBullet(this.x, this.y, vx, vy, 'big_orb');
    orb.radius = Math.floor(11 * sizeMultiplier);
    orb.color = '#fde047';
    bossBullets.push(orb);

    // If highly enraged (lv >= 4), also emit 2 smaller side orbs
    if (this.enrageLevel >= 4) {
      const ang = Math.atan2(vy, vx);
      for (const off of [-0.35, 0.35]) {
        const sideVx = Math.cos(ang + off) * speed * 0.95;
        const sideVy = Math.sin(ang + off) * speed * 0.95;
        const sideOrb = new BossBullet(this.x, this.y, sideVx, sideVy, 'big_orb');
        sideOrb.radius = 12;
        sideOrb.color = '#67e8f9';
        bossBullets.push(sideOrb);
      }
    }
  }

  // Skill 3: 2-second continuous tracking laser
  actionTrackingLaser() {
    floatingTexts.push(new FloatingText(this.x, this.y - this.radius - 16, '⚡ ハム神裁きのレーザー (2.0s)！', '#a78bfa'));
    screenShake = 22;
    shockwaves.push(new Shockwave(this.x, this.y, this.radius * 2.8, '#a78bfa', 10));

    let targetX = player.x, targetY = player.y;
    if (window.isMultiplayerMode && window.multiplayerManager) {
      const targets = window.multiplayerManager.getAliveTargets();
      if (targets.length > 0) {
        targetX = targets[0].x;
        targetY = targets[0].y;
      }
    }

    // Set initial laser angle with slight offset so player can react and dodge
    const directAngle = Math.atan2(targetY - this.y, targetX - this.x);
    const initialOffset = (Math.random() > 0.5 ? 1 : -1) * 0.65; // ~37 degrees away
    this.laserAngle = directAngle + initialOffset;
    this.laserActive = true;
    this.laserStartTime = performance.now();
    this.lastLaserDamageTime = performance.now() + 200; // Brief grace period on fire
  }

  checkLaserCollision() {
    if (!this.laserActive) return;

    // Check distance of player center from the laser ray
    const cosL = Math.cos(this.laserAngle);
    const sinL = Math.sin(this.laserAngle);

    const px = player.x - this.x;
    const py = player.y - this.y;

    // Projection along laser ray
    const proj = px * cosL + py * sinL;
    if (proj > 0 && proj < this.laserLength) {
      // Perpendicular distance
      const perpDist = Math.abs(px * (-sinL) + py * cosL);
      const hitRadius = (player.isGuarding ? player.guardRadius : player.radius) + this.laserWidth * 0.45;

      if (perpDist < hitRadius) {
        if (player.isGuarding) {
          spawnGuardSparkles();
          floatingTexts.push(new FloatingText(player.x, player.y - 30, '🛡️ BLOCKED!', '#34d399'));
        } else if (player.isDashing) {
          // Dash invincible
        } else {
          takeDamage();
          createExplosion(player.x, player.y, '#38bdf8');
          floatingTexts.push(new FloatingText(player.x, player.y - 35, '⚡ LASER HIT!', '#f43f5e'));
        }
      }
    }
  }

  draw(ctx) {
    drawHamGodVisual(ctx, this.x, this.y, this.radius, this.animTime, this.enrageLevel, this.laserActive, this.laserAngle);
  }
}

// Collections
let boss = null;
const bossBullets = [];
const bullets = [];
const homingBullets = [];
const summonMinions = [];
const mpOrbs = [];
const enemies = [];
const particles = [];
const shockwaves = [];
const afterimages = [];
const floatingTexts = [];

// MP Orb Spawner Timer in Boss Battle
let lastMpOrbSpawnTime = 0;
const mpOrbSpawnInterval = 4500; // spawn every ~4.5 seconds in boss battle

function spawnMpOrb() {
  const isPortrait = canvas.height > canvas.width;
  let x, y, vx, vy;

  if (isPortrait) {
    // Smartphone / Vertical screen: Flow from TOP to BOTTOM
    x = Math.random() * (canvas.width - 100) + 50;
    y = -35;
    vx = (Math.random() - 0.5) * 1.0;
    vy = 2.2 + Math.random() * 0.8;
  } else {
    // PC / Horizontal screen: Flow from RIGHT to LEFT across the screen
    x = canvas.width + 35;
    y = Math.random() * (canvas.height - 140) + 70;
    vx = -(2.4 + Math.random() * 0.8);
    vy = (Math.random() - 0.5) * 1.0;
  }

  mpOrbs.push(new MpOrb(x, y, vx, vy));
}

// Screen Shake
let screenShake = 0;

// Enemy Spawner
let lastEnemySpawnTime = 0;

function spawnEnemy() {
  const isPortrait = canvas.height > canvas.width;
  const isMobile = checkIsMobile();
  // ~22% chance of 2x size heavy enemy (5 HP)
  const isLarge = Math.random() < 0.22;
  const speedMult = isLarge ? 0.72 : 1.0;

  let x, y, vx, vy;

  if (isPortrait) {
    // Smartphone / Vertical screen: Flow from TOP to BOTTOM
    x = Math.random() * (canvas.width - 80) + 40;
    y = isLarge ? -50 : -30;
    vx = (Math.random() - 0.5) * 1.4 * speedMult;
    vy = (Math.random() * 1.8 + 2.2) * speedMult; // Downward
  } else {
    // PC / Horizontal screen: Flow from RIGHT to LEFT
    const spawnMargin = (isLarge ? 75 : 45) * (isMobile ? 1.0 : 1.5);
    x = canvas.width + spawnMargin;
    y = Math.random() * (canvas.height - 120) + 60;
    vx = -(Math.random() * 1.8 + 2.4) * speedMult; // Leftward
    vy = (Math.random() - 0.5) * 1.4 * speedMult;
  }

  let chosenType = 'normal';
  if (scoreBossDefeated && Math.random() < 0.25) {
    // Unlocked after defeating Score Attack Boss: Homing Chaser enemy!
    chosenType = 'chaser';
  } else if (Math.random() < 0.18) {
    // Shooter spawns from the very beginning now!
    chosenType = 'shooter';
  } else if (isLarge) {
    chosenType = 'large';
  }

  enemies.push(new Enemy(x, y, vx, vy, isPortrait, chosenType));
}

// Fire Bullet (Normal: 130ms span)
function fireBullet() {
  const now = performance.now();
  if (now - lastShootTime < shootInterval) return;
  lastShootTime = now;

  // Compute bullet velocity towards aim crosshair
  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const dist = Math.hypot(dx, dy);

  let dirX = Math.cos(player.angle);
  let dirY = Math.sin(player.angle);

  if (dist > 5) {
    dirX = dx / dist;
    dirY = dy / dist;
  }

  const bulletSpeed = 15;
  const spawnDist = player.radius + 6;
  const bulletX = player.x + dirX * spawnDist;
  const bulletY = player.y + dirY * spawnDist;

  bullets.push(new Bullet(bulletX, bulletY, dirX * bulletSpeed, dirY * bulletSpeed));

  // Small recoil & muzzle flash particles
  player.vx -= dirX * 0.6;
  player.vy -= dirY * 0.6;

  for (let i = 0; i < 3; i++) {
    particles.push(new Particle(
      bulletX,
      bulletY,
      dirX * 3 + (Math.random() - 0.5) * 3,
      dirY * 3 + (Math.random() - 0.5) * 3,
      '#ffe066',
      Math.random() * 2 + 1.5,
      10
    ));
  }
}

// Fire Homing Missile (Skill 3: 260ms interval ~2x of normal, costs 3 EP)
function fireHomingBullet() {
  const now = performance.now();
  if (now - lastHomingShootTime < homingShootInterval) return;

  // Check EP
  if (player.mp < player.homingCost) {
    return;
  }

  // Consume 3 EP
  player.mp = Math.max(0, player.mp - player.homingCost);
  lastHomingShootTime = now;
  player.lastHomingTime = now;

  // Determine initial launch direction (towards mouse or player facing)
  const dx = mouse.x - player.x;
  const dy = mouse.y - player.y;
  const dist = Math.hypot(dx, dy);

  let dirX = Math.cos(player.angle);
  let dirY = Math.sin(player.angle);
  if (dist > 5) {
    dirX = dx / dist;
    dirY = dy / dist;
  }

  // Slight spread offset to give missiles organic arc
  const spreadOffset = (Math.random() - 0.5) * 0.45;
  const initAngle = Math.atan2(dirY, dirX) + spreadOffset;
  const launchSpeed = 10;
  const initVx = Math.cos(initAngle) * launchSpeed;
  const initVy = Math.sin(initAngle) * launchSpeed;

  const spawnDist = player.radius + 8;
  const spawnX = player.x + Math.cos(initAngle) * spawnDist;
  const spawnY = player.y + Math.sin(initAngle) * spawnDist;

  homingBullets.push(new HomingBullet(spawnX, spawnY, initVx, initVy));

  // Cyan flash particles & sound/visual effect
  for (let i = 0; i < 4; i++) {
    const pAng = initAngle + (Math.random() - 0.5) * 0.8;
    particles.push(new Particle(
      spawnX, spawnY,
      Math.cos(pAng) * 3.5,
      Math.sin(pAng) * 3.5,
      '#38bdf8',
      2.5, 12
    ));
  }
}

// Particle Class
class Particle {
  constructor(x, y, vx, vy, color, size, maxLife) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.color = color;
    this.size = size;
    this.maxLife = maxLife;
    this.life = maxLife;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.93;
    this.vy *= 0.93;
    this.life--;
  }

  draw(ctx) {
    const alpha = Math.max(0, this.life / this.maxLife);
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * alpha, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Shockwave Class
class Shockwave {
  constructor(x, y, maxRadius, color, lineWidth) {
    this.x = x;
    this.y = y;
    this.radius = 6;
    this.maxRadius = maxRadius;
    this.color = color;
    this.lineWidth = lineWidth;
    this.life = 1.0;
    this.speed = 13;
  }

  update() {
    this.radius += this.speed;
    this.life = Math.max(0, 1 - (this.radius / this.maxRadius));
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = this.life;
    ctx.strokeStyle = this.color;
    ctx.lineWidth = this.lineWidth * this.life;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

// Afterimage Class
class Afterimage {
  constructor(x, y, angle, color) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.color = color;
    this.life = 1.0;
    this.decay = 0.05;
  }

  update() {
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    ctx.globalAlpha = this.life * 0.4;
    ctx.fillStyle = this.color;

    ctx.beginPath();
    ctx.moveTo(22, 0);
    ctx.lineTo(-14, -13);
    ctx.lineTo(-8, 0);
    ctx.lineTo(-14, 13);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

// SlashEffect Class (for Ultimate Dash slice effect "真っ二つに切る")
class SlashEffect {
  constructor(startX, startY, endX, endY, targetRadius = 35) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
    this.targetRadius = targetRadius;
    this.midX = (startX + endX) / 2;
    this.midY = (startY + endY) / 2;
    this.angle = Math.atan2(endY - startY, endX - startX);
    this.life = 45;
    this.maxLife = 45;
    this.splitDist = 0;
  }

  update() {
    this.life--;
    this.splitDist += 0.9;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    const progress = 1 - (this.life / this.maxLife);
    const alpha = Math.max(0, this.life / this.maxLife);

    ctx.save();
    // Center glow around impact
    ctx.shadowBlur = 28;
    ctx.shadowColor = '#ef4444';

    // Main sharp cutting line
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
    ctx.lineWidth = Math.max(1, 5 * (1 - progress));
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();

    // Red fire / energy trailing slash lines
    ctx.strokeStyle = `rgba(239, 68, 68, ${alpha * 0.9})`;
    ctx.lineWidth = Math.max(2, 10 * (1 - progress));
    ctx.beginPath();
    ctx.moveTo(this.startX, this.startY);
    ctx.lineTo(this.endX, this.endY);
    ctx.stroke();

    // Two severed half slices spreading outward (真っ二つの軌跡)
    const perpAngle = this.angle + Math.PI / 2;
    const offX = Math.cos(perpAngle) * this.splitDist * 1.5;
    const offY = Math.sin(perpAngle) * this.splitDist * 1.5;

    ctx.strokeStyle = `rgba(254, 240, 138, ${alpha * 0.8})`;
    ctx.lineWidth = 3 * (1 - progress);
    // Half 1
    ctx.beginPath();
    ctx.moveTo(this.startX + offX, this.startY + offY);
    ctx.lineTo(this.endX + offX, this.endY + offY);
    ctx.stroke();
    // Half 2
    ctx.beginPath();
    ctx.moveTo(this.startX - offX, this.startY - offY);
    ctx.lineTo(this.endX - offX, this.endY - offY);
    ctx.stroke();

    ctx.restore();
  }
}

// Toggle Ultimate Mode (Requires WP >= 100 and EP >= 100 to activate; can be deactivated anytime)
function toggleUltimateMode() {
  if (gameState !== 'PLAYING') return;

  if (isUltimateMode) {
    // Turn OFF
    isUltimateMode = false;
    if (ultScreenFlash) {
      ultScreenFlash.style.opacity = '0';
    }
    showToast('必殺モード 解除');
  } else {
    // Check requirements: WP >= 100 and EP >= 100
    if (player.wp < 100 || player.mp < 100) {
      let reason = '';
      if (player.wp < 100 && player.mp < 100) {
        reason = `WP(${player.wp}/100) & EP(${Math.floor(player.mp)}/100) 不足！`;
      } else if (player.wp < 100) {
        reason = `WP 不足！ (${player.wp}/100)`;
      } else {
        reason = `EP 不足！ (${Math.floor(player.mp)}/100)`;
      }
      floatingTexts.push(new FloatingText(player.x, player.y - 30, reason, '#f85149'));
      showToast('⚠️ ' + reason);
      return;
    }

    // Turn ON
    isUltimateMode = true;
    screenShake = 18;
    if (ultScreenFlash) {
      ultScreenFlash.style.opacity = '0.75';
      setTimeout(() => {
        if (ultScreenFlash && !isUltimateMode) ultScreenFlash.style.opacity = '0';
        else if (ultScreenFlash) ultScreenFlash.style.opacity = '0.35';
      }, 200);
    }
    floatingTexts.push(new FloatingText(player.x, player.y - 35, '🔥 必殺モード 起動！ 🔥', '#f59e0b'));
    showToast('🔥 必殺モード起動！ ブリンクで一刀両断！');

    // Burst flame/gold particles around player
    for (let i = 0; i < 30; i++) {
      const ang = Math.random() * Math.PI * 2;
      const spd = Math.random() * 6 + 2;
      particles.push(new Particle(
        player.x, player.y,
        Math.cos(ang) * spd,
        Math.sin(ang) * spd,
        Math.random() > 0.5 ? '#f59e0b' : '#ef4444',
        Math.random() * 4 + 2,
        25
      ));
    }
  }
}

// Trigger Skill: Blink Dash + Shockwave (Costs 10 EP) / Ultimate: 一刀両断 (100 WP + 100 EP)
function activateSkill() {
  const now = performance.now();

  // === ULTIMATE MODE: DASH ENHANCEMENT (一刀両断) ===
  if (isUltimateMode) {
    // Check WP and EP requirements
    if (player.wp < 100 || player.mp < 100) {
      floatingTexts.push(new FloatingText(player.x, player.y - 25, 'WP 100 & EP 100 が必要！', '#f85149'));
      return;
    }

    // Find the enemy with the highest HP (Boss or regular enemies)
    let target = null;
    let highestHp = -1;

    const isClient = (typeof window !== 'undefined' && window.isMultiplayerMode && window.multiplayerManager && !window.multiplayerManager.isHost);
    const targetBoss = isClient ? (window.multiplayerManager?.remoteGameObjects?.boss) : boss;
    const targetEnemies = isClient ? (window.multiplayerManager?.remoteGameObjects?.enemies || []) : enemies;

    // Check Boss first
    if (targetBoss && targetBoss.hp > 0) {
      target = targetBoss;
      highestHp = targetBoss.hp;
    }

    // Check minion enemies
    for (let i = 0; i < targetEnemies.length; i++) {
      const e = targetEnemies[i];
      if (e && e.hp > highestHp) {
        highestHp = e.hp;
        target = e;
      }
    }

    if (!target) {
      floatingTexts.push(new FloatingText(player.x, player.y - 25, '敵が見当たらない！', '#f85149'));
      return;
    }

    // Consume 100 WP and 100 EP
    player.wp -= 100;
    player.mp = Math.max(0, player.mp - 100);
    if (wpVal) wpVal.innerText = player.wp;
    isUltimateMode = false;
    if (ultScreenFlash) {
      ultScreenFlash.style.opacity = '0';
    }

    const startX = player.x;
    const startY = player.y;

    // Determine target facing / movement direction
    let dirX = 1;
    let dirY = 0;
    if (target.vx !== undefined && (target.vx !== 0 || target.vy !== 0)) {
      const spd = Math.hypot(target.vx, target.vy);
      dirX = target.vx / spd;
      dirY = target.vy / spd;
    } else {
      // Behind relative to player's approach vector
      const approachDx = target.x - startX;
      const approachDy = target.y - startY;
      const appDist = Math.hypot(approachDx, approachDy);
      if (appDist > 1) {
        dirX = approachDx / appDist;
        dirY = approachDy / appDist;
      }
    }

    // Warp player behind target (e.g. opposite side of direction)
    const behindDistance = (target.radius || 30) + 48;
    const destX = Math.max(player.radius, Math.min(canvas.width - player.radius, target.x - dirX * behindDistance));
    const destY = Math.max(player.radius, Math.min(canvas.height - player.radius, target.y - dirY * behindDistance));

    // Full invincible state and player positioning
    player.x = destX;
    player.y = destY;
    player.vx = dirX * 16;
    player.vy = dirY * 16;
    player.angle = Math.atan2(target.y - destY, target.x - destX);
    player.invincibleTimer = 90; // Invincible during cut
    player.isDashing = true;
    player.dashDuration = 35;

    // Trigger Slow Motion for ~1.0 second (Solo only)
    if (!window.isMultiplayerMode) {
      slowMoTimer = 1.0;
      timeScale = 0.15;
    } else {
      slowMoTimer = 0;
      timeScale = 1.0;
    }

    if (window.isMultiplayerMode && window.multiplayerManager) {
      window.multiplayerManager.sendSkillEvent({
        skill: 'slash',
        startX, startY,
        endX: destX, endY: destY,
        targetX: target.x, targetY: target.y,
        targetRadius: target.radius || 30
      });
    }

    // Flash screen intensely
    if (ultScreenFlash) {
      ultScreenFlash.style.opacity = '0.9';
      setTimeout(() => {
        if (ultScreenFlash && !isUltimateMode) ultScreenFlash.style.opacity = '0';
      }, 250);
    }
    screenShake = 32;

    // Spawn dramatic cut line across the target
    const cutAngle = Math.atan2(dirY, dirX) + Math.PI / 2;
    const cutLen = (target.radius || 30) * 3.5;
    const slashStartX = target.x - Math.cos(cutAngle) * cutLen;
    const slashStartY = target.y - Math.sin(cutAngle) * cutLen;
    const slashEndX = target.x + Math.cos(cutAngle) * cutLen;
    const slashEndY = target.y + Math.sin(cutAngle) * cutLen;

    slashEffects.push(new SlashEffect(slashStartX, slashStartY, slashEndX, slashEndY, target.radius || 30));

    // Ghost trail from origin to behind enemy
    const ghostSteps = 12;
    for (let k = 0; k <= ghostSteps; k++) {
      const t = k / ghostSteps;
      afterimages.push(new Afterimage(
        startX + (destX - startX) * t,
        startY + (destY - startY) * t,
        player.angle,
        '#ef4444'
      ));
    }

    // Huge shockwaves
    shockwaves.push(new Shockwave(target.x, target.y, 180, '#ef4444', 12));
    shockwaves.push(new Shockwave(destX, destY, 130, '#ffd33d', 8));

    // Deal 100 Damage to target!
    floatingTexts.push(new FloatingText(target.x, target.y - 45, '⚔️ 一刀両断 100 DMG!', '#ff1744'));

    if (isClient) {
      if (target === targetBoss) {
        window.multiplayerManager.reportBulletHit('boss', null, 100);
      } else {
        target.hp -= 100;
        if (target.hp <= 0) {
          const isHeavy = target.type === 'large';
          const isShooter = target.type === 'shooter';
          const isChaser = target.type === 'chaser';
          const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#ffd33d'));
          createExplosion(target.x, target.y, expColor, true);
          const remIdx = targetEnemies.indexOf(target);
          if (remIdx !== -1) targetEnemies.splice(remIdx, 1);
          addScore(isHeavy ? 1000 : (isShooter ? 600 : (isChaser ? 700 : 500)));
          addWP(5);
          addUEP(5);
        }
        window.multiplayerManager.reportBulletHit('enemy', target.id, 100);
      }
    } else {
      if (target === boss) {
        damageBoss(100);
      } else {
        target.hp -= 100;
        if (target.hp <= 0) {
          const isHeavy = target.type === 'large';
          const isShooter = target.type === 'shooter';
          const isChaser = target.type === 'chaser';
          const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#ffd33d'));
          createExplosion(target.x, target.y, expColor, true);
          const idx = enemies.indexOf(target);
          if (idx !== -1) enemies.splice(idx, 1);
          addScore(isHeavy ? 1000 : (isShooter ? 600 : (isChaser ? 700 : 500)));
          addWP(5);
          addUEP(5);
        }
      }
    }

    // Massive cutting sparks and blood/energy particles
    for (let i = 0; i < 50; i++) {
      const pAng = Math.random() * Math.PI * 2;
      const spd = Math.random() * 12 + 3;
      particles.push(new Particle(
        target.x, target.y,
        Math.cos(pAng) * spd,
        Math.sin(pAng) * spd,
        Math.random() > 0.4 ? '#ef4444' : (Math.random() > 0.5 ? '#f59e0b' : '#ffffff'),
        Math.random() * 4.5 + 2,
        40
      ));
    }

    showToast('⚔️ 必殺技「一刀両断」発動！ 100ダメージ！');
    return;
  }

  // === NORMAL DASH ===
  // Check EP
  if (player.mp < player.skillCost) return;
  // Check Cooldown
  if (now - player.lastSkillTime < player.skillCooldown) return;

  // Consume EP
  player.mp = Math.max(0, player.mp - player.skillCost);
  player.lastSkillTime = now;
  player.isDashing = true;
  player.dashDuration = 18; // Invincible frames during dash
  player.invincibleTimer = Math.max(player.invincibleTimer, 30);

  let dx = mouse.x - player.x;
  let dy = mouse.y - player.y;
  let dist = Math.hypot(dx, dy);

  let dirX = Math.cos(player.angle);
  let dirY = Math.sin(player.angle);

  if (dist > 5) {
    dirX = dx / dist;
    dirY = dy / dist;
  }

  const dashDistance = Math.min(250, Math.max(120, dist));
  const startX = player.x;
  const startY = player.y;

  // Start shockwave
  shockwaves.push(new Shockwave(startX, startY, 95, '#58a6ff', 6));

  // Ghost trail
  const steps = 7;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const gx = startX + dirX * dashDistance * t;
    const gy = startY + dirY * dashDistance * t;
    afterimages.push(new Afterimage(gx, gy, player.angle, '#38bdf8'));
  }

  // Teleport player
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, player.x + dirX * dashDistance));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, player.y + dirY * dashDistance));

  player.vx = dirX * 12;
  player.vy = dirY * 12;

  // Destination shockwave & screen shake
  const wave = new Shockwave(player.x, player.y, 125, '#38bdf8', 9);
  shockwaves.push(wave);
  screenShake = 14;

  if (window.isMultiplayerMode && window.multiplayerManager) {
    window.multiplayerManager.sendSkillEvent({
      skill: 'blink',
      startX, startY,
      destX: player.x,
      destY: player.y
    });
  }

  // Destroy nearby enemies with shockwave!
  const isClientBlink = (typeof window !== 'undefined' && window.isMultiplayerMode && window.multiplayerManager && !window.multiplayerManager.isHost);
  if (isClientBlink) {
    const remoteEnemies = window.multiplayerManager.remoteGameObjects?.enemies || [];
    for (let i = remoteEnemies.length - 1; i >= 0; i--) {
      const e = remoteEnemies[i];
      if (!e || e.hp <= 0) continue;
      const dStart = Math.hypot(e.x - startX, e.y - startY);
      const dEnd = Math.hypot(e.x - player.x, e.y - player.y);
      if (dStart < 110 || dEnd < 130) {
        createExplosion(e.x, e.y, '#38bdf8');
        window.multiplayerManager.reportBulletHit('enemy', e.id, 5);
        remoteEnemies.splice(i, 1);
        addScore(150);
        addWP(1);
        addUEP(1);
      }
    }
  } else {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const e = enemies[i];
      const dStart = Math.hypot(e.x - startX, e.y - startY);
      const dEnd = Math.hypot(e.x - player.x, e.y - player.y);
      if (dStart < 110 || dEnd < 130) {
        createExplosion(e.x, e.y, '#38bdf8');
        enemies.splice(i, 1);
        addScore(150);
        addWP(1);
        addUEP(1);
      }
    }
  }

  // Burst Particles
  for (let i = 0; i < 35; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * 8 + 2;
    particles.push(new Particle(
      player.x,
      player.y,
      Math.cos(angle) * spd,
      Math.sin(angle) * spd,
      Math.random() > 0.4 ? '#38bdf8' : '#79c0ff',
      Math.random() * 4 + 2,
      Math.floor(Math.random() * 25 + 20)
    ));
  }
}

// Add WP (Weapon Points)
function addWP(amount = 1) {
  player.wp += amount;
  if (wpVal) wpVal.innerText = player.wp;
}

// Add UEP (Ultra Energy Points)
// Gained by defeating enemies. Every 10 points threshold increases max HP and EP by 1 and heals 1 HP and EP.
function addUEP(amount = 1) {
  const prevBonusTier = Math.floor(player.uep / 10);
  player.uep += amount;
  const newBonusTier = Math.floor(player.uep / 10);

  if (newBonusTier > prevBonusTier) {
    const bonusGained = newBonusTier - prevBonusTier;
    player.maxHp += bonusGained;
    player.hp = Math.min(player.maxHp, player.hp + bonusGained);
    player.maxMp += bonusGained;
    player.mp = Math.min(player.maxMp, player.mp + bonusGained);

    // Visual bonus notification & sparkle
    floatingTexts.push(new FloatingText(player.x, player.y - 45, `✨ UEP UP! HP & EP +${bonusGained}`, '#e879f9'));
    shockwaves.push(new Shockwave(player.x, player.y, 70, '#e879f9', 5));
    for (let k = 0; k < 15; k++) {
      const pAng = Math.random() * Math.PI * 2;
      const spd = Math.random() * 4 + 2;
      particles.push(new Particle(
        player.x, player.y,
        Math.cos(pAng) * spd,
        Math.sin(pAng) * spd,
        Math.random() > 0.5 ? '#e879f9' : '#c084fc',
        2.5,
        20
      ));
    }
  }

  if (uepVal) uepVal.innerText = player.uep;
}

// Trigger Skill 4: Summon Minion (Costs 20 WP + 50 EP)
function activateSummonSkill() {
  if (isUltimateMode) return;
  const now = performance.now();
  // Check WP and EP
  if (player.wp < player.summonWpCost || player.mp < player.summonMpCost) {
    let msg = '';
    if (player.wp < player.summonWpCost && player.mp < player.summonMpCost) {
      msg = 'WP & EP 不足！';
    } else if (player.wp < player.summonWpCost) {
      msg = 'WP 不足 (要20)！';
    } else {
      msg = 'EP 不足 (要50)！';
    }
    floatingTexts.push(new FloatingText(player.x, player.y - 25, msg, '#f85149'));
    return;
  }

  // Check Cooldown
  if (now - player.lastSummonTime < player.summonCooldown) return;

  // Consume WP and EP
  player.wp -= player.summonWpCost;
  player.mp -= player.summonMpCost;
  player.lastSummonTime = now;
  if (wpVal) wpVal.innerText = player.wp;

  // Spawn Minion slightly behind player
  const isPortrait = canvas.height > canvas.width;
  const spawnX = isPortrait ? player.x : player.x - 60;
  const spawnY = isPortrait ? player.y + 60 : player.y;

  const minion = new SummonMinion(spawnX, spawnY);
  summonMinions.push(minion);

  // Summon Effect & Shockwave
  shockwaves.push(new Shockwave(spawnX, spawnY, 90, '#c084fc', 6));
  for (let i = 0; i < 28; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * 6 + 2;
    particles.push(new Particle(
      spawnX, spawnY,
      Math.cos(angle) * spd,
      Math.sin(angle) * spd,
      Math.random() > 0.4 ? '#c084fc' : '#38bdf8',
      Math.random() * 3.5 + 2,
      25
    ));
  }
  floatingTexts.push(new FloatingText(spawnX, spawnY - 35, '✨ 味方召喚！', '#c084fc'));
}

// Guard Skill: Barrier Helper
function spawnGuardSparkles() {
  const angle = Math.random() * Math.PI * 2;
  const dist = player.guardRadius + (Math.random() * 8 - 4);
  particles.push(new Particle(
    player.x + Math.cos(angle) * dist,
    player.y + Math.sin(angle) * dist,
    Math.cos(angle) * (Math.random() * 2 + 1),
    Math.sin(angle) * (Math.random() * 2 + 1),
    Math.random() > 0.4 ? '#34d399' : (Math.random() > 0.5 ? '#6ee7b7' : '#a7f3d0'),
    Math.random() * 3 + 1.5,
    14
  ));
}

// Create Enemy Explosion
function createExplosion(x, y, mainColor = '#ff5555', isLarge = false) {
  const count = isLarge ? 44 : 22;
  const maxWave = isLarge ? 110 : 60;
  if (isLarge) screenShake = Math.max(screenShake, 16);

  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const spd = Math.random() * (isLarge ? 9 : 7) + 2;
    particles.push(new Particle(
      x,
      y,
      Math.cos(angle) * spd,
      Math.sin(angle) * spd,
      Math.random() > 0.5 ? mainColor : '#ffa657',
      Math.random() * (isLarge ? 5 : 3.5) + 2,
      Math.floor(Math.random() * 25 + 18)
    ));
  }
  shockwaves.push(new Shockwave(x, y, maxWave, mainColor, isLarge ? 7 : 4));
}

// Add Score
function addScore(pts) {
  if (gameMode === 'BOSS') return; // No score in boss mode
  score += pts;
  if (scoreVal) scoreVal.innerText = score;
}

// Damage Player (20 Damage per hit)
function takeDamage() {
  if (player.invincibleTimer > 0 || player.isDashing || player.isGuarding) return;
  if (player.isDown) return; // Already down

  player.hp = Math.max(0, player.hp - 20);
  player.invincibleTimer = 75; // ~1.25s of invincibility
  screenShake = 16;

  // Flash red
  damageFlash.style.opacity = '0.7';
  setTimeout(() => { damageFlash.style.opacity = '0'; }, 150);

  if (player.hp <= 0) {
    if (window.isMultiplayerMode && window.multiplayerManager) {
      // Multiplayer: enter DOWN state instead of game over
      player.isDown = true;
      player.hp     = 0;
      player.invincibleTimer = 99999; // Prevent further damage while down
      floatingTexts.push(new FloatingText(player.x, player.y - 30, '💀 DOWN...', '#f43f5e'));
      showToast('💀 やられた！ 味方に救助してもらおう...');
      window.multiplayerManager.broadcastDown();
      if (window.multiplayerManager.isHost) {
        window.multiplayerManager._checkAllDown();
      }
    } else {
      gameOver();
    }
  }
}

// Boss Damage & Defeat Handling
function damageBoss(amount) {
  if (!boss || boss.hp <= 0) return;

  // If Event Boss: Damage is divided by player count (damage ÷ 人数)
  if (boss.isEventBoss) {
    const pCount = (window.isMultiplayerMode && window.multiplayerManager) ? Math.max(1, window.multiplayerManager.playerCount || 1) : 1;
    const effectiveDamage = amount / pCount;
    boss.totalDamage = (boss.totalDamage || 0) + effectiveDamage;
    const prevEnrage = boss.enrageLevel || 1;
    boss.enrageLevel = 1 + Math.floor(boss.totalDamage / 15);

    if (boss.enrageLevel > prevEnrage) {
      floatingTexts.push(new FloatingText(boss.x, boss.y - boss.radius - 22, `⚡ ハム神 強化Lv.${boss.enrageLevel}！`, '#f59e0b'));
      screenShake = 16;
    }
    updateBossHUD();
    return;
  }

  boss.hp = Math.max(0, boss.hp - amount);
  updateBossHUD();

  if (boss.hp <= 0) {
    defeatBoss();
  }
}

function defeatBoss() {
  if (!boss) return;
  const bx = boss.x;
  const by = boss.y;
  screenShake = 30;

  // Massive explosion spectacle
  for (let i = 0; i < 6; i++) {
    setTimeout(() => {
      createExplosion(
        bx + (Math.random() - 0.5) * 70,
        by + (Math.random() - 0.5) * 70,
        i % 2 === 0 ? '#ff1744' : '#ffd33d',
        true
      );
    }, i * 140);
  }

  const isScoreMode = (gameMode === 'SCORE_ATTACK');
  const clearMsg = isScoreMode ? '👑 BOSS DEFEATED! (+3000 PTS)' : `👑 BOSS CLEAR! (${formatBattleTime(bossBattleElapsedTime)})`;
  floatingTexts.push(new FloatingText(bx, by - 50, clearMsg, '#ffd33d'));

  if (isScoreMode) {
    addScore(3000); // 3000 bonus points for defeating boss in Score Attack
  }
  addWP(10);
  addUEP(10);

  setTimeout(() => {
    boss = null;
    bossBullets.length = 0;
    if (bossHud) bossHud.style.display = 'none';

    // Clear remaining minions
    for (const e of enemies) {
      createExplosion(e.x, e.y, '#38bdf8');
    }
    enemies.length = 0;

    if (isScoreMode) {
      // Score Attack continues! Unlock Homing Chaser enemies & resume spawns
      scoreBossDefeated = true;
      lastEnemySpawnTime = performance.now();
      showToast('⚠️ 新たな強敵（追尾チェイサー）が出現し始めた！');
    } else {
      // Boss Mode -> Show victory screen
      if (window.isMultiplayerMode && window.multiplayerManager?.isHost) {
        window.multiplayerManager._broadcast({
          type: MP_MSG.GAME_OVER,
          reason: 'boss_clear',
          bossClearTime: bossBattleElapsedTime
        });
      }
      gameOver('VICTORY');
    }
  }, 1200);
}

function updateBossHUD() {
  if (!bossHud || !bossHpFill || !bossHpVal) return;
  const isClientMP = window.isMultiplayerMode && window.multiplayerManager && !window.multiplayerManager.isHost;
  const activeBoss = isClientMP ? window.multiplayerManager?.remoteGameObjects?.boss : boss;
  if (activeBoss && activeBoss.hp > 0) {
    bossHud.style.display = 'flex';
    const bossNameEl = bossHud.querySelector('.boss-hud-name');
    if (activeBoss.isEventBoss) {
      const enrage = activeBoss.enrageLevel || 1;
      const dmg = (activeBoss.totalDamage || 0).toFixed(1);
      if (bossNameEl) {
        bossNameEl.innerText = `🐹 イベントボス: ハム神 (狂暴化 Lv.${enrage})`;
      }
      // Progressive meter for next enrage step
      const progressToNext = ((activeBoss.totalDamage || 0) % 15) / 15 * 100;
      bossHpFill.style.width = `${Math.min(100, Math.max(5, progressToNext))}%`;
      bossHpFill.style.background = 'linear-gradient(90deg, #38bdf8, #f59e0b)';
      bossHpVal.innerText = `累計: ${dmg} DMG`;
    } else {
      if (bossNameEl) {
        bossNameEl.innerText = `👹 ボス (LV. ${bossLevel || 1})`;
      }
      const hpPct = Math.max(0, (activeBoss.hp / activeBoss.maxHp) * 100);
      bossHpFill.style.width = hpPct + '%';
      bossHpFill.style.background = 'linear-gradient(90deg, #cf222e, #f85149)';
      bossHpVal.innerText = `${Math.ceil(activeBoss.hp)}/${activeBoss.maxHp}`;
    }
  } else {
    bossHud.style.display = 'none';
  }
}

// Game Start, Over & Restart
function startGame(mode = 'SCORE_ATTACK') {
  gameMode = mode;
  gameState = 'PLAYING';
  score = 0;
  bossBattleElapsedTime = 0;
  if (scoreVal) {
    scoreVal.innerText = (gameMode === 'BOSS' || gameMode === 'EVENT_BOSS') ? '0.0s' : '0';
  }
  if (statLabel) {
    statLabel.innerText = (gameMode === 'BOSS' || gameMode === 'EVENT_BOSS') ? 'TIME' : 'SCORE';
  }
  player.isDown     = false;
  player.revivalProgress = 0;
  player.reviveCount = 0;
  player.maxHp      = 100;  // Reset to base
  player.hp         = 100;
  player.maxMp      = 100;  // Reset to base
  player.mp         = 100;
  player.wp         = 0;
  player.uep        = 0;
  if (wpVal) wpVal.innerText = '0';
  if (uepVal) uepVal.innerText = '0';
  player.x = canvas.width / 2;
  player.y = canvas.height * 0.75;
  player.vx = 0;
  player.vy = 0;
  player.invincibleTimer = 50;
  player.isGuarding = false;
  isGuardHolding = false;

  isUltimateMode = false;
  slowMoTimer = 0;
  timeScale = 1.0;
  slashEffects.length = 0;
  if (ultScreenFlash) ultScreenFlash.style.opacity = '0';

  boss = null;
  bossBullets.length = 0;
  bullets.length = 0;
  homingBullets.length = 0;
  summonMinions.length = 0;
  mpOrbs.length = 0;
  enemies.length = 0;
  particles.length = 0;
  shockwaves.length = 0;
  afterimages.length = 0;
  floatingTexts.length = 0;
  lastMpOrbSpawnTime = performance.now();
  scoreBossTriggered = false;
  scoreBossDefeated = false;
  timeScoreAccumulator = 0;

  if (startScreen) {
    startScreen.style.display = 'none';
  }
  if (guideOverlay) {
    guideOverlay.style.display = 'none';
  }
  if (gameOverScreen) {
    gameOverScreen.style.display = 'none';
  }

  lastEnemySpawnTime = performance.now();

  if (gameMode === 'BOSS' || gameMode === 'EVENT_BOSS') {
    // 3-second Boss Warning sequence
    bossWarningTimeRemaining = 3.0;
    if (bossWarningOverlay) {
      bossWarningOverlay.style.display = 'flex';
      const subTitle = bossWarningOverlay.querySelector('.warning-subtitle');
      if (subTitle) {
        subTitle.innerText = (gameMode === 'EVENT_BOSS') ? '🐹 イベントボス「ハム神」降臨' : '👹 ボス戦 開始';
      }
    }
    if (bossHud) bossHud.style.display = 'none';
  } else {
    if (bossWarningOverlay) bossWarningOverlay.style.display = 'none';
    if (bossHud) bossHud.style.display = 'none';
  }
}

function gameOver(type = 'DEFEAT') {
  gameState = 'GAMEOVER';
  player.isGuarding = false;
  isGuardHolding = false;
  if (finalStatLabel) {
    if (gameMode === 'EVENT_BOSS') {
      const isClientMP = window.isMultiplayerMode && window.multiplayerManager && !window.multiplayerManager.isHost;
      const b = isClientMP ? window.multiplayerManager?.remoteGameObjects?.boss : boss;
      const dmg = b ? (b.totalDamage || 0).toFixed(1) : '0';
      finalStatLabel.innerText = `SURVIVAL: ${formatBattleTime(bossBattleElapsedTime)} | DAMAGE`;
    } else {
      finalStatLabel.innerText = (gameMode === 'BOSS') ? 'CLEAR TIME' : 'SCORE';
    }
  }
  if (finalScoreVal) {
    if (gameMode === 'EVENT_BOSS') {
      const isClientMP = window.isMultiplayerMode && window.multiplayerManager && !window.multiplayerManager.isHost;
      const b = isClientMP ? window.multiplayerManager?.remoteGameObjects?.boss : boss;
      const dmg = b ? (b.totalDamage || 0).toFixed(1) : '0';
      finalScoreVal.innerText = `${dmg} DMG`;
    } else {
      finalScoreVal.innerText = (gameMode === 'BOSS') ? formatBattleTime(bossBattleElapsedTime) : score.toLocaleString();
    }
  }
  const titleEl = gameOverScreen.querySelector('.game-over-title');
  if (titleEl) {
    if (gameMode === 'EVENT_BOSS') {
      titleEl.innerText = 'BATTLE RESULT';
      titleEl.style.background = 'linear-gradient(135deg, #38bdf8, #f59e0b)';
      titleEl.style.webkitBackgroundClip = 'text';
      titleEl.style.webkitTextFillColor = 'transparent';
    } else if (type === 'VICTORY') {
      titleEl.innerText = 'VICTORY!';
      titleEl.style.background = 'linear-gradient(135deg, #ffd33d, #7ee787)';
      titleEl.style.webkitBackgroundClip = 'text';
      titleEl.style.webkitTextFillColor = 'transparent';
    } else {
      titleEl.innerText = 'GAME OVER';
      titleEl.style.background = 'linear-gradient(135deg, #ff7b72, #f85149)';
      titleEl.style.webkitBackgroundClip = 'text';
      titleEl.style.webkitTextFillColor = 'transparent';
    }
  }
  if (bossHud) bossHud.style.display = 'none';
  if (bossWarningOverlay) bossWarningOverlay.style.display = 'none';
  gameOverScreen.style.display = 'flex';
  if (type !== 'VICTORY') {
    createExplosion(player.x, player.y, '#58a6ff');
  }

  // Offer online leaderboard record submission
  if (gameMode === 'SCORE_ATTACK' && score > 0) {
    setTimeout(() => {
      checkAndPromptRecordRegistration('SCORE_ATTACK', score);
    }, 600);
  } else if (gameMode === 'BOSS' && type === 'VICTORY') {
    setTimeout(() => {
      checkAndPromptRecordRegistration('BOSS', bossBattleElapsedTime, bossLevel);
    }, 800);
  }
}

function restartGame() {
  if (recordModal) recordModal.style.display = 'none';
  if (leaderboardModal) leaderboardModal.style.display = 'none';
  startGame(gameMode);
  gameOverScreen.style.display = 'none';
}

// Time formatting helper (e.g. "01:23.4" or "12.3s")
function formatBattleTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = (seconds % 60).toFixed(1);
  const sStr = (seconds % 60) < 10 ? '0' + s : s;
  return m > 0 ? `${m}:${sStr}` : `${s}s`;
}

// Update HUD & Cooldown & Gauges
function updateHUD() {
  // Update Score or Time display depending on mode
  if (scoreVal && statLabel) {
    if (gameMode === 'BOSS') {
      statLabel.innerText = 'TIME';
      scoreVal.innerText = formatBattleTime(bossBattleElapsedTime);
    } else {
      statLabel.innerText = 'SCORE';
      scoreVal.innerText = score;
    }
  }

  // Update HP Gauge
  if (hpFill && hpVal) {
    const hpPct = Math.max(0, (player.hp / player.maxHp) * 100);
    hpFill.style.width = hpPct + '%';
    hpVal.innerText = Math.round(player.hp) + '/' + player.maxHp;
    if (player.hp <= 20) {
      hpFill.classList.add('danger');
    } else {
      hpFill.classList.remove('danger');
    }
  }

  // Update EP Gauge
  if (mpFill && mpVal) {
    const mpPct = Math.max(0, (player.mp / player.maxMp) * 100);
    mpFill.style.width = mpPct + '%';
    mpVal.innerText = Math.round(player.mp) + '/' + player.maxMp;
  }

  // Update WP Display
  if (wpVal) {
    wpVal.innerText = player.wp;
  }

  // Update UEP Display
  if (uepVal) {
    uepVal.innerText = player.uep;
  }

  const now = performance.now();

  // 1. Blink Skill Cooldown & HUD
  const hasMpSkill = player.mp >= player.skillCost;
  const elapsedSkill = now - player.lastSkillTime;
  const remainingSkill = Math.max(0, player.skillCooldown - elapsedSkill);
  const ratioSkill = remainingSkill / player.skillCooldown;

  if (remainingSkill > 0) {
    const secText = (remainingSkill / 1000).toFixed(1) + 's';

    if (cooldownOverlay && cooldownText && skillSlot) {
      cooldownOverlay.style.height = (ratioSkill * 100) + '%';
      cooldownText.style.display = 'block';
      cooldownText.innerText = secText;
      skillSlot.classList.add('on-cooldown');
      skillSlot.classList.remove('ready-pulse');
    }

    if (touchCooldownOverlay && touchCooldownText && touchSkillBtn) {
      touchCooldownOverlay.style.height = (ratioSkill * 100) + '%';
      touchCooldownText.style.display = 'block';
      touchCooldownText.innerText = secText;
      touchSkillBtn.classList.add('on-cooldown');
    }
  } else {
    if (cooldownOverlay && cooldownText && skillSlot) {
      cooldownOverlay.style.height = '0%';
      cooldownText.style.display = 'none';
      skillSlot.classList.remove('on-cooldown');
      if (hasMpSkill) {
        skillSlot.classList.add('ready-pulse');
      } else {
        skillSlot.classList.remove('ready-pulse');
      }
    }

    if (touchCooldownOverlay && touchCooldownText && touchSkillBtn) {
      touchCooldownOverlay.style.height = '0%';
      touchCooldownText.style.display = 'none';
      touchSkillBtn.classList.remove('on-cooldown');
    }
  }

  if (skillSlot) skillSlot.classList.toggle('no-mp', !hasMpSkill);
  if (touchSkillBtn) touchSkillBtn.classList.toggle('no-mp', !hasMpSkill);

  // 2. Guard Skill HUD & Active Pulse
  const hasMpGuard = player.mp >= 1.0;
  const isGuardingActive = player.isGuarding;

  if (bombCooldownOverlay && bombCooldownText && bombSlot) {
    bombCooldownOverlay.style.height = '0%';
    bombCooldownText.style.display = 'none';
    bombSlot.classList.remove('on-cooldown');
    bombSlot.classList.toggle('guard-active', isGuardingActive);
    bombSlot.classList.toggle('ready-pulse', hasMpGuard && !isGuardingActive);
    bombSlot.classList.toggle('no-mp', !hasMpGuard);
  }

  if (touchBombCooldownOverlay && touchBombCooldownText && touchBombBtn) {
    touchBombCooldownOverlay.style.height = '0%';
    touchBombCooldownText.style.display = 'none';
    touchBombBtn.classList.remove('on-cooldown');
    touchBombBtn.classList.toggle('guard-active', isGuardingActive);
    touchBombBtn.classList.toggle('no-mp', !hasMpGuard);
  }

  // 3. Homing Missile Skill Cooldown & HUD
  const hasMpHoming = player.mp >= player.homingCost;
  const elapsedHoming = now - player.lastHomingTime;
  const remainingHoming = Math.max(0, player.homingCooldown - elapsedHoming);
  const ratioHoming = remainingHoming / player.homingCooldown;

  if (remainingHoming > 0) {
    const homingSecText = (remainingHoming / 1000).toFixed(1) + 's';

    if (homingCooldownOverlay && homingCooldownText && homingSlot) {
      homingCooldownOverlay.style.height = (ratioHoming * 100) + '%';
      homingCooldownText.style.display = 'block';
      homingCooldownText.innerText = homingSecText;
      homingSlot.classList.add('on-cooldown');
      homingSlot.classList.remove('ready-pulse');
    }

    if (touchHomingCooldownOverlay && touchHomingCooldownText && touchHomingBtn) {
      touchHomingCooldownOverlay.style.height = (ratioHoming * 100) + '%';
      touchHomingCooldownText.style.display = 'block';
      touchHomingCooldownText.innerText = homingSecText;
      touchHomingBtn.classList.add('on-cooldown');
    }
  } else {
    if (homingCooldownOverlay && homingCooldownText && homingSlot) {
      homingCooldownOverlay.style.height = '0%';
      homingCooldownText.style.display = 'none';
      homingSlot.classList.remove('on-cooldown');
      if (hasMpHoming) {
        homingSlot.classList.add('ready-pulse');
      } else {
        homingSlot.classList.remove('ready-pulse');
      }
    }

    if (touchHomingCooldownOverlay && touchHomingCooldownText && touchHomingBtn) {
      touchHomingCooldownOverlay.style.height = '0%';
      touchHomingCooldownText.style.display = 'none';
      touchHomingBtn.classList.remove('on-cooldown');
    }
  }

  if (homingSlot) homingSlot.classList.toggle('no-mp', !hasMpHoming);
  if (touchHomingBtn) touchHomingBtn.classList.toggle('no-mp', !hasMpHoming);

  // 4. Summon Skill Cooldown & HUD (WP 10 + MP 50)
  const hasCostSummon = (player.wp >= player.summonWpCost) && (player.mp >= player.summonMpCost);
  const elapsedSummon = now - player.lastSummonTime;
  const remainingSummon = Math.max(0, player.summonCooldown - elapsedSummon);
  const ratioSummon = remainingSummon / player.summonCooldown;

  if (remainingSummon > 0) {
    const summonSecText = (remainingSummon / 1000).toFixed(1) + 's';

    if (summonCooldownOverlay && summonCooldownText && summonSlot) {
      summonCooldownOverlay.style.height = (ratioSummon * 100) + '%';
      summonCooldownText.style.display = 'block';
      summonCooldownText.innerText = summonSecText;
      summonSlot.classList.add('on-cooldown');
      summonSlot.classList.remove('ready-pulse');
    }

    if (touchSummonCooldownOverlay && touchSummonCooldownText && touchSummonBtn) {
      touchSummonCooldownOverlay.style.height = (ratioSummon * 100) + '%';
      touchSummonCooldownText.style.display = 'block';
      touchSummonCooldownText.innerText = summonSecText;
      touchSummonBtn.classList.add('on-cooldown');
    }
  } else {
    if (summonCooldownOverlay && summonCooldownText && summonSlot) {
      summonCooldownOverlay.style.height = '0%';
      summonCooldownText.style.display = 'none';
      summonSlot.classList.remove('on-cooldown');
      if (hasCostSummon) {
        summonSlot.classList.add('ready-pulse');
      } else {
        summonSlot.classList.remove('ready-pulse');
      }
    }

    if (touchSummonCooldownOverlay && touchSummonCooldownText && touchSummonBtn) {
      touchSummonCooldownOverlay.style.height = '0%';
      touchSummonCooldownText.style.display = 'none';
      touchSummonBtn.classList.remove('on-cooldown');
    }
  }

  if (summonSlot) {
    summonSlot.classList.toggle('no-cost', !hasCostSummon);
    summonSlot.classList.toggle('no-mp', !hasCostSummon);
  }
  if (touchSummonBtn) {
    touchSummonBtn.classList.toggle('no-cost', !hasCostSummon);
    touchSummonBtn.classList.toggle('no-mp', !hasCostSummon);
  }

  // 5. Ultimate Mode HUD & Visual States
  const canEnterUlt = (player.wp >= 100) && (player.mp >= 100);

  if (ultBtn) {
    ultBtn.classList.toggle('ready', canEnterUlt && !isUltimateMode);
    ultBtn.classList.toggle('active', isUltimateMode);
  }

  if (touchUltBtn) {
    touchUltBtn.classList.toggle('ready', canEnterUlt && !isUltimateMode);
    touchUltBtn.classList.toggle('active', isUltimateMode);
  }

  // When Ultimate Mode is Active:
  // - Dash slot (skillSlot & touchSkillBtn) wears intense glowing aura (.ult-dash-aura)
  // - All other slots (Homing, Guard, Summon) turn gray and are disabled (.ult-disabled-slot)
  if (isUltimateMode) {
    if (skillSlot) skillSlot.classList.add('ult-dash-aura');
    if (touchSkillBtn) touchSkillBtn.classList.add('ult-dash-aura');

    if (homingSlot) homingSlot.classList.add('ult-disabled-slot');
    if (touchHomingBtn) touchHomingBtn.classList.add('ult-disabled-slot');

    if (bombSlot) bombSlot.classList.add('ult-disabled-slot');
    if (touchBombBtn) touchBombBtn.classList.add('ult-disabled-slot');

    if (summonSlot) summonSlot.classList.add('ult-disabled-slot');
    if (touchSummonBtn) touchSummonBtn.classList.add('ult-disabled-slot');
  } else {
    if (skillSlot) skillSlot.classList.remove('ult-dash-aura');
    if (touchSkillBtn) touchSkillBtn.classList.remove('ult-dash-aura');

    if (homingSlot) homingSlot.classList.remove('ult-disabled-slot');
    if (touchHomingBtn) touchHomingBtn.classList.remove('ult-disabled-slot');

    if (bombSlot) bombSlot.classList.remove('ult-disabled-slot');
    if (touchBombBtn) touchBombBtn.classList.remove('ult-disabled-slot');

    if (summonSlot) summonSlot.classList.remove('ult-disabled-slot');
    if (touchSummonBtn) touchSummonBtn.classList.remove('ult-disabled-slot');
  }

  // Update Boss HUD (HP gauge & numerical display)
  updateBossHUD();
}

// Background Grid Drawing
function drawGrid(ctx) {
  const gridSize = 45;
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 139, 253, 0.07)';
  ctx.lineWidth = 1;

  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }
  ctx.restore();
}

// Aim Crosshair Indicator
function drawCrosshair(ctx) {
  ctx.save();
  ctx.strokeStyle = 'rgba(88, 166, 255, 0.45)';
  ctx.lineWidth = 1.5;

  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, 8, 0, Math.PI * 2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(mouse.x - 14, mouse.y);
  ctx.lineTo(mouse.x - 10, mouse.y);
  ctx.moveTo(mouse.x + 10, mouse.y);
  ctx.lineTo(mouse.x + 14, mouse.y);
  ctx.moveTo(mouse.x, mouse.y - 14);
  ctx.lineTo(mouse.x, mouse.y - 10);
  ctx.moveTo(mouse.x, mouse.y + 10);
  ctx.lineTo(mouse.x, mouse.y + 14);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(88, 166, 255, 0.12)';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(player.x, player.y);
  ctx.lineTo(mouse.x, mouse.y);
  ctx.stroke();

  ctx.restore();
}

// Main Game Loop
let lastFrameTime = performance.now();

function gameLoop(currentTime) {
  const isClientMP = window.isMultiplayerMode && window.multiplayerManager && !window.multiplayerManager.isHost;
  const dt = Math.min((currentTime - lastFrameTime) / 1000, 0.1);
  lastFrameTime = currentTime;

  // Handle Slow Motion countdown
  if (slowMoTimer > 0) {
    slowMoTimer -= dt;
    if (slowMoTimer <= 0) {
      slowMoTimer = 0;
      timeScale = 1.0;
    } else {
      timeScale = 0.15;
    }
  } else {
    timeScale = 1.0;
  }

  // Multiply simulation delta time by timeScale
  const simDt = dt * timeScale;

  if (gameState === 'PLAYING') {
    // Multiplayer revival processing
    if (window.isMultiplayerMode && window.multiplayerManager) {
      window.multiplayerManager.checkRevival(dt);
    }

    // EP Natural Regeneration (2 EP / sec) - only when alive
    if (!player.isDown) {
      player.mp = Math.min(player.maxMp, player.mp + player.mpRegenRate * simDt);
    }
    if (player.grazeEffectTimer > 0) player.grazeEffectTimer--;

    // 1. Player Movement Processing (only if not down)
    if (!player.isDown) {
      let moveX = 0;
      let moveY = 0;

      if (keys.w) moveY -= 1;
      if (keys.s) moveY += 1;
      if (keys.a) moveX -= 1;
      if (keys.d) moveX += 1;

      const keyLen = Math.hypot(moveX, moveY);
      if (keyLen > 0) {
        moveX /= keyLen;
        moveY /= keyLen;
      }

      if (Math.abs(touchMoveVec.x) > 0.05 || Math.abs(touchMoveVec.y) > 0.05) {
        moveX += touchMoveVec.x;
        moveY += touchMoveVec.y;
      }

      const totalMoveLen = Math.hypot(moveX, moveY);
      if (totalMoveLen > 0) {
        const clampedPower = Math.min(1.0, totalMoveLen);
        const normalizedDirX = moveX / totalMoveLen;
        const normalizedDirY = moveY / totalMoveLen;

        player.vx += normalizedDirX * player.speed * 0.35 * clampedPower;
        player.vy += normalizedDirY * player.speed * 0.35 * clampedPower;

        if (Math.random() < 0.4) {
          particles.push(new Particle(
            player.x - Math.cos(player.angle) * 12 + (Math.random() - 0.5) * 6,
            player.y - Math.sin(player.angle) * 12 + (Math.random() - 0.5) * 6,
            -normalizedDirX * 1.5 + (Math.random() - 0.5),
            -normalizedDirY * 1.5 + (Math.random() - 0.5),
            '#238636',
            Math.random() * 3 + 1,
            18
          ));
        }
      }
    } else {
      player.vx = 0;
      player.vy = 0;
    }

    // Player Physics Update
    player.vx *= player.friction;
    player.vy *= player.friction;
    player.x += player.vx;
    player.y += player.vy;

    // Boundaries
    if (player.x < player.radius) { player.x = player.radius; player.vx = 0; }
    if (player.x > canvas.width - player.radius) { player.x = canvas.width - player.radius; player.vx = 0; }
    if (player.y < player.radius) { player.y = player.radius; player.vy = 0; }
    if (player.y > canvas.height - player.radius) { player.y = canvas.height - player.radius; player.vy = 0; }

    // Aim Angle
    if (!player.isDown) {
      player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);
    }

    // Shooting Action (only if not down)
    if (!player.isDown) {
      if (isShooting) {
        fireBullet();
      }
      if (isHomingShooting) {
        fireHomingBullet();
      }
    }

    // Invincibility & Dash Timer Countdown
    if (player.invincibleTimer > 0 && !player.isDown) player.invincibleTimer--;
    if (player.dashDuration > 0) {
      player.dashDuration--;
      if (player.dashDuration <= 0) player.isDashing = false;
    }

    // Guard Skill Processing (Consumes 10 EP per second while held; provides complete barrier invincibility)
    if (isGuardHolding && player.mp > 0) {
      player.isGuarding = true;
      player.mp = Math.max(0, player.mp - player.guardDrainRate * dt);
      if (player.mp <= 0) {
        player.isGuarding = false;
        isGuardHolding = false;
        floatingTexts.push(new FloatingText(player.x, player.y - 25, 'EP EMPTY', '#f85149'));
      } else {
        if (Math.random() < 0.65) {
          spawnGuardSparkles();
        }
      }
    } else {
      player.isGuarding = false;
    }

    // Time-based Score Increment (In SCORE_ATTACK, +1 score per 0.1s; paused during Boss battle & warning)
    const currentBossObj = isClientMP ? (window.multiplayerManager?.remoteGameObjects?.boss) : boss;
    const isBossActive = (currentBossObj && currentBossObj.hp > 0) || bossWarningTimeRemaining > 0;
    if (gameMode === 'SCORE_ATTACK' && !isBossActive) {
      timeScoreAccumulator += dt;
      while (timeScoreAccumulator >= 0.1) {
        timeScoreAccumulator -= 0.1;
        addScore(1);
      }
    }

    // Trigger Boss Encounter in SCORE_ATTACK when score >= 10,000
    if (gameMode === 'SCORE_ATTACK' && score >= 10000 && !scoreBossTriggered) {
      scoreBossTriggered = true;
      bossWarningTimeRemaining = 3.0;
      if (bossWarningOverlay) bossWarningOverlay.style.display = 'flex';
      if (bossHud) bossHud.style.display = 'none';

      // Clear currently roaming normal enemies with explosion
      for (const e of enemies) {
        createExplosion(e.x, e.y, '#38bdf8');
      }
      enemies.length = 0;
      showToast('⚠️ スコア10,000到達！ ボス接近！');
    }

    // Handle Boss 3-Second Warning Sequence & Battle Timer (Both BOSS mode & SCORE_ATTACK 10k event)
    if (bossWarningTimeRemaining > 0) {
      bossWarningTimeRemaining -= dt;
      if (bossWarningTimer) {
        bossWarningTimer.innerText = Math.max(0, bossWarningTimeRemaining).toFixed(1) + 's';
      }

      if (bossWarningTimeRemaining <= 0) {
        bossWarningTimeRemaining = 0;
        if (bossWarningOverlay) bossWarningOverlay.style.display = 'none';
        // Spawn Boss or Event Boss! (In multiplayer client, boss is received from host via GAME_STATE)
        if (!isClientMP) {
          if (gameMode === 'EVENT_BOSS') {
            boss = new EventBossHamGod();
            updateBossHUD();
            screenShake = 24;
            floatingTexts.push(new FloatingText(boss.x, boss.y - 40, '🐹 ハム神 降臨！', '#38bdf8'));
          } else {
            boss = new Boss();
            updateBossHUD();
            screenShake = 22;
            floatingTexts.push(new FloatingText(boss.x, boss.y - 40, '👹 BOSS INCOMING!', '#ff1744'));
          }
        }
      }
    } else if (currentBossObj && currentBossObj.hp > 0) {
      bossBattleElapsedTime += dt;
    }

    // 2. Enemy Spawning Logic
    // In Score Attack mode, spawn continuously BUT stop spawning while Boss or Warning is active!
    // In Multiplayer, only the Host spawns enemies.
    if (!isClientMP && gameMode === 'SCORE_ATTACK' && !isBossActive) {
      const spawnRate = Math.max(650, 1500 - score * 0.6);
      if (currentTime - lastEnemySpawnTime > spawnRate) {
        spawnEnemy();
        lastEnemySpawnTime = currentTime;
      }
    }

    // 2a-2. Blue MP Recovery Orb Spawner in Boss Mode & Boss Battles (Costs 0, restores +30 MP)
    // In Multiplayer, only host spawns MP orbs
    if (!isClientMP && boss && boss.hp > 0) {
      if (currentTime - lastMpOrbSpawnTime > mpOrbSpawnInterval) {
        spawnMpOrb();
        lastMpOrbSpawnTime = currentTime;
      }
    }

    // 2a-3. Blue MP Recovery Orbs Update & Player Collection
    for (let i = mpOrbs.length - 1; i >= 0; i--) {
      const orb = mpOrbs[i];
      orb.update();

      // Bounds & expiry check
      if (orb.life <= 0 || orb.x < -60 || orb.x > canvas.width + 60 || orb.y < -60 || orb.y > canvas.height + 60) {
        mpOrbs.splice(i, 1);
        continue;
      }

      // Check collision with player
      const distToPlayer = Math.hypot(player.x - orb.x, player.y - orb.y);
      if (distToPlayer < player.radius + orb.radius + 6) {
        mpOrbs.splice(i, 1);
        // Recover 30 EP!
        player.mp = Math.min(player.maxMp, player.mp + 30);
        floatingTexts.push(new FloatingText(player.x, player.y - 36, '+30 EP', '#38bdf8'));

        // Beautiful blue energy shockwave & sparkles
        shockwaves.push(new Shockwave(player.x, player.y, 80, '#38bdf8', 6));
        for (let k = 0; k < 20; k++) {
          const pAng = Math.random() * Math.PI * 2;
          const spd = Math.random() * 6 + 2;
          particles.push(new Particle(
            player.x, player.y,
            Math.cos(pAng) * spd,
            Math.sin(pAng) * spd,
            Math.random() > 0.4 ? '#38bdf8' : '#93c5fd',
            Math.random() * 3 + 2,
            Math.floor(Math.random() * 20 + 15)
          ));
        }
      }
    }

    // 2b. Boss Update
    if (!isClientMP && boss && boss.hp > 0) {
      boss.update(currentTime);
    }

    // 2c. Boss Bullets Update & Player Collision
    for (let i = bossBullets.length - 1; i >= 0; i--) {
      const bb = bossBullets[i];
      bb.update();

      // Check bounds
      if (bb.life <= 0 || bb.x < -30 || bb.x > canvas.width + 30 || bb.y < -30 || bb.y > canvas.height + 30) {
        bossBullets.splice(i, 1);
        continue;
      }

      const distToPlayer = Math.hypot(player.x - bb.x, player.y - bb.y);

      // Graze boss bullet (gives EP +8)
      if (!bb.hasGrazed && distToPlayer < (player.grazeRadius + bb.radius) && distToPlayer >= (player.radius + bb.radius)) {
        bb.hasGrazed = true;
        player.mp = Math.min(player.maxMp, player.mp + 8);
        player.grazeEffectTimer = 16;
        addScore(50);
        floatingTexts.push(new FloatingText(player.x, player.y - 28, '+8 EP', '#58a6ff'));

        for (let k = 0; k < 5; k++) {
          const sparkAngle = Math.random() * Math.PI * 2;
          particles.push(new Particle(
            player.x + (bb.x - player.x) * 0.5,
            player.y + (bb.y - player.y) * 0.5,
            Math.cos(sparkAngle) * 3,
            Math.sin(sparkAngle) * 3,
            '#ff7b72',
            2.5,
            12
          ));
        }
      }

      // Hit summonMinions (Ally takes 20 damage, blocks enemy bullet)
      let blockedByMinion = false;
      for (let m = summonMinions.length - 1; m >= 0; m--) {
        const minion = summonMinions[m];
        if (Math.hypot(minion.x - bb.x, minion.y - bb.y) < minion.radius + bb.radius) {
          bossBullets.splice(i, 1);
          createExplosion(bb.x, bb.y, '#c084fc');
          minion.takeDamage(20);
          if (minion.hp <= 0) {
            createExplosion(minion.x, minion.y, '#c084fc', true);
            floatingTexts.push(new FloatingText(minion.x, minion.y - 25, '🤖 味方大破！', '#f85149'));
            summonMinions.splice(m, 1);
          }
          blockedByMinion = true;
          break;
        }
      }
      if (blockedByMinion) continue;

      // Hit player (takes damage or blocked by barrier/dash)
      if (distToPlayer < (player.isGuarding ? player.guardRadius : player.radius) + bb.radius) {
        bossBullets.splice(i, 1);
        if (player.isGuarding) {
          // Blocked by barrier!
          createExplosion(bb.x, bb.y, '#34d399');
          for (let k = 0; k < 6; k++) {
            const spkAng = Math.random() * Math.PI * 2;
            particles.push(new Particle(
              bb.x, bb.y,
              Math.cos(spkAng) * 4,
              Math.sin(spkAng) * 4,
              '#6ee7b7',
              2.5, 12
            ));
          }
        } else {
          createExplosion(bb.x, bb.y, '#ff1744');
          if (!player.isDashing) {
            takeDamage();
          }
        }
      }
    }

    // 3. Bullets Update
    for (let i = bullets.length - 1; i >= 0; i--) {
      const b = bullets[i];
      b.update();
      if (b.life <= 0 || b.x < -20 || b.x > canvas.width + 20 || b.y < -20 || b.y > canvas.height + 20) {
        bullets.splice(i, 1);
        continue;
      }

      // Check collision with Boss
      const currentBoss = isClientMP ? (window.multiplayerManager?.remoteGameObjects?.boss) : boss;
      if (currentBoss && currentBoss.hp > 0) {
        const distToBoss = Math.hypot(b.x - currentBoss.x, b.y - currentBoss.y);
        if (distToBoss < b.radius + currentBoss.radius) {
          bullets.splice(i, 1);
          if (isClientMP) {
            window.multiplayerManager.reportBulletHit('boss', null, 1);
          } else {
            damageBoss(1);
            addScore(20);
          }

          // Impact sparks
          for (let k = 0; k < 5; k++) {
            particles.push(new Particle(
              b.x, b.y,
              (Math.random() - 0.5) * 5,
              (Math.random() - 0.5) * 5,
              '#ffe066',
              2.5, 10
            ));
          }
          continue;
        }
      }
    }

    // 3b. Homing Bullets Update & Boss Collision
    for (let i = homingBullets.length - 1; i >= 0; i--) {
      const hb = homingBullets[i];
      hb.update();
      if (hb.life <= 0 || hb.x < -30 || hb.x > canvas.width + 30 || hb.y < -30 || hb.y > canvas.height + 30) {
        homingBullets.splice(i, 1);
        continue;
      }

      // Collision with Boss
      const currentBoss = isClientMP ? (window.multiplayerManager?.remoteGameObjects?.boss) : boss;
      if (currentBoss && currentBoss.hp > 0) {
        const distToBoss = Math.hypot(hb.x - currentBoss.x, hb.y - currentBoss.y);
        if (distToBoss < hb.radius + currentBoss.radius) {
          homingBullets.splice(i, 1);
          if (isClientMP) {
            window.multiplayerManager.reportBulletHit('boss', null, hb.damage);
          } else {
            damageBoss(hb.damage);
            addScore(30);
          }

          // Homing impact sparks & mini shockwave
          shockwaves.push(new Shockwave(hb.x, hb.y, 25, '#38bdf8', 3));
          for (let k = 0; k < 7; k++) {
            const spkAng = Math.random() * Math.PI * 2;
            particles.push(new Particle(
              hb.x, hb.y,
              Math.cos(spkAng) * 5,
              Math.sin(spkAng) * 5,
              '#38bdf8',
              2.5, 12
            ));
          }
          continue;
        }
      }
    }

    // 4. Enemies Update & Collision Checks
    if (isClientMP && window.multiplayerManager) {
      // Advance Remote Boss & Bullets
      if (window.multiplayerManager.remoteGameObjects.boss) {
        const rb = window.multiplayerManager.remoteGameObjects.boss;
        rb.update(timeScale);
        if (rb instanceof RemoteEventBoss && rb.laserActive) {
          // Client check laser collision
          const cosL = Math.cos(rb.laserAngle);
          const sinL = Math.sin(rb.laserAngle);
          const px = player.x - rb.x;
          const py = player.y - rb.y;
          const proj = px * cosL + py * sinL;
          if (proj > 0 && proj < rb.laserLength) {
            const perpDist = Math.abs(px * (-sinL) + py * cosL);
            const hitRadius = (player.isGuarding ? player.guardRadius : player.radius) + rb.laserWidth * 0.45;
            if (perpDist < hitRadius && (!rb.lastClientLaserHit || currentTime - rb.lastClientLaserHit >= 280)) {
              rb.lastClientLaserHit = currentTime;
              if (player.isGuarding) {
                spawnGuardSparkles();
                floatingTexts.push(new FloatingText(player.x, player.y - 30, '🛡️ BLOCKED!', '#34d399'));
              } else if (!player.isDashing) {
                takeDamage();
                createExplosion(player.x, player.y, '#38bdf8');
                floatingTexts.push(new FloatingText(player.x, player.y - 35, '⚡ LASER HIT!', '#f43f5e'));
              }
            }
          }
        }
      }
      for (const rbb of (window.multiplayerManager.remoteGameObjects.bossBullets || [])) {
        rbb.update(timeScale);
      }

      // Client in MP: advance remote enemies and test collisions
      const remoteEnemies = window.multiplayerManager.remoteGameObjects.enemies || [];
      for (let i = remoteEnemies.length - 1; i >= 0; i--) {
        const re = remoteEnemies[i];
        if (!re || re.hp <= 0) continue;
        re.update(timeScale);

        let enemyDestroyed = false;
        // Collision: Bullets vs Remote Enemy
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          if (Math.hypot(b.x - re.x, b.y - re.y) < b.radius + re.radius) {
            bullets.splice(j, 1);
            re.hp--;

            // Hit spark
            for (let k = 0; k < 4; k++) {
              particles.push(new Particle(
                b.x, b.y,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                '#ffe066',
                2, 10
              ));
            }

            window.multiplayerManager.reportBulletHit('enemy', re.id, 1);

            if (re.hp <= 0) {
              const isHeavy = re.type === 'large';
              const isShooter = re.type === 'shooter';
              const isChaser = re.type === 'chaser';
              const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#ff5555'));
              createExplosion(re.x, re.y, expColor, isHeavy);
              remoteEnemies.splice(i, 1);
              addWP(isHeavy ? 3 : 1);
              addUEP(isHeavy ? 3 : 1);
              enemyDestroyed = true;
              break;
            }
          }
        }

        if (enemyDestroyed) continue;

        // Collision: Homing Bullets vs Remote Enemy
        for (let j = homingBullets.length - 1; j >= 0; j--) {
          const hb = homingBullets[j];
          if (Math.hypot(hb.x - re.x, hb.y - re.y) < hb.radius + re.radius) {
            homingBullets.splice(j, 1);
            re.hp -= hb.damage;

            // Hit spark & shockwave
            shockwaves.push(new Shockwave(hb.x, hb.y, 22, '#38bdf8', 3));
            for (let k = 0; k < 6; k++) {
              const spkAng = Math.random() * Math.PI * 2;
              particles.push(new Particle(
                hb.x, hb.y,
                Math.cos(spkAng) * 4.5,
                Math.sin(spkAng) * 4.5,
                '#38bdf8',
                2.5, 10
              ));
            }

            window.multiplayerManager.reportBulletHit('enemy', re.id, hb.damage);

            if (re.hp <= 0) {
              const isHeavy = re.type === 'large';
              const isShooter = re.type === 'shooter';
              const isChaser = re.type === 'chaser';
              const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#38bdf8'));
              createExplosion(re.x, re.y, expColor, isHeavy);
              remoteEnemies.splice(i, 1);
              addWP(isHeavy ? 3 : 1);
              addUEP(isHeavy ? 3 : 1);
              enemyDestroyed = true;
              break;
            }
          }
        }

        if (enemyDestroyed) continue;

        // Graze check with remote enemy
        const distToPlayer = Math.hypot(player.x - re.x, player.y - re.y);
        if (!re.hasGrazed && distToPlayer < (player.grazeRadius + re.radius) && distToPlayer >= (player.radius + re.radius)) {
          re.hasGrazed = true;
          player.mp = Math.min(player.maxMp, player.mp + 10);
          player.grazeEffectTimer = 16;
          floatingTexts.push(new FloatingText(player.x, player.y - 28, '+10 EP', '#58a6ff'));
          for (let k = 0; k < 6; k++) {
            const sparkAngle = Math.random() * Math.PI * 2;
            particles.push(new Particle(
              player.x + (re.x - player.x) * 0.5,
              player.y + (re.y - player.y) * 0.5,
              Math.cos(sparkAngle) * 3,
              Math.sin(sparkAngle) * 3,
              '#79c0ff',
              2.5, 14
            ));
          }
        }

        // summonMinions vs Remote Enemy
        for (let m = summonMinions.length - 1; m >= 0; m--) {
          const minion = summonMinions[m];
          if (Math.hypot(minion.x - re.x, minion.y - re.y) < minion.radius + re.radius) {
            minion.takeDamage(20);
            re.hp -= 2;
            window.multiplayerManager.reportBulletHit('enemy', re.id, 2);
            if (minion.hp <= 0) {
              createExplosion(minion.x, minion.y, '#c084fc', true);
              floatingTexts.push(new FloatingText(minion.x, minion.y - 25, '🤖 味方大破！', '#f85149'));
              summonMinions.splice(m, 1);
            }
            if (re.hp <= 0) {
              const isHeavy = re.type === 'large';
              const isShooter = re.type === 'shooter';
              const isChaser = re.type === 'chaser';
              const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#c084fc'));
              createExplosion(re.x, re.y, expColor, isHeavy);
              remoteEnemies.splice(i, 1);
              addWP(isHeavy ? 3 : 1);
              addUEP(isHeavy ? 3 : 1);
              enemyDestroyed = true;
              break;
            }
          }
        }

        if (enemyDestroyed) continue;

        // Player vs Remote Enemy Body Collision
        if (distToPlayer < player.radius + re.radius) {
          const isHeavy = re.type === 'large';
          const isShooter = re.type === 'shooter';
          const isChaser = re.type === 'chaser';
          if (player.isDashing) {
            const expColor = isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#38bdf8');
            createExplosion(re.x, re.y, expColor, isHeavy);
            window.multiplayerManager.reportBulletHit('enemy', re.id, 5);
            remoteEnemies.splice(i, 1);
            addWP(isHeavy ? 3 : 1);
            addUEP(isHeavy ? 3 : 1);
          } else if (player.isGuarding) {
            re.hp -= 1;
            window.multiplayerManager.reportBulletHit('enemy', re.id, 1);
            if (re.hp <= 0) {
              const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#34d399'));
              createExplosion(re.x, re.y, expColor, isHeavy);
              remoteEnemies.splice(i, 1);
              addWP(isHeavy ? 3 : 1);
              addUEP(isHeavy ? 3 : 1);
            }
          } else {
            const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#ff5555'));
            createExplosion(re.x, re.y, expColor, isHeavy);
            remoteEnemies.splice(i, 1);
            addWP(isHeavy ? 3 : 1);
            addUEP(isHeavy ? 3 : 1);
            takeDamage();
          }
        }
      }
    } else {
      // Local / Host Enemy update and collisions
      for (let i = enemies.length - 1; i >= 0; i--) {
        const e = enemies[i];
        e.update();

        // Check if enemy left the screen
        const margin = Math.max(50, e.radius + 20);
        if (e.isPortrait) {
          if (e.y > canvas.height + margin) {
            enemies.splice(i, 1);
            continue;
          }
        } else {
          if (e.x < -margin) {
            enemies.splice(i, 1);
            continue;
          }
        }

        // Collision: Bullets vs Enemy
        let enemyDestroyed = false;
        for (let j = bullets.length - 1; j >= 0; j--) {
          const b = bullets[j];
          if (Math.hypot(b.x - e.x, b.y - e.y) < b.radius + e.radius) {
            bullets.splice(j, 1);
            e.hp--;

            // Hit spark
            for (let k = 0; k < 4; k++) {
              particles.push(new Particle(
                b.x, b.y,
                (Math.random() - 0.5) * 4,
                (Math.random() - 0.5) * 4,
                '#ffe066',
                2, 10
              ));
            }

            if (e.hp <= 0) {
              const isHeavy = e.type === 'large';
              const isShooter = e.type === 'shooter';
              const isChaser = e.type === 'chaser';
              const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#ff5555'));
              createExplosion(e.x, e.y, expColor, isHeavy);
              enemies.splice(i, 1);
              addScore(isHeavy ? 300 : (isShooter ? 150 : (isChaser ? 200 : 100)));
              addWP(isHeavy ? 3 : 1);
              addUEP(isHeavy ? 3 : 1);
              enemyDestroyed = true;
              break;
            }
          }
        }

        if (enemyDestroyed) continue;

        // Collision: Homing Bullets vs Enemy
        for (let j = homingBullets.length - 1; j >= 0; j--) {
          const hb = homingBullets[j];
          if (Math.hypot(hb.x - e.x, hb.y - e.y) < hb.radius + e.radius) {
            homingBullets.splice(j, 1);
            e.hp -= hb.damage;

            // Hit spark & shockwave
            shockwaves.push(new Shockwave(hb.x, hb.y, 22, '#38bdf8', 3));
            for (let k = 0; k < 6; k++) {
              const spkAng = Math.random() * Math.PI * 2;
              particles.push(new Particle(
                hb.x, hb.y,
                Math.cos(spkAng) * 4.5,
                Math.sin(spkAng) * 4.5,
                '#38bdf8',
                2.5, 10
              ));
            }

            if (e.hp <= 0) {
              const isHeavy = e.type === 'large';
              const isShooter = e.type === 'shooter';
              const isChaser = e.type === 'chaser';
              const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#38bdf8'));
              createExplosion(e.x, e.y, expColor, isHeavy);
              enemies.splice(i, 1);
              addScore(isHeavy ? 300 : (isShooter ? 150 : (isChaser ? 200 : 100)));
              addWP(isHeavy ? 3 : 1);
              addUEP(isHeavy ? 3 : 1);
              enemyDestroyed = true;
              break;
            }
          }
        }

        if (enemyDestroyed) continue;

        // Collision: Player vs Enemy & Graze Check
        const distToPlayer = Math.hypot(player.x - e.x, player.y - e.y);

        // Graze Detection (inside enlarged graze radius, but not body collision)
        if (!e.hasGrazed && distToPlayer < (player.grazeRadius + e.radius) && distToPlayer >= (player.radius + e.radius)) {
          e.hasGrazed = true;
          player.mp = Math.min(player.maxMp, player.mp + 10);
          player.grazeEffectTimer = 16;
          addScore(30);
          floatingTexts.push(new FloatingText(player.x, player.y - 28, '+10 EP', '#58a6ff'));

          // Graze Sparks
          for (let k = 0; k < 6; k++) {
            const sparkAngle = Math.random() * Math.PI * 2;
            particles.push(new Particle(
              player.x + (e.x - player.x) * 0.5,
              player.y + (e.y - player.y) * 0.5,
              Math.cos(sparkAngle) * 3,
              Math.sin(sparkAngle) * 3,
              '#79c0ff',
              2.5,
              14
            ));
          }
        }

        // Collision: summonMinions vs Enemy (Ally takes 20 dmg, enemy takes dmg/knockback)
        for (let m = summonMinions.length - 1; m >= 0; m--) {
          const minion = summonMinions[m];
          if (Math.hypot(minion.x - e.x, minion.y - e.y) < minion.radius + e.radius) {
            minion.takeDamage(20);
            e.hp -= 2;
            const pushAngle = Math.atan2(e.y - minion.y, e.x - minion.x);
            e.x += Math.cos(pushAngle) * 12;
            e.y += Math.sin(pushAngle) * 12;

            if (minion.hp <= 0) {
              createExplosion(minion.x, minion.y, '#c084fc', true);
              floatingTexts.push(new FloatingText(minion.x, minion.y - 25, '🤖 味方大破！', '#f85149'));
              summonMinions.splice(m, 1);
            }

            if (e.hp <= 0) {
              const isHeavy = e.type === 'large';
              const isShooter = e.type === 'shooter';
              const isChaser = e.type === 'chaser';
              const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#c084fc'));
              createExplosion(e.x, e.y, expColor, isHeavy);
              enemies.splice(i, 1);
              addScore(isHeavy ? 300 : (isShooter ? 150 : (isChaser ? 200 : 100)));
              addWP(isHeavy ? 3 : 1);
              addUEP(isHeavy ? 3 : 1);
              enemyDestroyed = true;
              break;
            }
          }
        }

        if (enemyDestroyed) continue;

        // Body Collision: Player vs Enemy
        if (distToPlayer < player.radius + e.radius) {
          const isHeavy = e.type === 'large';
          const isShooter = e.type === 'shooter';
          const isChaser = e.type === 'chaser';
          if (player.isDashing) {
            // Dash destroys enemy!
            const expColor = isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#38bdf8');
            createExplosion(e.x, e.y, expColor, isHeavy);
            enemies.splice(i, 1);
            addScore(isHeavy ? 350 : (isShooter ? 200 : (isChaser ? 250 : 150)));
            addWP(isHeavy ? 3 : 1);
            addUEP(isHeavy ? 3 : 1);
          } else if (player.isGuarding) {
            // Barrier knocks back / damages enemy and blocks all damage to player!
            e.hp -= 1;
            const pushAngle = Math.atan2(e.y - player.y, e.x - player.x);
            e.x += Math.cos(pushAngle) * 8;
            e.y += Math.sin(pushAngle) * 8;
            for (let k = 0; k < 5; k++) {
              particles.push(new Particle(
                (player.x + e.x) / 2, (player.y + e.y) / 2,
                Math.cos(pushAngle) * 3 + (Math.random() - 0.5) * 2,
                Math.sin(pushAngle) * 3 + (Math.random() - 0.5) * 2,
                '#34d399', 2.5, 10
              ));
            }
            if (e.hp <= 0) {
              const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#34d399'));
              createExplosion(e.x, e.y, expColor, isHeavy);
              enemies.splice(i, 1);
              addScore(isHeavy ? 300 : (isShooter ? 150 : (isChaser ? 200 : 100)));
              addWP(isHeavy ? 3 : 1);
              addUEP(isHeavy ? 3 : 1);
            }
          } else {
            // Take Damage (20 HP loss)
            const expColor = isHeavy ? '#ff2a6d' : (isShooter ? '#a855f7' : (isChaser ? '#f59e0b' : '#ff5555'));
            createExplosion(e.x, e.y, expColor, isHeavy);
            enemies.splice(i, 1);
            addWP(isHeavy ? 3 : 1);
            addUEP(isHeavy ? 3 : 1);
            takeDamage();
          }
        }
      }
    }

    // Body Collision: Player vs Boss
    const activeBoss = isClientMP ? (window.multiplayerManager?.remoteGameObjects?.boss) : boss;
    if (activeBoss && activeBoss.hp > 0) {
      const distToBoss = Math.hypot(player.x - activeBoss.x, player.y - activeBoss.y);
      // Graze Boss
      if (!activeBoss.hasGrazed && distToBoss < (player.grazeRadius + activeBoss.radius) && distToBoss >= (player.radius + activeBoss.radius)) {
        activeBoss.hasGrazed = true;
        setTimeout(() => { if (activeBoss) activeBoss.hasGrazed = false; }, 800);
        player.mp = Math.min(player.maxMp, player.mp + 15);
        player.grazeEffectTimer = 16;
        addScore(100);
        floatingTexts.push(new FloatingText(player.x, player.y - 32, '+15 EP', '#ffd33d'));
      }

      // Touch Boss body
      if (distToBoss < player.radius + activeBoss.radius) {
        if (player.isDashing) {
          if (isClientMP) {
            window.multiplayerManager.reportBulletHit('boss', null, 2);
          } else {
            damageBoss(2);
          }
          floatingTexts.push(new FloatingText(activeBoss.x, activeBoss.y - 45, '-2 HP', '#38bdf8'));
        } else if (player.isGuarding) {
          // Barrier blocks boss contact damage!
          if (Math.random() < 0.25) {
            spawnGuardSparkles();
          }
        } else {
          takeDamage();
        }
      }
    }

    // Update SummonMinions (Ally Shooters)
    for (let i = summonMinions.length - 1; i >= 0; i--) {
      const minion = summonMinions[i];
      minion.update();
      if (minion.hp <= 0) {
        summonMinions.splice(i, 1);
      }
    }
  }

  // Screen Shake Decay
  if (screenShake > 0) {
    screenShake *= 0.88;
    if (screenShake < 0.2) screenShake = 0;
  }

  // Effects Update
  for (let i = particles.length - 1; i >= 0; i--) {
    particles[i].update();
    if (particles[i].life <= 0) particles.splice(i, 1);
  }

  for (let i = shockwaves.length - 1; i >= 0; i--) {
    shockwaves[i].update();
    if (shockwaves[i].life <= 0) shockwaves.splice(i, 1);
  }

  for (let i = afterimages.length - 1; i >= 0; i--) {
    afterimages[i].update();
    if (afterimages[i].life <= 0) afterimages.splice(i, 1);
  }

  for (let i = floatingTexts.length - 1; i >= 0; i--) {
    floatingTexts[i].update();
    if (floatingTexts[i].life <= 0) floatingTexts.splice(i, 1);
  }

  for (let i = slashEffects.length - 1; i >= 0; i--) {
    slashEffects[i].update();
    if (slashEffects[i].life <= 0) slashEffects.splice(i, 1);
  }

  updateHUD();

  // 5. Rendering
  ctx.save();

  if (screenShake > 0) {
    const shakeX = (Math.random() - 0.5) * screenShake * 2;
    const shakeY = (Math.random() - 0.5) * screenShake * 2;
    ctx.translate(shakeX, shakeY);
  }

  ctx.clearRect(-20, -20, canvas.width + 40, canvas.height + 40);

  // Background Grid
  drawGrid(ctx);

  // Afterimages
  for (const ghost of afterimages) {
    ghost.draw(ctx);
  }

  // Shockwaves
  for (const wave of shockwaves) {
    wave.draw(ctx);
  }

  // MP Recovery Orbs (Blue Orbs)
  for (const orb of mpOrbs) {
    orb.draw(ctx);
  }

  // Bullets
  for (const b of bullets) {
    b.draw(ctx);
  }

  // Homing Missiles
  for (const hb of homingBullets) {
    hb.draw(ctx);
  }

  // Summon Minions (Allies)
  for (const minion of summonMinions) {
    minion.draw(ctx);
  }

  // Enemies (Local / Host or Client Remote)
  if (isClientMP && window.multiplayerManager) {
    for (const re of window.multiplayerManager.remoteGameObjects.enemies) {
      re.draw(ctx);
    }
    if (window.multiplayerManager.remoteGameObjects.boss) {
      window.multiplayerManager.remoteGameObjects.boss.draw(ctx);
    }
    for (const rbb of window.multiplayerManager.remoteGameObjects.bossBullets) {
      rbb.draw(ctx);
    }
  } else {
    for (const e of enemies) {
      e.draw(ctx);
    }
    // Boss
    if (boss && boss.hp > 0) {
      boss.draw(ctx);
    }
    // Boss Bullets
    for (const bb of bossBullets) {
      bb.draw(ctx);
    }
  }

  // Remote Players (Multiplayer)
  if (window.isMultiplayerMode && window.multiplayerManager) {
    for (const rp of Object.values(window.multiplayerManager.remotePlayers)) {
      rp.draw(ctx);
    }
  }

  // Particles
  for (const p of particles) {
    p.draw(ctx);
  }

  // Slicing Line Effects ("真っ二つに切る" 斬撃エフェクト)
  for (const slash of slashEffects) {
    slash.draw(ctx);
  }

  // Floating Popups (Graze MP text)
  for (const ft of floatingTexts) {
    ft.draw(ctx);
  }

  // Aim Guide
  if (gameState === 'PLAYING') {
    drawCrosshair(ctx);
  }

  // Player Rendering
  if (gameState === 'PLAYING') {
    if (player.isDown) {
      // Draw downed state for local player
      const t = performance.now() * 0.003;
      const pulse = 0.35 + Math.abs(Math.sin(t)) * 0.65;
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.globalAlpha = pulse;
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 3;
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 10;
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(-14, -13);
      ctx.lineTo(-8, 0);
      ctx.lineTo(-14, 13);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      // Graze Circle Indicator (for allies to enter and revive)
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.beginPath();
      ctx.arc(0, 0, player.grazeRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(244, 63, 94, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.restore();

      // DOWN text
      ctx.save();
      ctx.font = 'bold 13px -apple-system, sans-serif';
      ctx.fillStyle = '#f43f5e';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#f43f5e';
      ctx.shadowBlur = 8;
      ctx.fillText('DOWN - 味方の救助を待っています', player.x, player.y - 25);
      ctx.restore();

      // Revival progress ring for local player
      if (player.revivalProgress > 0) {
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.beginPath();
        ctx.arc(0, 0, 30, -Math.PI / 2,
          -Math.PI / 2 + Math.PI * 2 * player.revivalProgress, false);
        ctx.strokeStyle = '#7ee787';
        ctx.lineWidth   = 4;
        ctx.shadowColor = '#7ee787';
        ctx.shadowBlur  = 10;
        ctx.stroke();
        ctx.restore();

        // % text
        ctx.save();
        ctx.font         = 'bold 11px monospace';
        ctx.fillStyle    = '#7ee787';
        ctx.textAlign    = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(Math.floor(player.revivalProgress * 100) + '%', player.x, player.y + 24);
        ctx.restore();
      }
    } else {
      // Graze Circle Indicator
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.beginPath();
      ctx.arc(0, 0, player.grazeRadius, 0, Math.PI * 2);
      if (player.grazeEffectTimer > 0) {
        ctx.strokeStyle = '#79c0ff';
        ctx.lineWidth = 2.5;
        ctx.shadowColor = '#58a6ff';
        ctx.shadowBlur = 12;
      } else {
        ctx.strokeStyle = 'rgba(88, 166, 255, 0.22)';
        ctx.lineWidth = 1;
        ctx.setLineDash([4, 4]);
      }
      ctx.stroke();
      ctx.restore();

      // Invincibility flashing
      const isFlashing = player.invincibleTimer > 0 && Math.floor(player.invincibleTimer / 4) % 2 === 0;

      if (!isFlashing) {
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.rotate(player.angle);

        ctx.shadowColor = player.isDashing ? '#38bdf8' : player.glowColor;
        ctx.shadowBlur = player.isDashing ? 24 : 16;

        // Ship body
        ctx.fillStyle = player.isDashing ? '#79c0ff' : player.color;
        ctx.beginPath();
        ctx.moveTo(22, 0);
        ctx.lineTo(-14, -13);
        ctx.lineTo(-8, 0);
        ctx.lineTo(-14, 13);
        ctx.closePath();
        ctx.fill();

        // Ship core
        ctx.shadowBlur = 0;
        ctx.fillStyle = '#f0f6fc';
        ctx.beginPath();
        ctx.arc(2, 0, 5, 0, Math.PI * 2);
        ctx.fill();

        // Thruster flame
        ctx.fillStyle = '#3fb950';
        ctx.beginPath();
        ctx.moveTo(-9, -4);
        ctx.lineTo(-16 - (Math.random() * 6 + 2), 0);
        ctx.lineTo(-9, 4);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
      }
    }

    // Barrier / Guard Shield Visual Effect
    if (player.isGuarding) {
      ctx.save();
      ctx.translate(player.x, player.y);

      const t = performance.now() * 0.005;
      const bRadius = player.guardRadius + Math.sin(t * 3) * 2;

      // Outer Barrier Aura Glow
      ctx.shadowColor = '#34d399';
      ctx.shadowBlur = 24;

      // Hexagonal Barrier Shield
      ctx.beginPath();
      for (let k = 0; k < 6; k++) {
        const hexAngle = (k * Math.PI) / 3 + t * 0.8;
        const hx = Math.cos(hexAngle) * bRadius;
        const hy = Math.sin(hexAngle) * bRadius;
        if (k === 0) ctx.moveTo(hx, hy);
        else ctx.lineTo(hx, hy);
      }
      ctx.closePath();

      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Semi-transparent Shield Energy Field
      ctx.fillStyle = 'rgba(52, 211, 153, 0.22)';
      ctx.fill();

      // Inner Counter-rotating Plasma Ring
      ctx.beginPath();
      ctx.arc(0, 0, bRadius * 0.72, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(110, 231, 183, 0.75)';
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.lineDashOffset = -t * 15;
      ctx.stroke();

      // Core Shield Pulse Ring
      ctx.beginPath();
      ctx.arc(0, 0, bRadius * 0.42, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(167, 243, 208, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.lineDashOffset = t * 20;
      ctx.stroke();

      ctx.restore();
    }
  }

  ctx.restore();

  requestAnimationFrame(gameLoop);
}

// Initialize Multiplayer UI Elements & Listeners
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initMultiplayerUI);
} else {
  initMultiplayerUI();
}

// Start Game
requestAnimationFrame(gameLoop);
