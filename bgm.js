// ================================================================
// Space Assault - BGM Audio Engine (Web Audio API Synthesizer)
// Track 0: Cosmic Calm (Home Screen Ambient / Chill - 88 BPM)
// Track 1: Stellar Piano (Normal Battle - 128 BPM)
// Track 4: Cyber Boss: OVERDRIVE (Normal Boss Battle - 154 BPM)
// Track 5: HamGod Descent (Event Boss: ハム神 降臨 - 160 BPM)
// ================================================================

(function () {
  'use strict';

  let audioCtx = null;
  let masterGain = null;
  let bgmGain = null;
  let isMuted = false;
  let bgmVolume = 0.5;

  let currentTrackType = null; // 'HOME' | 'NORMAL' | 'BOSS' | 'EVENT_BOSS'
  let isPlaying = false;
  let step = 0;
  let timerId = null;

  // MIDI Helper
  const mtof = (m) => (m ? 440 * Math.pow(2, (m - 69) / 12) : 0);

  // MIDI Note Definitions
  const G1 = 31, Ab1 = 32, A1 = 33, Bb1 = 34, B1 = 35;
  const C2 = 36, Cs2 = 37, D2 = 38, Eb2 = 39, E2 = 40, F2 = 41, G2 = 43, Ab2 = 44, A2 = 45, Bb2 = 46, B2 = 47;
  const C3 = 48, Cs3 = 49, D3 = 50, Eb3 = 51, E3 = 52, F3 = 53, G3 = 55, Ab3 = 56, A3 = 57, Bb3 = 58, B3 = 59;
  const C4 = 60, Cs4 = 61, D4 = 62, Eb4 = 63, E4 = 64, F4 = 65, G4 = 67, Ab4 = 68, A4 = 69, Bb4 = 70, B4 = 71;
  const C5 = 72, Cs5 = 73, D5 = 74, Eb5 = 75, E5 = 76, F5 = 77, G5 = 79, Ab5 = 80, A5 = 81, Bb5 = 82, B5 = 83;
  const C6 = 84, D6 = 86, Eb6 = 87, E6 = 88, F6 = 89, G6 = 91, Ab6 = 92, A6 = 93, B6 = 95, C7 = 96, D7 = 98, E7 = 100;

  // ----------------------------------------------------------------
  // Track 0: Home Screen Ambient / Chill (Cosmic Calm, 88 BPM)
  // ----------------------------------------------------------------
  const trackHome = {
    tempo: 88,
    stepsTotal: 32,
    // 温かみのあるエレクトリック・ピアノ (Fmaj7 -> Em7 -> Dm7 -> Cmaj7 / G)
    piano: [
      // Bar 1: Fmaj7
      [F3, C4, E4, A4], 0, 0, [A4, C5], 0, 0, [E4, G4], 0,
      // Bar 2: Em7
      [E3, B3, D4, G4], 0, 0, [G4, B4], 0, 0, [D4, F4], 0,
      // Bar 3: Dm7 -> G7sus4
      [D3, A3, C4, F4], 0, 0, [F4, A4], 0, [G3, D4, F4, B4], 0, 0,
      // Bar 4: Cmaj7 (add9) -> C/E
      [C3, G3, B3, E4], 0, 0, [E4, G4, D5], 0, 0, [G4, C5], 0
    ],
    // 宇宙を漂うアンビエント・シンセパッド
    pad: [
      [F3, A3, C4, E4], 0, 0, 0, 0, 0, 0, 0,
      [E3, G3, B3, D4], 0, 0, 0, 0, 0, 0, 0,
      [D3, F3, A3, C4], 0, 0, 0, [G3, B3, D4, F4], 0, 0, 0,
      [C3, E3, G3, B3], 0, 0, 0, 0, 0, 0, 0
    ],
    // 静寂の星空を彩るドリーミー・ベル
    bell: [
      0, 0, E6, 0, 0, C6, 0, 0,
      0, 0, D6, 0, 0, B5, 0, 0,
      0, 0, C6, 0, 0, 0, D6, 0,
      G6, 0, 0, E6, 0, 0, 0, 0
    ],
    // 柔らかく深みのあるチル・ベース
    bass: [
      F2, 0, 0, 0, 0, 0, C3, 0,
      E2, 0, 0, 0, 0, 0, B2, 0,
      D2, 0, 0, 0, G2, 0, 0, 0,
      C2, 0, 0, 0, 0, 0, G2, 0
    ],
    // 控えめでソフトなローファイ・リズム
    kick: [
      1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0
    ],
    snare: [
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0
    ],
    hihat: [
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0
    ],
    openHat: [
      0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0,
      0, 0, 0, 0, 0, 0, 0, 1,
      0, 0, 0, 0, 0, 0, 0, 0
    ]
  };

  // ----------------------------------------------------------------
  // Track 1: Normal Combat (Stellar Piano, 128 BPM)
  // ----------------------------------------------------------------
  const trackNormal = {
    tempo: 128,
    piano: [
      [D4, F4, A4], 0, [D4, F4], A4, [F4, A4], 0, D5, 0,
      [Bb3, D4, F4], 0, [D4, F4], 0, [F4, Bb4], 0, D5, C5,
      [C4, F4, A4], 0, [F4, A4], 0, [A4, C5], 0, F5, 0,
      [C4, E4, G4], 0, [E4, G4], 0, [G4, C5], 0, E5, D5
    ],
    pad: [
      [D3, A3, F4], 0, 0, 0, 0, 0, 0, 0,
      [Bb2, F3, D4], 0, 0, 0, 0, 0, 0, 0,
      [F2, C3, A3], 0, 0, 0, 0, 0, 0, 0,
      [C3, G3, E4], 0, 0, 0, 0, 0, 0, 0
    ],
    bass: [
      D2, 0, D2, 0, D2, 0, D3, 0,
      Bb2, 0, Bb2, 0, Bb2, 0, F2, 0,
      F2, 0, F2, 0, F2, 0, C3, 0,
      C2, 0, C2, 0, C2, 0, A2, 0
    ],
    kick: [
      1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 0, 0, 0, 0,
      1, 0, 0, 0, 1, 0, 0, 0
    ],
    hihat: [
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 1, 0, 1, 1
    ],
    openHat: [
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0
    ],
    snare: [
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0
    ]
  };

  // ----------------------------------------------------------------
  // Track 4: Normal Boss (Cyber Boss: OVERDRIVE, 154 BPM)
  // ----------------------------------------------------------------
  const trackBoss = {
    tempo: 154,
    piano: [
      [D4, F4], [D4, F4], 0, [D4, F4], [D4, F4], 0, [D4, F4, A4], [D4, F4, A4],
      [C4, Eb4], [C4, Eb4], 0, [C4, Eb4], [C4, Eb4], 0, [C4, Eb4, G4], [C4, Eb4, G4],
      [Bb3, D4], [Bb3, D4], 0, [Bb3, D4], [Bb3, D4], 0, [Bb3, D4, F4], [Bb3, D4, F4],
      [A3, Cs4], [A3, Cs4], [A3, Cs4], [A3, Cs4], [A3, Cs4, E4], [A3, Cs4, E4], [A3, Cs4, E4], 0
    ],
    brass: [
      [D3, A3, D4], 0, [D3, A3, D4], 0, 0, [D3, A3, D4], 0, 0,
      [C3, G3, C4], 0, [C3, G3, C4], 0, 0, [C3, G3, C4], 0, 0,
      [Bb2, F3, Bb3], 0, [Bb2, F3, Bb3], 0, 0, [Bb2, F3, Bb3], 0, 0,
      [A2, E3, A3], [A2, E3, A3], 0, [A2, E3, A3], [A2, E3, A3], 0, [A2, E3, A3], [A2, E3, A3]
    ],
    arp: [
      D5, F5, A5, D6, F5, D5, A4, F4,
      C5, Eb5, G5, C6, Eb5, C5, G4, Eb4,
      Bb4, D5, F5, Bb5, D5, Bb4, F4, D4,
      A4, Cs5, E5, A5, Cs5, A4, E4, Cs4
    ],
    bell: [
      D6, 0, D6, 0, F6, 0, F6, 0,
      Eb6, 0, Eb6, 0, C6, 0, C6, 0,
      D6, 0, D6, 0, F6, 0, F6, 0,
      A6, A6, Ab6, Ab6, G6, G6, F6, 0
    ],
    pad: [
      [D3, A3, F4], 0, 0, 0, 0, 0, 0, 0,
      [C3, G3, Eb4], 0, 0, 0, 0, 0, 0, 0,
      [Bb2, F3, D4], 0, 0, 0, 0, 0, 0, 0,
      [A2, E3, Cs4], 0, 0, 0, 0, 0, 0, 0
    ],
    bass: [
      D2, D2, D2, D2, D3, D2, D3, D2,
      C2, C2, C2, C2, C3, C2, C3, C2,
      Bb1, Bb1, Bb1, Bb1, Bb2, Bb1, Bb2, Bb1,
      A1, A1, A2, A1, A2, A1, A2, A2
    ],
    kick: [
      1, 0, 1, 0, 1, 0, 1, 0,
      1, 0, 1, 0, 1, 0, 1, 0,
      1, 0, 1, 0, 1, 0, 1, 0,
      1, 1, 1, 1, 1, 1, 1, 1
    ],
    hihat: [
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1
    ],
    openHat: [
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 1, 0, 1, 0, 1, 1, 1
    ],
    snare: [
      0, 0, 0, 0, 1, 0, 0, 1,
      0, 0, 0, 0, 1, 0, 0, 1,
      0, 0, 0, 0, 1, 0, 0, 1,
      0, 0, 1, 0, 1, 1, 1, 1
    ]
  };

  // ----------------------------------------------------------------
  // Track 5: Event Boss (HamGod Descent - 160 BPM, 64 steps: Aメロ -> サビ/大サビの山)
  // ----------------------------------------------------------------
  const trackEventBoss = {
    tempo: 160,
    stepsTotal: 64,
    // Part 1 (0-31: 助走・疾走Aメロ), Part 2 (32-63: ドラマチックな大サビ・感動の山)
    piano: [
      // --- Part 1 (Aメロ・軽快な助走) ---
      [F4, A4, C5], 0, [F4, A4], [F4, A4], 0, [F4, A4, C5], 0, [F4, A4],
      [G4, B4, D5], 0, [G4, B4], [G4, B4], 0, [G4, B4, D5], 0, [G4, B4],
      [E4, G4, B4], 0, [E4, G4], [E4, G4], 0, [E4, G4, B4], 0, [E4, G4],
      [A4, C5, E5], 0, [A4, C5], [A4, C5], 0, [A4, C5, E5], [B4, D5], [C5, E5],

      // --- Part 2 (サビ・感情爆発の山！ 高音オクターブ連打 & 転調感) ---
      [F4, A4, C5, F5], [F4, A4, C5, F5], 0, [F4, A4, C5, F5], [G4, B4, D5, G5], [G4, B4, D5, G5], 0, [G4, B4, D5, G5],
      [E4, G4, B4, E5], [E4, G4, B4, E5], 0, [E4, G4, B4, E5], [A4, C5, E5, A5], 0, [A4, C5, E5, A5], [B4, D5, G5, B5],
      [F4, A4, C5, F5], [F4, A4, C5, F5], 0, [F4, A4, C5, F5], [G4, B4, D5, G5], [G4, B4, D5, G5], 0, [G4, B4, D5, G5],
      [A4, C5, E5, A5], [A4, C5, E5, A5], [B4, D5, G5, B5], [B4, D5, G5, B5], [C5, E5, G5, C6], [C5, E5, G5, C6], [D5, F5, A5, D6], [E5, G5, B5, E6]
    ],
    brass: [
      // Part 1: バックサポート
      0, 0, 0, 0, [F3, C4, A4], 0, 0, 0,
      0, 0, 0, 0, [G3, D4, B4], 0, 0, 0,
      0, 0, 0, 0, [E3, B3, G4], 0, 0, 0,
      0, 0, 0, 0, [A3, E4, C5], 0, [B3, G4, D5], 0,

      // Part 2: サビで壮大に鳴り響くフルブラス！
      [F3, A3, C4, F4], 0, 0, 0, [G3, B3, D4, G4], 0, 0, 0,
      [E3, G3, B3, E4], 0, 0, 0, [A3, C4, E4, A4], 0, [B3, D4, G4, B4], 0,
      [F3, A3, C4, F4], 0, 0, 0, [G3, B3, D4, G4], 0, 0, 0,
      [A3, C4, E4, A4], 0, [B3, D4, G4, B4], 0, [C4, E4, G4, C5], 0, [D4, F4, A4, D5], [E4, G4, B4, E5]
    ],
    arp: [
      // Part 1: コミカルなバブルアルペジオ
      C5, E5, G5, C6, E6, C6, G5, E5,
      D5, F5, A5, D6, F6, D6, A5, F5,
      B4, D5, G5, B5, D6, B5, G5, D5,
      C5, E5, A5, C6, E6, D6, C6, B5,

      // Part 2: サビで高音に突き抜ける疾走メロディアルペジオ！
      A5, C6, E6, A6, G6, E6, C6, G5,
      B5, D6, G6, B6, A6, G6, D6, B5,
      G5, B5, E6, G6, F6, E6, B5, G5,
      A5, C6, E6, A6, B6, C7, D7, E7
    ],
    bell: [
      // Part 1: キラキラアクセント
      C6, 0, E6, 0, G6, 0, C7, 0,
      D6, 0, F6, 0, A6, 0, F6, 0,
      B5, 0, D6, 0, G6, 0, B6, 0,
      A6, 0, G6, 0, F6, 0, E6, 0,

      // Part 2: サビ頂点で輝く神聖カリヨンベル連打！
      C7, 0, C7, 0, B6, 0, B6, 0,
      G6, 0, G6, 0, A6, 0, B6, 0,
      C7, 0, C7, 0, D7, 0, D7, 0,
      E7, E7, D7, D7, C7, C7, B6, 0
    ],
    pad: [
      // Part 1: ふわふわクワイア
      [F4, C5, A5], 0, 0, 0, 0, 0, 0, 0,
      [G4, D5, B5], 0, 0, 0, 0, 0, 0, 0,
      [E4, B4, G5], 0, 0, 0, 0, 0, 0, 0,
      [A4, E5, C6], 0, 0, 0, 0, 0, 0, 0,

      // Part 2: サビで神々しく広がるオーケストラルストリングス
      [F4, A4, C5, F5], 0, 0, 0, [G4, B4, D5, G5], 0, 0, 0,
      [E4, G4, B4, E5], 0, 0, 0, [A4, C5, E5, A5], 0, 0, 0,
      [F4, A4, C5, F5], 0, 0, 0, [G4, B4, D5, G5], 0, 0, 0,
      [A4, C5, E5, A5], 0, [B4, D5, G5, B5], 0, [C5, E5, G5, C6], 0, 0, 0
    ],
    bass: [
      // Part 1: オクターブ往復スラップ
      F2, F3, F2, F3, F2, F3, F2, A2,
      G2, G3, G2, G3, G2, G3, G2, B2,
      E2, E3, E2, E3, E2, E3, E2, G2,
      A2, A3, A2, A3, G2, G3, F2, G2,

      // Part 2: サビでドライビングする疾走16分連打ベース！
      F2, F2, F3, F2, F2, F3, F2, F3,
      G2, G2, G3, G2, G2, G3, G2, G3,
      E2, E2, E3, E2, E2, E3, E2, E3,
      A2, A2, A3, A2, B2, B2, C3, E3
    ],
    kick: [
      // Part 1: ダンスビート
      1, 0, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 1, 0, 0, 0,
      1, 0, 0, 0, 1, 0, 0, 0,
      1, 0, 1, 0, 1, 0, 1, 1,

      // Part 2: サビのドライブ4つ打ち＋連打フィル
      1, 0, 1, 0, 1, 0, 1, 0,
      1, 0, 1, 0, 1, 0, 1, 0,
      1, 0, 1, 0, 1, 0, 1, 0,
      1, 1, 1, 1, 1, 1, 1, 1
    ],
    hihat: [
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,

      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1,
      1, 1, 1, 1, 1, 1, 1, 1
    ],
    openHat: [
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 1, 0, 1,

      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 0, 1, 0, 0, 0, 1, 0,
      0, 1, 0, 1, 0, 1, 1, 1
    ],
    snare: [
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 0, 0,
      0, 0, 0, 0, 1, 0, 1, 0,

      0, 0, 0, 0, 1, 0, 0, 1,
      0, 0, 0, 0, 1, 0, 0, 1,
      0, 0, 0, 0, 1, 0, 0, 1,
      0, 0, 1, 1, 1, 1, 1, 1
    ]
  };

  function initAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtxClass) return false;
      audioCtx = new AudioCtxClass();

      masterGain = audioCtx.createGain();
      masterGain.gain.value = 1.0;
      masterGain.connect(audioCtx.destination);

      bgmGain = audioCtx.createGain();
      bgmGain.gain.value = isMuted ? 0 : bgmVolume;
      bgmGain.connect(masterGain);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return true;
  }

  // --- Synthesizer Voices ---
  function playPianoNote(noteNumber, time, dur = 0.7, vol = 0.22) {
    if (!noteNumber || !audioCtx) return;
    const freq = mtof(noteNumber);
    if (!freq) return;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(Math.min(freq * 5.5, 7500), time);
    filter.frequency.linearRampToValueAtTime(Math.min(freq * 1.5, 1800), time + 0.15);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.01);
    gain.gain.linearRampToValueAtTime(vol * 0.35, time + 0.22);
    gain.gain.linearRampToValueAtTime(0.0001, time + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
  }

  function playBrassNote(noteNumber, time, dur = 0.45, vol = 0.18, isBoss = false) {
    if (!noteNumber || !audioCtx) return;
    const freq = mtof(noteNumber);
    if (!freq) return;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(freq, time);
    osc1.detune.setValueAtTime(-9, time);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, time);
    osc2.detune.setValueAtTime(+9, time);

    filter.type = 'lowpass';
    const maxCut = isBoss ? 4600 : 3600;
    filter.frequency.setValueAtTime(900, time);
    filter.frequency.linearRampToValueAtTime(maxCut, time + 0.04);
    filter.frequency.exponentialRampToValueAtTime(950, time + dur);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
  }

  function playArpNote(noteNumber, time, dur = 0.11, vol = 0.14, isBoss = false) {
    if (!noteNumber || !audioCtx) return;
    const freq = mtof(noteNumber);
    if (!freq) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    const cut = (currentTrackType === 'EVENT_BOSS') ? 6500 : (isBoss ? 5500 : 4500);
    filter.frequency.setValueAtTime(cut, time);
    filter.frequency.exponentialRampToValueAtTime(750, time + dur);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  function playBellNote(noteNumber, time, dur = 0.8, vol = 0.12, isBoss = false) {
    if (!noteNumber || !audioCtx) return;
    const freq = mtof(noteNumber);
    if (!freq) return;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    const mult = (currentTrackType === 'EVENT_BOSS') ? 3.0 : (isBoss ? 2.82 : 2.404);
    osc2.frequency.setValueAtTime(freq * mult, time);

    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol, time + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(bgmGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
  }

  function playStringsNote(noteNumber, time, dur = 0.9, vol = 0.11) {
    if (!noteNumber || !audioCtx) return;
    const freq = mtof(noteNumber);
    if (!freq) return;

    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc1.type = (currentTrackType === 'HOME') ? 'triangle' : 'sawtooth';
    osc1.frequency.setValueAtTime(freq, time);
    osc1.detune.setValueAtTime(-7, time);

    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(freq, time);
    osc2.detune.setValueAtTime(+7, time);

    filter.type = 'lowpass';
    const filterFreq = (currentTrackType === 'HOME') ? 1400 : ((currentTrackType === 'EVENT_BOSS') ? 3200 : 2300);
    filter.frequency.setValueAtTime(filterFreq, time);

    const attack = (currentTrackType === 'HOME') ? 0.35 : 0.08;
    gain.gain.setValueAtTime(0.001, time);
    gain.gain.linearRampToValueAtTime(vol, time + attack);
    gain.gain.linearRampToValueAtTime(0.0001, time + dur);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    osc1.start(time);
    osc2.start(time);
    osc1.stop(time + dur);
    osc2.stop(time + dur);
  }

  function playBassNote(noteNumber, time, dur = 0.22, vol = 0.26, isBoss = false) {
    if (!noteNumber || !audioCtx) return;
    const freq = mtof(noteNumber);
    if (!freq) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = (currentTrackType === 'HOME' || currentTrackType === 'EVENT_BOSS') ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);

    filter.type = 'lowpass';
    const cut = (currentTrackType === 'HOME') ? 600 : ((currentTrackType === 'EVENT_BOSS') ? 2000 : (isBoss ? 1700 : 1400));
    filter.frequency.setValueAtTime(cut, time);
    filter.frequency.linearRampToValueAtTime(140, time + dur);

    const bassVol = (currentTrackType === 'HOME') ? vol * 0.75 : vol;
    gain.gain.setValueAtTime(bassVol, time);
    gain.gain.linearRampToValueAtTime(0.0001, time + dur);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    osc.start(time);
    osc.stop(time + dur);
  }

  function playKick(time, isBoss = false) {
    if (!audioCtx) return;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(bgmGain);

    const isHome = (currentTrackType === 'HOME');
    const startFreq = isHome ? 100 : ((currentTrackType === 'EVENT_BOSS') ? 160 : (isBoss ? 145 : 135));
    osc.frequency.setValueAtTime(startFreq, time);
    osc.frequency.exponentialRampToValueAtTime(28, time + 0.11);
    gain.gain.setValueAtTime(isHome ? 0.42 : (isBoss ? 0.78 : 0.72), time);
    gain.gain.linearRampToValueAtTime(0.0001, time + 0.13);

    osc.start(time);
    osc.stop(time + 0.13);
  }

  function playSnare(time, isBoss = false) {
    if (!audioCtx) return;
    const isHome = (currentTrackType === 'HOME');
    const bufferSize = audioCtx.sampleRate * (isHome ? 0.045 : 0.085);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = isHome ? 'bandpass' : 'highpass';
    filter.frequency.value = isHome ? 2200 : ((currentTrackType === 'EVENT_BOSS') ? 1350 : 1150);

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(isHome ? 0.16 : (isBoss ? 0.35 : 0.3), time);
    gain.gain.linearRampToValueAtTime(0.0001, time + (isHome ? 0.045 : 0.085));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    noise.start(time);
    noise.stop(time + (isHome ? 0.045 : 0.085));
  }

  function playHihat(time) {
    if (!audioCtx) return;
    const isHome = (currentTrackType === 'HOME');
    const bufferSize = audioCtx.sampleRate * (isHome ? 0.022 : 0.028);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = isHome ? 8500 : 7500;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(isHome ? 0.09 : 0.16, time);
    gain.gain.linearRampToValueAtTime(0.0001, time + (isHome ? 0.022 : 0.028));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    noise.start(time);
    noise.stop(time + (isHome ? 0.022 : 0.028));
  }

  function playOpenHat(time) {
    if (!audioCtx) return;
    const isHome = (currentTrackType === 'HOME');
    const bufferSize = audioCtx.sampleRate * (isHome ? 0.08 : 0.13);
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;

    const filter = audioCtx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = isHome ? 9500 : 8500;

    const gain = audioCtx.createGain();
    gain.gain.setValueAtTime(isHome ? 0.11 : 0.18, time);
    gain.gain.linearRampToValueAtTime(0.0001, time + (isHome ? 0.08 : 0.13));

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(bgmGain);

    noise.start(time);
    noise.stop(time + (isHome ? 0.08 : 0.13));
  }

  // --- Sequencer Scheduler ---
  function scheduler() {
    if (!isPlaying || !currentTrackType) return;
    try {
      const isBoss = (currentTrackType === 'BOSS');
      let tData = trackNormal;
      if (currentTrackType === 'HOME') tData = trackHome;
      else if (currentTrackType === 'BOSS') tData = trackBoss;
      else if (currentTrackType === 'EVENT_BOSS') tData = trackEventBoss;

      const stepDuration = 60 / tData.tempo / 4; // 16th note
      const now = audioCtx.currentTime;
      const totalSteps = tData.stepsTotal || 32;
      const s = step % totalSteps;

      // Drums
      if (tData.kick && tData.kick[s]) playKick(now, isBoss);
      if (tData.snare && tData.snare[s]) playSnare(now, isBoss);
      if (tData.hihat && tData.hihat[s]) playHihat(now);
      if (tData.openHat && tData.openHat[s]) playOpenHat(now);

      // Bass
      if (tData.bass && tData.bass[s]) {
        playBassNote(tData.bass[s], now, stepDuration * 1.5, 0.26, isBoss);
      }

      // Fast Arp
      if (tData.arp && tData.arp[s]) {
        playArpNote(tData.arp[s], now, stepDuration * 0.95, 0.13, isBoss);
      }

      // Brass
      if (tData.brass && tData.brass[s]) {
        const item = tData.brass[s];
        if (Array.isArray(item)) {
          item.forEach((note) => playBrassNote(note, now, stepDuration * 2.0, 0.15, isBoss));
        } else if (item > 0) {
          playBrassNote(item, now, stepDuration * 2.0, 0.17, isBoss);
        }
      }

      // Bell
      if (tData.bell && tData.bell[s]) {
        playBellNote(tData.bell[s], now, stepDuration * 3.0, 0.12, isBoss);
      }

      // Piano
      if (tData.piano && tData.piano[s]) {
        const item = tData.piano[s];
        if (Array.isArray(item)) {
          item.forEach((note) => playPianoNote(note, now, stepDuration * 2.6, 0.18));
        } else if (item > 0) {
          playPianoNote(item, now, stepDuration * 2.3, 0.22);
        }
      }

      // Pad / Strings
      if (tData.pad && tData.pad[s]) {
        const item = tData.pad[s];
        if (Array.isArray(item)) {
          item.forEach((note) => playStringsNote(note, now, stepDuration * 4.8, 0.10));
        } else if (item > 0) {
          playStringsNote(item, now, stepDuration * 3.8, 0.12);
        }
      }

      step++;
      timerId = setTimeout(scheduler, stepDuration * 1000);
    } catch (err) {
      console.warn('[BGM Engine] Scheduler warning:', err);
    }
  }

  // --- Public Music Manager API ---
  window.bgmManager = {
    // Start or switch to track: 'NORMAL' | 'BOSS' | 'EVENT_BOSS'
    playTrack: function (type) {
      if (!type) return;
      initAudioContext();

      if (currentTrackType === type && isPlaying) {
        return; // Already playing this track
      }

      currentTrackType = type;
      if (timerId) clearTimeout(timerId);

      step = step % 8; // Rhythm continuity
      isPlaying = true;
      scheduler();
    },

    stop: function () {
      if (timerId) clearTimeout(timerId);
      isPlaying = false;
      currentTrackType = null;
      step = 0;
    },

    toggleMute: function () {
      initAudioContext();
      isMuted = !isMuted;
      if (bgmGain) {
        bgmGain.gain.setValueAtTime(isMuted ? 0 : bgmVolume, audioCtx.currentTime);
      }
      return isMuted;
    },

    setVolume: function (vol) {
      bgmVolume = Math.max(0, Math.min(1, vol));
      if (bgmGain && !isMuted) {
        bgmGain.gain.setValueAtTime(bgmVolume, audioCtx.currentTime);
      }
    },

    isMuted: function () {
      return isMuted;
    },

    getCurrentTrack: function () {
      return currentTrackType;
    }
  };

  // Unlock AudioContext on first user gesture anywhere & auto-play HOME BGM if on start screen
  const unlockAudio = () => {
    initAudioContext();
    if (!isPlaying && (!window.gameState || window.gameState === 'START')) {
      window.bgmManager.playTrack('HOME');
    }
    window.removeEventListener('pointerdown', unlockAudio);
    window.removeEventListener('keydown', unlockAudio);
  };
  window.addEventListener('pointerdown', unlockAudio, { passive: true });
  window.addEventListener('keydown', unlockAudio, { passive: true });

})();
