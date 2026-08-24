const clamp01 = (value) => Math.min(1, Math.max(0, value))

function viewportProgress(element, startRatio = 0.84, endRatio = 0.30) {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  const vh = Math.max(1, window.innerHeight)
  const start = vh * startRatio
  const end = vh * endRatio
  return clamp01((start - rect.top) / Math.max(1, start - end))
}

function antiSmartProgress(section) {
  if (!section) return 0
  const rect = section.getBoundingClientRect()
  const vh = Math.max(1, window.innerHeight)

  // Start only when the section has genuinely entered the viewport,
  // then spread the sequence over roughly one viewport of scrolling.
  const start = vh * 0.78
  const end = -vh * 0.34
  return clamp01((start - rect.top) / Math.max(1, start - end))
}

function initBrandMotion() {
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

  let raf = 0

  const clearMotionClasses = () => {
    approachWords.forEach((word) => word.classList.remove('is-motion-active', 'is-motion-past'))
    keepPhrase?.classList.remove('is-motion-active')
    addPhrase?.classList.remove('is-motion-active', 'is-motion-final')
    antiPills.forEach((pill) => pill.classList.remove('is-motion-lit'))
    antiBottom?.classList.remove('is-motion-arrived')
  }

  const showReducedMotionState = () => {
    clearMotionClasses()
    if (approachWords[1]) approachWords[1].classList.add('is-motion-active')
    addPhrase?.classList.add('is-motion-final')
    antiPills.forEach((pill) => pill.classList.add('is-motion-lit'))
    antiBottom?.classList.add('is-motion-arrived')
  }

  const updateApproach = () => {
    if (!approachPanel || approachWords.length === 0) return
    const p = viewportProgress(approachPanel, 0.86, 0.32)

    // A traveling highlight: approaching → press → open.
    let activeIndex = 0
    if (p >= 0.70) activeIndex = 2
    else if (p >= 0.38) activeIndex = 1

    approachWords.forEach((word, index) => {
      word.classList.toggle('is-motion-active', index === activeIndex)
      word.classList.toggle('is-motion-past', index < activeIndex)
    })
  }

  const updateWhyStatement = () => {
    if (!whyStatement || !keepPhrase || !addPhrase) return
    const p = viewportProgress(whyStatement, 0.88, 0.40)

    const keepActive = p < 0.50
    keepPhrase.classList.toggle('is-motion-active', keepActive)
    addPhrase.classList.toggle('is-motion-active', !keepActive)
    addPhrase.classList.toggle('is-motion-final', p >= 0.72)
  }

  const updateAntiSmart = () => {
    if (!antiSection || antiPills.length === 0) return
    const p = antiSmartProgress(antiSection)

    // Cumulative, intentionally slower than the previous view-timeline version.
    const thresholds = [0.16, 0.30, 0.44, 0.58, 0.72]
    antiPills.forEach((pill, index) => {
      pill.classList.toggle('is-motion-lit', p >= thresholds[index])
    })

    antiBottom?.classList.toggle('is-motion-arrived', p >= 0.78)
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

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initBrandMotion, { once: true })
} else {
  initBrandMotion()
}
