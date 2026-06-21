// Svaya soundscape — the site-wide ambient layer (Web Audio). A module-level singleton:
// it survives client-side route changes because the graph lives outside React.
//
//   ambient   a real track at AMBIENT_FILE, decoded to an AudioBuffer for reliable, gapless
//             looping (AudioBufferSourceNode isn't subject to the autoplay quirks that block
//             <audio> elements). Falls back to a synthesized drone if the file is missing.
//
// Browsers block audio until a user gesture, so the AudioContext is created/resumed lazily
// on start(). Drop a track at /audio/ambient.mp3 and it plays; otherwise the synth bed runs.

const AMBIENT_FILE = '/audio/ambient.mp3'
const AMBIENT_VOL = 0.085     // synth-bed level (fallback only)
const FILE_VOL = 0.38         // real-file level — the file's own loudness sets the rest

let ctx = null
let master = null              // global mute/volume bus
let padNodes = []             // running synth oscillators (fallback)
let bellTimer = null
let started = false
let muted = false
const listeners = new Set()    // UI subscribers (toggle button) -> notified on state change

function notify() { listeners.forEach((fn) => fn({ started, muted })) }

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext
    ctx = new AC()
    master = ctx.createGain()
    master.gain.value = 0                       // fade in from silence on start
    master.connect(ctx.destination)
  }
  return ctx
}

// Prefer the real track; decode it to a buffer for dependable looping. Synth on any failure.
async function startAmbient() {
  try {
    const res = await fetch(AMBIENT_FILE)
    if (!res.ok) throw new Error('ambient file missing')
    const arr = await res.arrayBuffer()
    const buf = await ctx.decodeAudioData(arr)
    const src = ctx.createBufferSource()
    src.buffer = buf
    src.loop = true
    const g = ctx.createGain(); g.gain.value = FILE_VOL
    src.connect(g); g.connect(master)
    src.start()
  } catch (e) {
    buildPad()
  }
}

function buildPad() {
  const c = ctx
  const pad = c.createGain(); pad.gain.value = AMBIENT_VOL
  const lp = c.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 720; lp.Q.value = 0.6
  pad.connect(lp); lp.connect(master)

  // A warm, open chord (A2 · E3 · A3 · C#4) — each note a pair of slightly detuned sines for movement
  const freqs = [110, 164.81, 220, 277.18]
  freqs.forEach((f, i) => {
    const g = c.createGain(); g.gain.value = 0.28 / (i + 1)
    g.connect(pad)
    ;[-5, 6].forEach((cents) => {
      const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f; o.detune.value = cents
      o.connect(g); o.start()
      padNodes.push(o)
    })
  })

  // slow tremolo so the bed breathes
  const lfo = c.createOscillator(); lfo.type = 'sine'; lfo.frequency.value = 0.07
  const lfoGain = c.createGain(); lfoGain.gain.value = AMBIENT_VOL * 0.45
  lfo.connect(lfoGain); lfoGain.connect(pad.gain); lfo.start(); padNodes.push(lfo)

  // very slow filter sweep so the timbre evolves
  const flfo = c.createOscillator(); flfo.type = 'sine'; flfo.frequency.value = 0.03
  const fg = c.createGain(); fg.gain.value = 240
  flfo.connect(fg); fg.connect(lp.frequency); flfo.start(); padNodes.push(flfo)

  scheduleBell()
}

function scheduleBell() {
  clearTimeout(bellTimer)
  const next = 11000 + Math.random() * 14000
  bellTimer = setTimeout(() => { if (started) { bell(); scheduleBell() } }, next)
}

function bell() {
  const c = ctx, now = c.currentTime
  const f = [392, 523.25, 659.25][Math.floor(Math.random() * 3)]   // G4 / C5 / E5
  const g = c.createGain(); g.gain.value = 0
  g.connect(master)
  ;[1, 2.01].forEach((mult) => {
    const o = c.createOscillator(); o.type = 'sine'; o.frequency.value = f * mult
    o.connect(g); o.start(now); o.stop(now + 5.4)
  })
  g.gain.setValueAtTime(0, now)
  g.gain.linearRampToValueAtTime(AMBIENT_VOL * 0.75, now + 0.06)
  g.gain.exponentialRampToValueAtTime(0.0001, now + 5)
}

// Public API ---------------------------------------------------------------

export function start() {
  ensureCtx()
  if (ctx.state === 'suspended') ctx.resume()
  if (!started) {
    started = true
    startAmbient()
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(muted ? 0 : 1, now + 1.6)
  }
  notify()
}

export function setMuted(v) {
  muted = v
  try { localStorage.setItem('sv-sound-muted', v ? '1' : '0') } catch (e) { /* private mode */ }
  if (master && ctx) {
    const now = ctx.currentTime
    master.gain.cancelScheduledValues(now)
    master.gain.setValueAtTime(master.gain.value, now)
    master.gain.linearRampToValueAtTime(v ? 0 : 1, now + 0.4)
  }
  notify()
}

export function toggle() {
  if (!started) { muted = false; start() } else { setMuted(!muted) }
}

export function getState() { return { started, muted } }

export function subscribe(fn) { listeners.add(fn); return () => listeners.delete(fn) }

// On by default: start unmuted every load. The toggle still mutes for the current session.
