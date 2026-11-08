/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Synthesized Web Audio API Sound Engine for DayGrid
 * Programmatically generated high-fidelity acoustic & digital tones.
 * Zero external mp3/wav files required, zero copyright dependencies.
 */

import { NotificationSoundType, PomodoroSoundType } from '../types';

let audioCtx: AudioContext | null = null;
let currentNodes: { oscs: OscillatorNode[]; gains: GainNode[] } = { oscs: [], gains: [] };

function getAudioContext(): AudioContext | null {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!audioCtx) {
      audioCtx = new AudioCtx();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume().catch(() => {});
    }
    return audioCtx;
  } catch (e) {
    console.warn('AudioContext unavailable:', e);
    return null;
  }
}

/**
 * Stop any currently running sound preview immediately
 */
export function stopAudioPlayback(): void {
  try {
    currentNodes.oscs.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {}
    });
    currentNodes.gains.forEach((gain) => {
      try {
        gain.disconnect();
      } catch (e) {}
    });
    currentNodes = { oscs: [], gains: [] };
  } catch (e) {}
}

/**
 * Master volume multiplier (0.0 to 1.0)
 */
function normalizeVolume(vol: number, isMuted: boolean): number {
  if (isMuted) return 0;
  const clamped = Math.max(0, Math.min(1, vol));
  return clamped * 0.35; // keep comfortable hearing range
}

// ==========================================
// 1. NOTIFICATION SOUNDS (8 OPTIONS)
// ==========================================

