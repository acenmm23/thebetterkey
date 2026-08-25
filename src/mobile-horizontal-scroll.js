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
    entry.animating = false
  }

  const setProgress = (entry, index) => {
    if (!entry.progressThumb || entry.targets.length === 0) return

    const count = entry.targets.length
    const thumbWidth = 100 / count
    const maxLeft = 100 - thumbWidth
    const left = count <= 1 ? 0 : (index / (count - 1)) * maxLeft

    entry.progressThumb.style.width = `${thumbWidth}%`
    entry.progressThumb.style.left = `${left}%`
  }

  const nearestTargetIndex = (entry) => {
    if (entry.targets.length === 0) return 0

    let nearest = 0
    let nearestDistance = Number.POSITIVE_INFINITY
    entry.targets.forEach((target, index) => {
      const distance = Math.abs(entry.row.scrollLeft - target)
      if (distance < nearestDistance) {
        nearestDistance = distance
        nearest = index
      }
    })
    return nearest
  }

  const unwrapScene = (entry) => {
    const { row, scene, parent, nextSibling } = entry
    cancelSnap(entry)

    if (entry.manualScrollHandler) {
      row.removeEventListener('scroll', entry.manualScrollHandler)
    }

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
    const firstOffset = cards[0]?.offsetLeft || 0
    const targets = cards.map((card) => clamp(card.offsetLeft - firstOffset, 0, distance))

    if (targets.length > 1) targets[targets.length - 1] = distance

    /* A short vertical beat advances one card. The sticky scene occupies the
       viewport, so the page does not appear to move down while those beats are
       consumed. */
    const stepTravel = Math.round(clamp(window.innerHeight * 0.09, 70, 88))
    const travel = Math.max(0, stepTravel * Math.max(0, targets.length - 1))
    const stickyHeight = Math.max(
      Math.ceil(sticky.getBoundingClientRect().height),
      Math.ceil(row.getBoundingClientRect().height),
    )

    entry.distance = distance
    entry.targets = targets
    entry.stepTravel = stepTravel
    entry.travel = travel
    scene.style.height = `${stickyHeight + travel}px`
    sticky.style.minHeight = `${Math.min(stickyHeight, window.innerHeight)}px`

    const safeIndex = clamp(entry.currentIndex || 0, 0, Math.max(0, targets.length - 1))
    entry.currentIndex = safeIndex
    row.scrollLeft = targets[safeIndex] || 0
    setProgress(entry, safeIndex)
  }

  const snapTo = (entry, index) => {
    const target = entry.targets[index]
    if (target == null) return

    cancelSnap(entry)
    const start = entry.row.scrollLeft
    const delta = target - start

    setProgress(entry, index)

    if (Math.abs(delta) < 1) {
      entry.row.scrollLeft = target
      entry.animating = false
      schedule()
      return
    }

    /* Deliberate but quick: visibly snaps into place without looking like a
       hard pixel jump or a long sideways crawl. */
    const duration = 215
    const started = performance.now()
    entry.animating = true

    const frame = (now) => {
      const t = clamp((now - started) / duration, 0, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      entry.row.scrollLeft = start + delta * eased

      if (t < 1) {
        entry.snapRaf = window.requestAnimationFrame(frame)
      } else {
        entry.row.scrollLeft = target
        entry.snapRaf = 0
        entry.animating = false
        /* A fast finger/wheel gesture may have crossed another threshold while
           this snap was animating. Re-evaluate immediately so the sequence can
           advance one clean card at a time rather than skipping. */
        schedule()
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
    const progress = document.createElement('span')
    const progressThumb = document.createElement('i')

    scene.className = `mobile-hscene ${modifier}`
    sticky.className = 'mobile-hscene-sticky'
    progress.className = 'mobile-hscene-progress'
    progress.setAttribute('aria-hidden', 'true')
    progress.appendChild(progressThumb)

    parent.insertBefore(scene, row)
    scene.appendChild(sticky)
    sticky.appendChild(row)
    sticky.appendChild(progress)
    row.classList.add('is-scroll-driven')
    row.scrollLeft = 0

    const entry = {
      row,
      scene,
      sticky,
      progress,
      progressThumb,
      parent,
      nextSibling,
      distance: 0,
      targets: [],
      stepTravel: 78,
      travel: 0,
      currentIndex: 0,
      snapRaf: 0,
      animating: false,
      manualScrollHandler: null,
      manualScrollTimer: 0,
    }

    /* Manual horizontal swiping still works. Once the finger settles, sync the
       vertical snap state and progress indicator to the nearest card. */
    entry.manualScrollHandler = () => {
      if (entry.animating) return
      window.clearTimeout(entry.manualScrollTimer)
      entry.manualScrollTimer = window.setTimeout(() => {
        const index = nearestTargetIndex(entry)
        entry.currentIndex = index
        setProgress(entry, index)
      }, 90)
    }
    row.addEventListener('scroll', entry.manualScrollHandler, { passive: true })

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
      if (entry.targets.length <= 1 || entry.animating) return

      const stickyTop = Number.parseFloat(window.getComputedStyle(entry.sticky).top) || 0
      const sceneTop = entry.scene.getBoundingClientRect().top + scrollY
      const start = sceneTop - stickyTop
      const localTravel = scrollY - start
      const desiredIndex = clamp(
        Math.round(localTravel / Math.max(1, entry.stepTravel)),
        0,
        entry.targets.length - 1,
      )

      if (desiredIndex !== entry.currentIndex) {
        /* Never skip a card, even on a large wheel/touch momentum event. */
        const direction = Math.sign(desiredIndex - entry.currentIndex)
        const nextIndex = entry.currentIndex + direction
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

    /* Mobile Safari changes viewport height while its browser chrome expands
       and collapses. Ignore height-only resize events so a pinned scene never
       reconstructs in the middle of the user's gesture. */
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
