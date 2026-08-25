const clamp01 = (value) => Math.min(1, Math.max(0, value))

export function initMobileHorizontalScroll() {
  if (document.documentElement.dataset.mobileHorizontalReady === 'true') return
  document.documentElement.dataset.mobileHorizontalReady = 'true'

  const mobile = window.matchMedia('(max-width: 900px)')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let scenes = []
  let raf = 0
  let resizeTimer = 0

  const unwrapScene = (entry) => {
    const { row, scene, parent, nextSibling } = entry
    row.classList.remove('is-scroll-driven')
    row.scrollLeft = 0

    if (nextSibling && nextSibling.parentNode === parent) {
      parent.insertBefore(row, nextSibling)
    } else {
      parent.appendChild(row)
    }

    scene.remove()
  }

  const teardown = () => {
    scenes.forEach(unwrapScene)
    scenes = []
  }

  const measure = (entry) => {
    const { row, scene, sticky } = entry
    const distance = Math.max(0, row.scrollWidth - row.clientWidth)
    const rowHeight = Math.ceil(row.getBoundingClientRect().height)

    entry.distance = distance
    scene.style.height = `${Math.max(rowHeight, rowHeight + distance)}px`
    sticky.style.minHeight = `${rowHeight}px`
  }

  const createScene = (selector, modifier) => {
    const row = document.querySelector(selector)
    if (!row || row.closest('.mobile-hscene')) return null

    const parent = row.parentNode
    const nextSibling = row.nextSibling
    const scene = document.createElement('div')
    const sticky = document.createElement('div')

    scene.className = `mobile-hscene ${modifier}`
    sticky.className = 'mobile-hscene-sticky'
    parent.insertBefore(scene, row)
    scene.appendChild(sticky)
    sticky.appendChild(row)
    row.classList.add('is-scroll-driven')
    row.scrollLeft = 0

    const entry = { row, scene, sticky, parent, nextSibling, distance: 0 }
    measure(entry)
    return entry
  }

  const setup = () => {
    teardown()
    if (!mobile.matches || reduced.matches) return

    const nextScenes = [
      createScene('.value-split', 'mobile-hscene--values'),
      createScene('.pillars', 'mobile-hscene--pillars'),
    ].filter(Boolean)

    scenes = nextScenes
    scenes.forEach(measure)
    update()
  }

  const update = () => {
    raf = 0
    if (!mobile.matches || reduced.matches || scenes.length === 0) return

    const scrollY = window.scrollY

    scenes.forEach((entry) => {
      const { row, scene, sticky, distance } = entry
      if (distance <= 0) return

      const stickyTop = Number.parseFloat(window.getComputedStyle(sticky).top) || 0
      const sceneTop = scene.getBoundingClientRect().top + scrollY
      const start = sceneTop - stickyTop
      const progress = clamp01((scrollY - start) / distance)
      row.scrollLeft = progress * distance
    })
  }

  const schedule = () => {
    if (raf) return
    raf = window.requestAnimationFrame(update)
  }

  const handleResize = () => {
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(setup, 120)
  }

  setup()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', handleResize)
  mobile.addEventListener?.('change', setup)
  reduced.addEventListener?.('change', setup)
}
