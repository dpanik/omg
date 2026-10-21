import type { ReactNode } from "react"
import { useReveal } from "@/hooks/useReveal"
import { cn } from "@/lib/utils"

// Обёртка секции: якорь, отступы, контейнер и появление при прокрутке
export function Section({
  id,
  title,
  subtitle,
  className,
  children,
}: {
  id: string
  title?: string
  subtitle?: string
  className?: string
  children: ReactNode
}) {
  const { ref, className: revealClass } = useReveal()

  return (
    <section id={id} className={cn("scroll-mt-20 py-14 md:py-24", className)}>
      <div ref={ref} className={cn("mx-auto max-w-6xl px-4 md:px-8", revealClass)}>
        {title && (
          <div className="mb-8 max-w-2xl md:mb-12">
            <h2 className="text-3xl font-semibold md:text-4xl">{title}</h2>
            {subtitle && <p className="mt-3 text-muted-foreground md:text-lg">{subtitle}</p>}
          </div>
        )}
        {children}
      </div>
    </section>
  )
}
