const clamp = (value, min, max) => Math.min(max, Math.max(min, value))

export function initMobileHorizontalScroll() {
  if (document.documentElement.dataset.mobileHorizontalReady === 'true') return
  document.documentElement.dataset.mobileHorizontalReady = 'true'

  const mobile = window.matchMedia('(max-width: 900px)')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let scenes = []
  let raf = 0
  let resizeTimer = 0
  let lastWidth = window.innerWidth

  const cancelSnap = (entry) => {
    if (!entry.snapRaf) return
    window.cancelAnimationFrame(entry.snapRaf)
    entry.snapRaf = 0
  }

  const unwrapScene = (entry) => {
    const { row, scene, parent, nextSibling } = entry
    cancelSnap(entry)
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
    const cards = Array.from(row.children).filter((child) => child.getBoundingClientRect().width > 0)
    const distance = Math.max(0, row.scrollWidth - row.clientWidth)
    const rowHeight = Math.ceil(row.getBoundingClientRect().height)
    const firstOffset = cards[0]?.offsetLeft || 0
    const targets = cards.map((card) => clamp(card.offsetLeft - firstOffset, 0, distance))

    if (targets.length > 1) targets[targets.length - 1] = distance

    // Each card gets one short vertical beat. The card itself moves in a fast
    // horizontal snap, rather than tracking every pixel of the user's scroll.
    const stepTravel = Math.round(clamp(window.innerHeight * 0.17, 118, 154))
    const travel = Math.max(0, stepTravel * Math.max(0, targets.length - 1))

    entry.distance = distance
    entry.targets = targets
    entry.stepTravel = stepTravel
    entry.travel = travel
    scene.style.height = `${Math.max(rowHeight, rowHeight + travel)}px`
    sticky.style.minHeight = `${rowHeight}px`

    const safeIndex = clamp(entry.currentIndex || 0, 0, Math.max(0, targets.length - 1))
    entry.currentIndex = safeIndex
    row.scrollLeft = targets[safeIndex] || 0
  }

  const snapTo = (entry, index) => {
    const target = entry.targets[index]
    if (target == null) return

    cancelSnap(entry)
    const start = entry.row.scrollLeft
    const delta = target - start

    if (Math.abs(delta) < 1) {
      entry.row.scrollLeft = target
      return
    }

    const duration = 145
    const started = performance.now()

    const frame = (now) => {
      const t = clamp((now - started) / duration, 0, 1)
      const eased = 1 - Math.pow(1 - t, 4)
      entry.row.scrollLeft = start + delta * eased

      if (t < 1) {
        entry.snapRaf = window.requestAnimationFrame(frame)
      } else {
        entry.row.scrollLeft = target
        entry.snapRaf = 0
      }
    }

    entry.snapRaf = window.requestAnimationFrame(frame)
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

    const entry = {
      row,
      scene,
      sticky,
      parent,
      nextSibling,
      distance: 0,
      targets: [],
      stepTravel: 130,
      travel: 0,
      currentIndex: 0,
      snapRaf: 0,
    }
    measure(entry)
    return entry
  }

  const setup = () => {
    teardown()
    if (!mobile.matches || reduced.matches) return

    scenes = [
      createScene('.value-split', 'mobile-hscene--values'),
      createScene('.pillars', 'mobile-hscene--pillars'),
      createScene('.build-board', 'mobile-hscene--build'),
    ].filter(Boolean)

    scenes.forEach(measure)
    update()
  }

  const update = () => {
    raf = 0
    if (!mobile.matches || reduced.matches || scenes.length === 0) return

    const scrollY = window.scrollY

    scenes.forEach((entry) => {
      if (entry.targets.length <= 1) return

      const stickyTop = Number.parseFloat(window.getComputedStyle(entry.sticky).top) || 0
      const sceneTop = entry.scene.getBoundingClientRect().top + scrollY
      const start = sceneTop - stickyTop
      const localTravel = scrollY - start
      const nextIndex = clamp(
        Math.round(localTravel / Math.max(1, entry.stepTravel)),
        0,
        entry.targets.length - 1,
      )

      if (nextIndex !== entry.currentIndex) {
        entry.currentIndex = nextIndex
        snapTo(entry, nextIndex)
      }
    })
  }

  const schedule = () => {
    if (raf) return
    raf = window.requestAnimationFrame(update)
  }

  const handleResize = () => {
    const nextWidth = window.innerWidth

    // Ignore Safari's height-only browser-chrome resize events so a pinned
    // scene never reconstructs mid-gesture.
    if (Math.abs(nextWidth - lastWidth) < 3) return
    lastWidth = nextWidth

    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(setup, 120)
  }

  setup()
  document.fonts?.ready.then(() => {
    scenes.forEach(measure)
    schedule()
  })

  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', handleResize)
  window.addEventListener('orientationchange', () => {
    lastWidth = window.innerWidth
    window.clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(setup, 120)
  })
  mobile.addEventListener?.('change', setup)
  reduced.addEventListener?.('change', setup)
}
