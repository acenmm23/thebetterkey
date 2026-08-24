import { ArrowDown, ArrowRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import betterKeyKey from './assets/betterkey-key.webp'
import deadboltImg from './assets/deadbolt.webp'

const WAITLIST_URL = 'https://forms.gle/jDQy3swL2g5gwGGq8'

function NoCloudGraphic() {
  return (
    <svg className="pillar-cloud-svg" viewBox="0 0 320 240" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <rect x="126" y="35" width="70" height="126" rx="14" />
        <line x1="147" y1="48" x2="175" y2="48" />
        <rect x="50" y="103" width="65" height="92" rx="13" />
        <rect x="64" y="124" width="37" height="43" rx="6" />
        <path d="M52 78c19-20 50-20 69 0M62 89c14-14 35-14 49 0M75 99c7-7 16-7 23 0" />
        <circle cx="86" cy="109" r="4" fill="currentColor" stroke="none" />
        <path d="M145 205c-4-16 4-29 18-37 18-10 39 3 39 23 0 6-2 11-5 16h-45c-3-1-5-1-7-2Z" />
        <line x1="155" y1="218" x2="192" y2="218" />
        <path d="M224 173c4-17 18-29 35-29 18 0 33 14 36 32 12 0 22 9 22 21 0 12-10 21-23 21h-67c-13 0-23-10-23-22 0-11 8-20 20-23Z" />
        <rect x="228" y="94" width="49" height="79" rx="18" />
        <circle cx="252" cy="117" r="7" />
        <circle cx="242" cy="144" r="3" fill="currentColor" stroke="none" />
        <circle cx="253" cy="144" r="3" fill="currentColor" stroke="none" />
        <circle cx="264" cy="144" r="3" fill="currentColor" stroke="none" />
        <circle cx="247" cy="155" r="3" fill="currentColor" stroke="none" />
        <circle cx="259" cy="155" r="3" fill="currentColor" stroke="none" />
        <line className="no-cloud-x" x1="35" y1="25" x2="290" y2="225" />
        <line className="no-cloud-x" x1="290" y1="25" x2="35" y2="225" />
      </g>
    </svg>
  )
}

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

      <div className="key-demo-card">
        <div className="fob-copy">
          <span className="eyebrow">TRY IT</span>
          <strong>{locked ? 'Press the key button to unlock' : 'Press the key button to lock'}</strong>
        </div>
        <div className="interactive-key-wrap">
          <img className="interactive-key" src={betterKeyKey} alt="BetterKey leather key fob" />
          <button
            className="key-button-hotspot"
            onClick={() => setLocked(v => !v)}
            aria-label={locked ? 'Unlock demo with key button' : 'Lock demo with key button'}
          >
            <span className="key-button-pulse" />
          </button>
        </div>
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
        <p><strong>Press before you reach the door.</strong><span>Open it when you get there. Your existing deadbolt. Your physical key. One easier way in.</span></p>
        <a href="#why" className="text-link">Why it matters <ArrowDown size={16}/></a>
      </div>
      <LockDemo />
    </section>
  )
}

function WhyBetterKey() {
  return (
    <section className="why-better shell" id="why">
      <div className="why-intro">
        <span className="eyebrow">WHY BETTERKEY</span>
        <div className="why-intro-main">
          <h2 className="why-title">Your key isn’t broken.<br/><em>We made the keyway optional.</em></h2>
          <p>BetterKey does not replace the thing that already works. It adds one new option to the key you already carry: unlock while you are still walking up.</p>
        </div>
      </div>

      <div className="unlock-compare" aria-label="Compare unlocking with a normal key and BetterKey">
        <div className="compare-row compare-key">
          <span className="compare-label">WITH A KEY</span>
          <div className="compare-steps">
            <span>Reach the door</span><i>→</i><span>Line it up</span><i>→</i><span>Insert</span><i>→</i><span>Turn</span>
          </div>
        </div>
        <div className="compare-row compare-better">
          <span className="compare-label">WITH BETTERKEY</span>
          <div className="compare-steps">
            <span className="compare-accent">Press while approaching</span><i>→</i><span>Open the door</span>
          </div>
        </div>
      </div>

      <div className="value-split">
        <article className="value-case">
          <span className="eyebrow">FOR MOST PEOPLE</span>
          <h3>A little easier.<br/><em>Every single day.</em></h3>
          <p>No life-changing promise. Just less stopping, lining up, inserting, and turning every time you come home.</p>
        </article>
        <article className="value-case">
          <span className="eyebrow">FOR SOME PEOPLE</span>
          <h3>The same button<br/><em>can mean a lot more.</em></h3>
          <p>If gripping, precise alignment, or twisting is uncomfortable or difficult, the same one-press interaction removes that motion from everyday entry.</p>
        </article>
      </div>

      <div className="why-statement">
        <div><span>Keep the key.</span> <strong>Skip the keyway.</strong></div>
        <p>And if you ever want to use the key normally, you still can.</p>
      </div>
    </section>
  )
}

const pillars = [
  { image: betterKeyKey, imageClass: 'pillar-key', index: '01', title: 'Dedicated button', copy: 'The button lives right on the key you already carry. Press while you are approaching the door.' },
  { image: deadboltImg, imageClass: 'pillar-deadbolt', index: '02', title: 'Keeps your deadbolt', copy: 'Designed around the lock you already use, rather than replacing your whole front-door routine.' },
  { graphic: 'no-cloud', index: '03', title: 'Not another cloud lock', copy: 'Core access should not depend on your phone, Wi-Fi, voice assistant, or a cloud connection.' },
]

function HowItWorks() {
  return (
    <section className="section shell" id="how">
      <div className="section-head">
        <span className="eyebrow">THE IDEA</span>
        <h2 className="section-title">Smart-home ease.<br/>Without the smart-home ritual.</h2>
      </div>
      <div className="pillars">
        {pillars.map(({image, imageClass, graphic, index, title, copy}) => (
          <article className="pillar" key={index}>
            <div className="pillar-top"><span>{index}</span></div>
            <div className="pillar-visual">
              {graphic === 'no-cloud' ? <NoCloudGraphic /> : <img src={image} alt="" className={imageClass} aria-hidden="true" />}
            </div>
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
            Follow the build <ArrowRight size={15}/>
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
        <WhyBetterKey />
        <HowItWorks />
        <Manifesto />
        <BuildStory />
        <Waitlist />
      </main>
      <Footer />
    </>
  )
}
