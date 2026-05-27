import { gsap } from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import { onMounted, onUnmounted, ref } from 'vue'

gsap.registerPlugin(ScrollToPlugin)

export const useScrollToTop = (offset = 300) => {

  const showScrollTop = ref<boolean>(false)

  const handleScroll= () => {
    showScrollTop.value = window.scrollY >= offset
  }

  const scrollToTop = () => {
    gsap.to(window, {
      duration: 1,
      scrollTo: { y: 0 },
      ease: 'power2.out',
    })
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  return {
    showScrollTop,
    scrollToTop
  }
}
