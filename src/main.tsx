import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)

// Убрать экран загрузки после монтирования
function hideSplash() {
  const splash = document.getElementById("splash")
  if (!splash) return
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    splash.remove()
    return
  }
  splash.classList.add("splash-hide")
  splash.addEventListener("transitionend", () => splash.remove(), { once: true })
  setTimeout(() => splash.remove(), 500)
}

setTimeout(hideSplash, 0)
