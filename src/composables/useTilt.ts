import { ref, onMounted, onBeforeUnmount } from 'vue'

export function useTilt(maxDeg = 7) {
  const elRef = ref<HTMLElement | null>(null)

  function onMove(e: MouseEvent) {
    const el = elRef.value
    if (!el) return
    const r = el.getBoundingClientRect()
    const x = ((e.clientX - r.left) / r.width - 0.5) * 2
    const y = ((e.clientY - r.top) / r.height - 0.5) * 2
    el.style.transition = 'transform 0.08s ease'
    el.style.transform = `perspective(700px) rotateX(${-y * maxDeg}deg) rotateY(${x * maxDeg}deg) translateZ(8px)`
    const hl = el.querySelector<HTMLElement>('.spec-hl')
    if (hl) {
      hl.style.background = `radial-gradient(circle at ${((x + 1) / 2) * 100}% ${((y + 1) / 2) * 100}%, rgba(255,255,255,0.14) 0%, transparent 58%)`
    }
  }

  function onLeave() {
    const el = elRef.value
    if (!el) return
    el.style.transition = 'transform 0.55s cubic-bezier(0.34,1.56,0.64,1)'
    el.style.transform = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
    const hl = el.querySelector<HTMLElement>('.spec-hl')
    if (hl) hl.style.background = 'transparent'
  }

  onMounted(() => {
    elRef.value?.addEventListener('mousemove', onMove)
    elRef.value?.addEventListener('mouseleave', onLeave)
  })

  onBeforeUnmount(() => {
    elRef.value?.removeEventListener('mousemove', onMove)
    elRef.value?.removeEventListener('mouseleave', onLeave)
  })

  return { elRef }
}
