import { useEffect, useState } from 'react'
import { start, toggle, subscribe, getState } from '../audio/soundscape.js'

// Site-wide ambient layer. Mounted once above the router so it never restarts on navigation.
// Audio can't autoplay before a gesture, so we arm one-time listeners to start the bed on the
// first interaction; the floating control lets the listener mute/unmute at any time.
export default function AmbientAudio() {
  const [state, setState] = useState(getState())

  useEffect(() => subscribe(setState), [])

  useEffect(() => {
    // Audio is on by default — start it on the very first interaction of any kind (browsers
    // block sound until then). Only stays silent if the visitor explicitly muted before.
    const begin = () => { start() }   // on by default — start unmuted on first interaction
    const opts = { once: true, passive: true }
    const events = ['pointerdown', 'touchstart', 'touchend', 'keydown', 'click', 'wheel', 'scroll']
    events.forEach((e) => window.addEventListener(e, begin, opts))
    return () => events.forEach((e) => window.removeEventListener(e, begin))
  }, [])

  const on = state.started && !state.muted

  return (
    <button
      onClick={toggle}
      aria-label={on ? 'Mute ambient sound' : 'Play ambient sound'}
      aria-pressed={on}
      title={on ? 'Sound on' : 'Sound off'}
      style={styles.btn}
    >
      <Waves on={on} />
    </button>
  )
}

// Three little equalizer bars that animate while sound is on, flatten to a muted glyph when off.
function Waves({ on }) {
  const bars = [0, 1, 2]
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      {on ? (
        bars.map((i) => (
          <rect key={i} x={5 + i * 6} y="8" width="3" height="8" rx="1.5" fill="var(--sv-saffron)">
            <animate
              attributeName="height"
              values="4;14;4" dur={`${0.9 + i * 0.25}s`} repeatCount="indefinite"
              begin={`${i * 0.18}s`}
            />
            <animate
              attributeName="y"
              values="10;5;10" dur={`${0.9 + i * 0.25}s`} repeatCount="indefinite"
              begin={`${i * 0.18}s`}
            />
          </rect>
        ))
      ) : (
        <>
          {bars.map((i) => (
            <rect key={i} x={5 + i * 6} y="10" width="3" height="4" rx="1.5" fill="var(--sv-dim)" />
          ))}
          <line x1="3" y1="21" x2="21" y2="3" stroke="var(--sv-dim)" strokeWidth="1.6" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
}

const styles = {
  btn: {
    position: 'fixed', left: 'max(16px, 2vw)', bottom: 'max(16px, 2.4vh)', zIndex: 60,
    width: 44, height: 44, borderRadius: '50%', display: 'grid', placeItems: 'center',
    background: 'rgba(246,241,231,0.86)', backdropFilter: 'blur(10px)',
    border: '1px solid var(--sv-line)', boxShadow: '0 6px 18px rgba(44,42,34,0.12)',
    cursor: 'pointer', transition: 'transform 0.25s var(--sv-ease), box-shadow 0.25s var(--sv-ease)'
  }
}
