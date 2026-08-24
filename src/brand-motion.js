const clamp01 = (value) => Math.min(1, Math.max(0, value))

function sectionProgress(element, startViewport = 0.78, endViewport = 0.26) {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  const vh = Math.max(1, window.innerHeight)
  const start = vh * startViewport
  const end = vh * endViewport
  return clamp01((start - rect.top) / Math.max(1, start - end))
}

function stickySectionProgress(section) {
  if (!section) return 0

  const rect = section.getBoundingClientRect()
  const vh = Math.max(1, window.innerHeight)
  const scrollableDistance = Math.max(1, section.offsetHeight - vh)

  // Start only once the black section has substantially arrived, then use the
  // section's actual scrollable distance. This keeps laptop and monitor timing
  // proportional instead of tying it to fixed pixels or browser view-timeline quirks.
  const startOffset = vh * 0.16
  const travelled = startOffset - rect.top
  const total = scrollableDistance + startOffset
  return clamp01(travelled / Math.max(1, total))
}

export function initBrandMotion() {
  if (document.documentElement.dataset.betterkeyMotionReady === 'true') return

  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const approachPanel = document.querySelector('.approach-panel')
  const approachWords = Array.from(document.querySelectorAll('.approach-flow span'))
  const whyStatement = document.querySelector('.why-statement')
  const keepPhrase = whyStatement?.querySelector('span')
  const addPhrase = whyStatement?.querySelector('strong')
  const antiSection = document.querySelector('.anti-smart')
  const antiPills = Array.from(document.querySelectorAll('.anti-smart-claims span'))
  const antiBottom = document.querySelector('.anti-smart-bottom')

  if (!approachPanel && !whyStatement && !antiSection) return
  document.documentElement.dataset.betterkeyMotionReady = 'true'

  let raf = 0

  const clearMotionClasses = () => {
    approachWords.forEach((word) => word.classList.remove('is-motion-active', 'is-motion-past'))
    keepPhrase?.classList.remove('is-motion-active')
    addPhrase?.classList.remove('is-motion-active')
    antiPills.forEach((pill) => pill.classList.remove('is-motion-lit'))
    antiBottom?.classList.remove('is-motion-arrived')
  }

  const showReducedMotionState = () => {
    clearMotionClasses()
    if (approachWords[1]) approachWords[1].classList.add('is-motion-active')
    addPhrase?.classList.add('is-motion-active')
    antiPills.forEach((pill) => pill.classList.add('is-motion-lit'))
    antiBottom?.classList.add('is-motion-arrived')
  }

  const updateApproach = () => {
    if (!approachPanel || approachWords.length < 3) return
    const p = sectionProgress(approachPanel, 0.80, 0.28)

    // Snap one pill between the three steps. No gradual fill.
    const activeIndex = p < 0.34 ? 0 : p < 0.67 ? 1 : 2

    approachWords.forEach((word, index) => {
      word.classList.toggle('is-motion-active', index === activeIndex)
      word.classList.toggle('is-motion-past', index < activeIndex)
    })
  }

  const updateWhyStatement = () => {
    if (!whyStatement || !keepPhrase || !addPhrase) return
    const p = sectionProgress(whyStatement, 0.82, 0.38)

    // A binary handoff, matching the existing rectangular highlighter style.
    const showAddOption = p >= 0.50
    keepPhrase.classList.toggle('is-motion-active', !showAddOption)
    addPhrase.classList.toggle('is-motion-active', showAddOption)
  }

  const updateAntiSmart = () => {
    if (!antiSection || antiPills.length === 0) return
    const p = stickySectionProgress(antiSection)

    // Spread the cumulative sequence almost across the entire sticky travel.
    // These are normalized fractions of real section travel, not screen-specific pixels.
    const thresholds = [0.08, 0.27, 0.46, 0.65, 0.84]
    antiPills.forEach((pill, index) => {
      pill.classList.toggle('is-motion-lit', p >= thresholds[index])
    })

    antiBottom?.classList.toggle('is-motion-arrived', p >= 0.91)
  }

  const update = () => {
    raf = 0
    if (reduced.matches) {
      showReducedMotionState()
      return
    }

    updateApproach()
    updateWhyStatement()
    updateAntiSmart()
  }

  const schedule = () => {
    if (raf) return
    raf = window.requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  reduced.addEventListener?.('change', schedule)
}
