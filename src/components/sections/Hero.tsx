import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder"
import { useReveal } from "@/hooks/useReveal"
import { cn } from "@/lib/utils"

export function Hero() {
  const { ref, className: revealClass } = useReveal()

  return (
    <section id="top" className="scroll-mt-20 py-14 md:py-24">
      <div
        ref={ref}
        className={cn(
          "mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-8",
          revealClass
        )}
      >
        <div>
          <h1 className="text-4xl leading-tight font-semibold md:text-6xl">
            Фотостудия с двумя локациями и сезонным декором
          </h1>
          <p className="mt-5 text-lg text-muted-foreground md:text-xl">
            Семейные, детские и предметные съёмки. Фотограф поможет с освещением и позированием.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button asChild className="h-12 px-6 text-base">
              <a href="#booking">Записаться</a>
            </Button>
            <Button asChild variant="outline" className="h-12 px-6 text-base">
              <a href="#services">Смотреть услуги</a>
            </Button>
          </div>
          <p className="mt-6 flex items-center gap-2 text-sm font-medium">
            <Star className="size-4 fill-primary text-primary" aria-hidden="true" />
            5.0 на Яндекс Картах
          </p>
        </div>
        <PhotoPlaceholder label="Фото студии" />
      </div>
    </section>
  )
}
