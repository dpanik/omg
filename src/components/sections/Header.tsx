import { useEffect, useState } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { site } from "@/data/site"

const NAV = [
  { href: "#services", label: "Услуги" },
  { href: "#booking", label: "Запись" },
  { href: "#reviews", label: "Отзывы" },
  { href: "#about", label: "О нас" },
  { href: "#contacts", label: "Контакты" },
]

export function Header() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [open])

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 md:px-8">
        <a href="#top" className="font-heading text-xl font-semibold md:text-2xl">
          {site.logo}
        </a>

        <nav aria-label="Основное меню" className="hidden md:block">
          <ul className="flex items-center gap-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="rounded-md text-sm font-medium transition-colors hover:text-primary focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden h-11 px-5 sm:inline-flex">
            <a href="#booking">Записаться</a>
          </Button>
          <Button
            variant="ghost"
            className="size-11 md:hidden"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-6" /> : <Menu className="size-6" />}
          </Button>
        </div>
      </div>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Мобильное меню"
          className="border-t border-border bg-background md:hidden"
        >
          <ul className="mx-auto flex max-w-6xl flex-col px-4 py-2">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex min-h-11 items-center rounded-md px-2 text-base font-medium hover:bg-muted"
                >
                  {item.label}
                </a>
              </li>
            ))}
            <li className="py-2">
              <Button asChild className="h-11 w-full">
                <a href="#booking" onClick={() => setOpen(false)}>
                  Записаться
                </a>
              </Button>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
