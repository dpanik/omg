import { ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

// Заглушка под фото. Когда студия даст снимки, заменить на <img src="..." alt="..." />
// (файлы положить в public/).
export function PhotoPlaceholder({
  label,
  className,
}: {
  label: string
  className?: string
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={cn(
        "flex min-h-64 flex-col items-center justify-center gap-3 rounded-(--radius) border-2 border-dashed border-border bg-muted text-muted-foreground md:min-h-96",
        className
      )}
    >
      <ImageIcon className="size-10" aria-hidden="true" />
      <span className="text-sm">{label}</span>
    </div>
  )
}
