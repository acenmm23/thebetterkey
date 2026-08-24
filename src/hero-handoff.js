const clamp01 = (value) => Math.min(1, Math.max(0, value))

function initHeroHandoff() {
  const poster = document.querySelector('.hero-title-scroll')
  const compact = document.querySelector('.hero-compact-line')
  if (!poster || !compact) return

  const words = Array.from(compact.querySelectorAll('span'))
  const desktop = window.matchMedia('(min-width: 901px)')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  let raf = 0

  const reset = () => {
    poster.style.setProperty('--safe-poster-scale', '1')
    poster.style.setProperty('--safe-poster-opacity', '1')
    compact.style.setProperty('--safe-line-opacity', '0')
    compact.style.setProperty('--safe-line-y', '12px')
    words.forEach((word) => {
      word.style.setProperty('--safe-word-opacity', '0')
      word.style.setProperty('--safe-word-y', '10px')
    })
  }

  const update = () => {
    raf = 0

    if (!desktop.matches || reduced.matches) {
      reset()
      return
    }

    const y = window.scrollY
    const vh = window.innerHeight

    // Keep the poster hero full-size for the opening beat.
    const settleStart = Math.max(150, vh * 0.16)
    const handoffStart = settleStart + vh * 0.16
    const handoffEnd = settleStart + vh * 0.38
    const fadeStart = settleStart + vh * 0.92
    const fadeEnd = settleStart + vh * 1.08

    const settle = clamp01((y - settleStart) / Math.max(1, handoffStart - settleStart))
    const handoff = clamp01((y - handoffStart) / Math.max(1, handoffEnd - handoffStart))
    const compactOut = 1 - clamp01((y - fadeStart) / Math.max(1, fadeEnd - fadeStart))

    const posterScale = 1 - 0.14 * settle
    const posterOpacity = 1 - handoff
    const lineOpacity = handoff * compactOut
    const lineY = 14 * (1 - handoff)

    poster.style.setProperty('--safe-poster-scale', posterScale.toFixed(4))
    poster.style.setProperty('--safe-poster-opacity', posterOpacity.toFixed(4))
    compact.style.setProperty('--safe-line-opacity', lineOpacity.toFixed(4))
    compact.style.setProperty('--safe-line-y', `${lineY.toFixed(2)}px`)

    words.forEach((word, index) => {
      const wordProgress = clamp01((handoff - index * 0.065) / 0.42)
      word.style.setProperty('--safe-word-opacity', wordProgress.toFixed(4))
      word.style.setProperty('--safe-word-y', `${(1 - wordProgress) * 10}px`)
    })
  }

  const schedule = () => {
    if (raf) return
    raf = window.requestAnimationFrame(update)
  }

  reset()
  update()
  window.addEventListener('scroll', schedule, { passive: true })
  window.addEventListener('resize', schedule)
  desktop.addEventListener?.('change', schedule)
  reduced.addEventListener?.('change', schedule)
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHeroHandoff, { once: true })
} else {
  initHeroHandoff()
}
