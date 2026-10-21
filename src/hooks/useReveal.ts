import { useEffect, useRef, useState } from "react"

// Появление при прокрутке: срабатывает один раз
export function useReveal<T extends HTMLElement = HTMLDivElement>() {
  const ref = useRef<T>(null)
  // Без IntersectionObserver (старые браузеры) показываем сразу
  const [visible, setVisible] = useState(() => !("IntersectionObserver" in window))

  useEffect(() => {
    const el = ref.current
    if (!el || !("IntersectionObserver" in window)) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const className = `transition duration-700 ease-out motion-reduce:transition-none motion-reduce:opacity-100 motion-reduce:translate-y-0 ${
    visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
  }`

  return { ref, className }
}
