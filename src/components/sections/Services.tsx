import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "@/components/Section"
import { services } from "@/data/services"
import { waLink } from "@/lib/whatsapp"

export function Services() {
  return (
    <Section id="services" title="Услуги">
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {services.map(({ title, description, icon: Icon }) => (
          <li key={title}>
            <Card className="h-full gap-4 rounded-(--radius) shadow-sm ring-border transition hover:-translate-y-1 hover:shadow-md motion-reduce:transition-none motion-reduce:hover:translate-y-0 [--card-spacing:--spacing(5)]">
              <CardHeader className="gap-4">
                <span className="flex size-12 items-center justify-center rounded-full bg-muted text-primary">
                  <Icon className="size-6" aria-hidden="true" />
                </span>
                <CardTitle className="text-lg font-semibold">{title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 text-muted-foreground">{description}</CardContent>
              <CardFooter className="border-0 bg-transparent pt-0">
                <Button asChild variant="outline" className="h-11 w-full">
                  <a
                    href={waLink(`Здравствуйте, интересует ${title}`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Узнать цену
                  </a>
                </Button>
              </CardFooter>
            </Card>
          </li>
        ))}
      </ul>
    </Section>
  )
}
