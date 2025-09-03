export function useAnimations() {
  const onEnter = (el, done) => {
    const index = parseInt(el.dataset.index) || 0

    // Initial state
    el.style.opacity = '0'
    el.style.transform = 'translateY(30px)'
    el.style.transition = 'all 0.6s ease'

    // Animate in with staggered delay
    setTimeout(() => {
      el.style.opacity = '1'
      el.style.transform = 'translateY(0)'
    }, index * 100)

    setTimeout(done, 600 + (index * 100))
  }

  const onLeave = (el, done) => {
    el.style.transition = 'all 0.3s ease'
    el.style.opacity = '0'
    el.style.transform = 'translateY(-20px)'

    setTimeout(done, 300)
  }

  return {
    onEnter,
    onLeave
  }
}
