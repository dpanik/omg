import { Star } from "lucide-react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Section } from "@/components/Section"
import { reviews } from "@/data/reviews"

export function Reviews() {
  return (
    <Section id="reviews" title="Отзывы" className="bg-muted/60">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {reviews.map((review, i) => (
          <li key={i}>
            <Card className="h-full gap-4 rounded-(--radius) shadow-sm ring-border transition hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 [--card-spacing:--spacing(5)]">
              <CardContent className="flex flex-1 flex-col gap-4">
                <div className="flex gap-1" role="img" aria-label="Оценка 5 из 5">
                  {Array.from({ length: 5 }, (_, i) => (
                    <Star key={i} className="size-4 fill-primary text-primary" aria-hidden="true" />
                  ))}
                </div>
                <blockquote className="text-base">«{review.text}»</blockquote>
              </CardContent>
              <CardFooter className="border-0 bg-transparent pt-0 font-medium">
                {review.author}
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
      <p className="mt-8 flex items-center gap-2 font-medium">
        <Star className="size-5 fill-primary text-primary" aria-hidden="true" />
        Рейтинг 5.0 на Яндекс Картах
      </p>
    </Section>
  )
}