export function playNotificationSound(
  type: NotificationSoundType = 'Default',
  volume: number = 0.8,
  isMuted: boolean = false
): void {
  const masterVol = normalizeVolume(volume, isMuted);
  if (masterVol <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  stopAudioPlayback();
  const now = ctx.currentTime;

  switch (type) {
    case 'Default': {
      // Crisp 2-tone crystal ping (A5 -> C#6)
      playNotes(ctx, [
        { freq: 880, start: 0, dur: 0.35, gain: masterVol * 0.8, type: 'sine' },
        { freq: 1108.73, start: 0.08, dur: 0.6, gain: masterVol * 0.9, type: 'sine' },
      ]);
      break;
    }

    case 'Soft Chime': {
      // Mindful relaxing triad (E5 -> G#5 -> B5)
      playNotes(ctx, [
        { freq: 659.25, start: 0, dur: 0.9, gain: masterVol * 0.7, type: 'sine' },
        { freq: 830.61, start: 0.12, dur: 1.0, gain: masterVol * 0.75, type: 'sine' },
        { freq: 987.77, start: 0.24, dur: 1.2, gain: masterVol * 0.8, type: 'sine' },
      ]);
      break;
    }

    case 'Bell': {
      // Resonant brass bell with rich physical overtones
      const f = 523.25; // C5
      playNotes(ctx, [
        { freq: f, start: 0, dur: 1.5, gain: masterVol * 0.8, type: 'sine' },
        { freq: f * 2.01, start: 0, dur: 1.1, gain: masterVol * 0.45, type: 'sine' },
        { freq: f * 3.02, start: 0, dur: 0.7, gain: masterVol * 0.25, type: 'triangle' },
      ]);
      break;
    }

    case 'Digital Ping': {
      // Crisp modern electronic ping
      playNotes(ctx, [
        { freq: 1250, start: 0, dur: 0.08, gain: masterVol * 0.85, type: 'triangle' },
        { freq: 1850, start: 0.06, dur: 0.25, gain: masterVol * 0.9, type: 'sine' },
      ]);
      break;
    }

    case 'Gentle Pop': {
      // Acoustic bubble / drop pop
      playFrequencySweep(ctx, 650, 180, 0.12, masterVol, 'sine');
      break;
    }

    case 'Water Drop': {
      // Resonant upward glide water droplet
      playFrequencySweep(ctx, 950, 1680, 0.16, masterVol, 'sine');
      break;
    }

    case 'Marimba': {
      // Warm acoustic wood percussion (fundamental + 3x harmonic)
      const mf = 440;
      playNotes(ctx, [
        { freq: mf, start: 0, dur: 0.45, gain: masterVol * 0.9, type: 'triangle' },
        { freq: mf * 3.01, start: 0, dur: 0.15, gain: masterVol * 0.35, type: 'sine' },
      ]);
      break;
    }

    case 'Classic Notification': {
      // Ascending major triad (C5 -> E5 -> G5)
      playNotes(ctx, [
        { freq: 523.25, start: 0, dur: 0.25, gain: masterVol * 0.7, type: 'sine' },
        { freq: 659.25, start: 0.08, dur: 0.3, gain: masterVol * 0.75, type: 'sine' },
        { freq: 783.99, start: 0.16, dur: 0.65, gain: masterVol * 0.85, type: 'sine' },
      ]);
      break;
    }

    default:
      playNotes(ctx, [
        { freq: 880, start: 0, dur: 0.3, gain: masterVol * 0.8, type: 'sine' },
      ]);
  }
}

// ==========================================
// 2. POMODORO COMPLETION SOUNDS (8 OPTIONS)
// ==========================================

export function playPomodoroSound(
  type: PomodoroSoundType = 'Default Alarm',
  volume: number = 0.8,
  isMuted: boolean = false
): void {
  const masterVol = normalizeVolume(volume, isMuted);
  if (masterVol <= 0) return;

  const ctx = getAudioContext();
  if (!ctx) return;

  stopAudioPlayback();

  switch (type) {
    case 'Default Alarm': {
      // Rhythmic two-pulse alertness chime (E5 -> B5, twice)
      playNotes(ctx, [
        { freq: 659.25, start: 0, dur: 0.35, gain: masterVol * 0.8, type: 'sine' },
        { freq: 987.77, start: 0.12, dur: 0.5, gain: masterVol * 0.9, type: 'sine' },
        { freq: 659.25, start: 0.45, dur: 0.35, gain: masterVol * 0.8, type: 'sine' },
        { freq: 987.77, start: 0.57, dur: 0.8, gain: masterVol * 0.95, type: 'sine' },
      ]);
      break;
    }

    case 'Gentle Bell': {
      // Deep 432Hz meditation bell with harmonic warmth and long decay
      const base = 432;
      playNotes(ctx, [
        { freq: base, start: 0, dur: 2.2, gain: masterVol * 0.9, type: 'sine' },
        { freq: base * 2.002, start: 0, dur: 1.6, gain: masterVol * 0.4, type: 'sine' },
        { freq: base * 3.01, start: 0, dur: 1.0, gain: masterVol * 0.2, type: 'triangle' },
      ]);
      break;
    }

    case 'Digital Alarm': {
      // Modern 3-pulse sequence (beep-beep-beep)
      playNotes(ctx, [
        { freq: 880, start: 0.0, dur: 0.12, gain: masterVol * 0.85, type: 'square' },
        { freq: 880, start: 0.18, dur: 0.12, gain: masterVol * 0.85, type: 'square' },
        { freq: 1174.66, start: 0.36, dur: 0.4, gain: masterVol * 0.95, type: 'square' },
      ]);
      break;
    }

    case 'Classic Clock': {
      // Dual brass mechanical desk bell strike
      playNotes(ctx, [
        { freq: 784, start: 0.0, dur: 0.5, gain: masterVol * 0.85, type: 'triangle' },
        { freq: 1568, start: 0.0, dur: 0.25, gain: masterVol * 0.35, type: 'sine' },
        { freq: 784, start: 0.22, dur: 0.8, gain: masterVol * 0.9, type: 'triangle' },
        { freq: 1568, start: 0.22, dur: 0.4, gain: masterVol * 0.4, type: 'sine' },
      ]);
      break;
    }

    case 'Soft Chime': {
      // 4-chord progression chime in D Major (D5 -> F#5 -> A5 -> D6)
      playNotes(ctx, [
        { freq: 587.33, start: 0.0, dur: 1.0, gain: masterVol * 0.7, type: 'sine' },
        { freq: 739.99, start: 0.14, dur: 1.1, gain: masterVol * 0.75, type: 'sine' },
        { freq: 880.0, start: 0.28, dur: 1.2, gain: masterVol * 0.8, type: 'sine' },
        { freq: 1174.66, start: 0.42, dur: 1.5, gain: masterVol * 0.85, type: 'sine' },
      ]);
      break;
    }

    case 'Nature Alert': {
      // Melodic avian warble with frequency vibrato
      playNatureWarble(ctx, masterVol);
      break;
    }

    case 'Double Beep': {
      // Two quick clean notification pulses
      playNotes(ctx, [
        { freq: 1046.5, start: 0.0, dur: 0.1, gain: masterVol * 0.8, type: 'sine' },
        { freq: 1046.5, start: 0.14, dur: 0.2, gain: masterVol * 0.85, type: 'sine' },
      ]);
      break;
    }

    case 'Success Tone': {
      // Triumphant major fanfare chord (C5 -> E5 -> G5 -> C6 chord hold)
      playNotes(ctx, [
        { freq: 523.25, start: 0.0, dur: 0.2, gain: masterVol * 0.7, type: 'sine' },
        { freq: 659.25, start: 0.1, dur: 0.2, gain: masterVol * 0.75, type: 'sine' },
        { freq: 783.99, start: 0.2, dur: 0.3, gain: masterVol * 0.8, type: 'sine' },
        { freq: 1046.5, start: 0.3, dur: 1.4, gain: masterVol * 0.95, type: 'sine' },
        { freq: 523.25, start: 0.3, dur: 1.4, gain: masterVol * 0.5, type: 'sine' },
        { freq: 659.25, start: 0.3, dur: 1.4, gain: masterVol * 0.5, type: 'sine' },
        { freq: 783.99, start: 0.3, dur: 1.4, gain: masterVol * 0.5, type: 'sine' },
      ]);
      break;
    }

    default:
      playNotes(ctx, [
        { freq: 659.25, start: 0, dur: 0.8, gain: masterVol * 0.8, type: 'sine' },
        { freq: 987.77, start: 0.15, dur: 1.0, gain: masterVol * 0.85, type: 'sine' },
      ]);
  }
}

/**
 * Backward compatibility alias
 */
export function playTimerCompletionChime(volume: number = 0.8, isMuted: boolean = false): void {
  playPomodoroSound('Default Alarm', volume, isMuted);
}

// ==========================================
// HELPER SYNTHESIZERS
// ==========================================

interface NoteSpec {
  freq: number;
  start: number;
  dur: number;
  gain: number;
  type: OscillatorType;
}

function playNotes(ctx: AudioContext, notes: NoteSpec[]): void {
  const now = ctx.currentTime;
  const newOscs: OscillatorNode[] = [];
  const newGains: GainNode[] = [];

  notes.forEach((note) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = note.type;
    osc.frequency.setValueAtTime(note.freq, now + note.start);

    gain.gain.setValueAtTime(0.0001, now + note.start);
    gain.gain.exponentialRampToValueAtTime(Math.max(0.001, note.gain), now + note.start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + note.start + note.dur);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now + note.start);
    osc.stop(now + note.start + note.dur + 0.05);

    newOscs.push(osc);
    newGains.push(gain);
  });

  currentNodes = { oscs: newOscs, gains: newGains };
}

function playFrequencySweep(
  ctx: AudioContext,
  startFreq: number,
  endFreq: number,
  duration: number,
  vol: number,
  type: OscillatorType
): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(startFreq, now);
  osc.frequency.exponentialRampToValueAtTime(endFreq, now + duration);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(vol * 0.8, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + duration + 0.02);

  currentNodes = { oscs: [osc], gains: [gain] };
}

function playNatureWarble(ctx: AudioContext, vol: number): void {
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.type = 'sine';
  osc.frequency.setValueAtTime(1200, now);
  osc.frequency.linearRampToValueAtTime(1750, now + 0.08);
  osc.frequency.linearRampToValueAtTime(1400, now + 0.16);
  osc.frequency.linearRampToValueAtTime(1950, now + 0.28);
  osc.frequency.linearRampToValueAtTime(1300, now + 0.45);

  gain.gain.setValueAtTime(0.001, now);
  gain.gain.exponentialRampToValueAtTime(vol * 0.8, now + 0.03);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.48);

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.start(now);
  osc.stop(now + 0.5);

  currentNodes = { oscs: [osc], gains: [gain] };
}
