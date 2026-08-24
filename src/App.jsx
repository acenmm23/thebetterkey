import { ArrowDown, ArrowRight, Instagram, LockKeyhole, Radio, WifiOff, Wrench } from 'lucide-react'
import { useMemo, useState } from 'react'

const WAITLIST_URL = 'https://forms.gle/jDQy3swL2g5gwGGq8'

function Nav() {
  return (
    <header className="nav-wrap">
      <nav className="nav shell">
        <a href="#top" className="brand" aria-label="theBetterKey home">thebetterkey</a>
        <div className="nav-links">
          <a href="#how">How it works</a>
          <a href="#build">Building</a>
          <a className="nav-cta" href="#waitlist">Join waitlist <ArrowRight size={14} strokeWidth={1.8}/></a>
        </div>
      </nav>
    </header>
  )
}

function LockDemo() {
  const [locked, setLocked] = useState(true)
  const status = locked ? 'Locked' : 'Unlocked'

  return (
    <div className={`demo-stage ${locked ? 'is-locked' : 'is-unlocked'}`}>
      <div className="door-plane" aria-hidden="true">
        <div className="door-edge" />
        <div className="bolt" />
      </div>

      <div className="device-wrap">
        <div className="device-shadow" />
        <div className="device">
          <span className="device-mark">thebetterkey</span>
          <div className="thumbturn">
            <span className="thumbturn-bar" />
          </div>
          <span className="device-status"><i /> {status}</span>
        </div>
      </div>

      <div className="fob-card">
        <div className="fob-copy">
          <span className="eyebrow">TRY IT</span>
          <strong>{locked ? 'Press to unlock' : 'Press to lock'}</strong>
        </div>
        <button className="fob" onClick={() => setLocked(v => !v)} aria-label={locked ? 'Unlock demo' : 'Lock demo'}>
          <span className="fob-loop" />
          <span className="fob-face">
            <span className="fob-icon"><LockKeyhole size={19} strokeWidth={1.7} /></span>
          </span>
        </button>
      </div>
    </div>
  )
}

function Hero() {
  return (
    <section className="hero shell" id="top">
      <div className="hero-kicker reveal">A better way through the front door.</div>
      <h1 className="display hero-title reveal reveal-delay-1">
        Your front door<br/>should work<br/><em>like your car.</em>
      </h1>
      <div className="hero-bottom reveal reveal-delay-2">
        <p>Press a button. Unlock your existing deadbolt. No phone. No Wi-Fi.</p>
        <a href="#how" className="text-link">See how it works <ArrowDown size={16}/></a>
      </div>
      <LockDemo />
    </section>
  )
}

const pillars = [
  { icon: Radio, index: '01', title: 'Dedicated button', copy: 'No pulling out your phone. Reach for a physical fob and press.' },
  { icon: Wrench, index: '02', title: 'Keeps your deadbolt', copy: 'Designed around the lock you already use, rather than replacing your whole front-door routine.' },
  { icon: WifiOff, index: '03', title: 'Not another cloud lock', copy: 'The door should still feel like a door. Core access should not depend on your Wi-Fi connection.' },
]

function HowItWorks() {
  return (
    <section className="section shell" id="how">
      <div className="section-head">
        <span className="eyebrow">THE IDEA</span>
        <h2 className="section-title">Smart-home ease.<br/>Without the smart-home ritual.</h2>
      </div>
      <div className="pillars">
        {pillars.map(({icon: Icon, index, title, copy}) => (
          <article className="pillar" key={index}>
            <div className="pillar-top"><span>{index}</span><Icon size={24} strokeWidth={1.4}/></div>
            <div>
              <h3>{title}</h3>
              <p>{copy}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

function Manifesto() {
  return (
    <section className="manifesto">
      <div className="shell manifesto-inner">
        <span className="eyebrow light">WHY</span>
        <p className="manifesto-copy">
          Opening your home should be <span>boring.</span><br/>
          Fast. Physical. Reliable.<br/>
          <i>One press and you’re in.</i>
        </p>
      </div>
    </section>
  )
}

function BuildStory() {
  return (
    <section className="section shell build" id="build">
      <div className="build-grid">
        <div className="build-copy">
          <span className="eyebrow">BUILDING IN PUBLIC</span>
          <h2 className="section-title">Not a render.<br/>A product in progress.</h2>
          <p>theBetterKey is being designed, printed, wired, broken, rebuilt, and tested in public. Follow the messy part, not just the launch photos.</p>
          <a href="https://instagram.com/ahsonmade" target="_blank" rel="noreferrer" className="outline-link">
            <Instagram size={17} strokeWidth={1.7}/> Follow the build <ArrowRight size={15}/>
          </a>
        </div>

        <div className="build-board" aria-label="Build progress collage">
          <div className="build-card build-card-a">
            <span className="mono-label">V1 / MECHANISM</span>
            <div className="prototype-sketch">
              <div className="sketch-device"><span/></div>
              <div className="dimension d1">65 mm</div>
              <div className="dimension d2">motor</div>
            </div>
            <p>Make it move.</p>
          </div>
          <div className="build-card build-card-b">
            <span className="mono-label">V2 / ELECTRONICS</span>
            <div className="pcb-art">
              <span className="chip chip-main">MCU</span>
              <span className="chip chip-driver">DRV</span>
              <i className="trace t1"/><i className="trace t2"/><i className="trace t3"/><i className="trace t4"/>
            </div>
            <p>Shrink it down.</p>
          </div>
          <div className="build-card build-card-c">
            <span className="mono-label">NEXT / PRODUCT</span>
            <div className="future-device"><span>thebetterkey</span><i/></div>
            <p>Then make it beautiful.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

function Waitlist() {
  const [email, setEmail] = useState('')
  const formUrl = useMemo(() => WAITLIST_URL, [])

  function handleSubmit(e) {
    e.preventDefault()
    // Existing Google Form stays as the live destination until a proper inline endpoint is connected.
    // Email is copied so it is ready to paste into the current form.
    if (email.trim()) navigator.clipboard?.writeText(email.trim()).catch(() => {})
    window.open(formUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <section className="waitlist" id="waitlist">
      <div className="shell waitlist-inner">
        <div>
          <span className="eyebrow light">EARLY ACCESS</span>
          <h2>Be first<br/>through the door.</h2>
        </div>
        <div className="waitlist-right">
          <p>Join the list for prototype updates, early testing, and first access when theBetterKey is ready.</p>
          <form onSubmit={handleSubmit}>
            <label className="sr-only" htmlFor="email">Email address</label>
            <input id="email" type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@email.com"/>
            <button type="submit">Join waitlist <ArrowRight size={17}/></button>
          </form>
          <small>For now this opens the current waitlist form. We’ll connect true one-step signup next.</small>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <div className="shell footer-inner">
        <a href="#top" className="brand footer-brand">thebetterkey</a>
        <div className="footer-meta">
          <span>Built in Santa Cruz, CA</span>
          <a href="https://instagram.com/ahsonmade" target="_blank" rel="noreferrer">Instagram</a>
          <span>© {new Date().getFullYear()}</span>
        </div>
      </div>
    </footer>
  )
}

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Manifesto />
        <BuildStory />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
