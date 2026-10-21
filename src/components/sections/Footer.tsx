import { site } from "@/data/site"

const YEAR = new Date().getFullYear()

export function Footer() {
  return (
    <footer className="border-t border-border py-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between md:px-8">
        <p>
          © {YEAR} {site.name}
        </p>
        <a
          href="#top"
          className="inline-flex min-h-11 items-center font-medium text-foreground hover:text-primary"
        >
          Вверх ↑
        </a>
      </div>
    </footer>
  )
}
