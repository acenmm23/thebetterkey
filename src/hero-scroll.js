const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value))

function initHeroScroll() {
  const hero = document.querySelector('.hero')
  const title = document.querySelector('.hero-title')

  if (!hero || !title) {
    requestAnimationFrame(initHeroScroll)
    return
  }

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
  const compactScreen = window.matchMedia('(max-width: 900px)')
  let frame = null

  function reset() {
    title.style.removeProperty('--hero-scroll-scale')
    title.style.removeProperty('--hero-scroll-opacity')
    title.classList.remove('hero-scroll-active')
  }

  function update() {
    frame = null

    if (reducedMotion.matches || compactScreen.matches) {
      reset()
      return
    }

    const scrollY = window.scrollY || window.pageYOffset
    const heroTop = hero.offsetTop
    const start = heroTop + 70
    const shrinkDistance = Math.min(430, window.innerHeight * 0.56)
    const progress = clamp((scrollY - start) / shrinkDistance)

    // The full three-line hero collapses into a small brand statement under the nav.
    const scale = 1 - progress * 0.76

    // Hold it briefly while the product explainer comes into view, then let it leave.
    const fadeStart = start + shrinkDistance + Math.min(180, window.innerHeight * 0.2)
    const fadeDistance = Math.min(240, window.innerHeight * 0.3)
    const fadeProgress = clamp((scrollY - fadeStart) / fadeDistance)
    const opacity = 1 - fadeProgress

    title.style.setProperty('--hero-scroll-scale', scale.toFixed(4))
    title.style.setProperty('--hero-scroll-opacity', opacity.toFixed(4))
    title.classList.add('hero-scroll-active')
  }

  function requestUpdate() {
    if (frame !== null) return
    frame = requestAnimationFrame(update)
  }

  update()
  window.addEventListener('scroll', requestUpdate, { passive: true })
  window.addEventListener('resize', requestUpdate)
  reducedMotion.addEventListener?.('change', requestUpdate)
  compactScreen.addEventListener?.('change', requestUpdate)
}

requestAnimationFrame(() => requestAnimationFrame(initHeroScroll))
