const clamp01 = (value) => Math.min(1, Math.max(0, value))

function sectionProgress(element, startViewport = 0.78, endViewport = 0.26) {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  const vh = Math.max(1, window.innerHeight)
  const start = vh * startViewport
  const end = vh * endViewport
  return clamp01((start - rect.top) / Math.max(1, start - end))
}

function centeredSectionProgress(element, startCenterViewport = 0.70, endCenterViewport = 0.05) {
  if (!element) return 0
  const rect = element.getBoundingClientRect()
  const vh = Math.max(1, window.innerHeight)
  const elementCenter = rect.top + rect.height / 2
  const start = vh * startCenterViewport
  const end = vh * endCenterViewport

  // Drive the sequence from the panel's visual center, not just its top edge.
  // This naturally accounts for both viewport height and panel height, so a
  // shorter laptop screen does not enter the sequence halfway through.
  return clamp01((start - elementCenter) / Math.max(1, start - end))
}

function stickySectionProgress(section) {
  if (!section) return 0

  const rect = section.getBoundingClientRect()
  const vh = Math.max(1, window.innerHeight)
  const scrollableDistance = Math.max(1, section.offsetHeight - vh)

  // Use the section's real scrollable distance so pacing stays proportional
  // across laptop and monitor heights instead of depending on fixed pixels.
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

    // Use the panel center and a longer viewport-relative travel window.
    // This delays the first snap on shorter laptop screens and gives each
    // state a little more time to sit before the next one takes over.
    const p = centeredSectionProgress(approachPanel, 0.70, 0.05)

    const activeIndex = p < 0.36 ? 0 : p < 0.70 ? 1 : 2

    approachWords.forEach((word, index) => {
      word.classList.toggle('is-motion-active', index === activeIndex)
      word.classList.toggle('is-motion-past', index < activeIndex)
    })
  }

  const updateWhyStatement = () => {
    if (!whyStatement || !keepPhrase || !addPhrase) return
    const p = sectionProgress(whyStatement, 0.82, 0.47)

    // Phone users spend less physical scroll distance on this compact block,
    // so let "Keep the key." own the highlight longer before handing it off.
    const mobile = window.matchMedia('(max-width: 900px)').matches
    const handoffPoint = mobile ? 0.72 : 0.50
    const showAddOption = p >= handoffPoint
    keepPhrase.classList.toggle('is-motion-active', !showAddOption)
    addPhrase.classList.toggle('is-motion-active', showAddOption)
  }

  const updateAntiSmart = () => {
    if (!antiSection || antiPills.length === 0) return
    const p = stickySectionProgress(antiSection)

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
