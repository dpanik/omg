import { Clock, MapPin, MessageCircle, Send, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/Section"
import { site } from "@/data/site"
import { waLink } from "@/lib/whatsapp"

const LINKS = [
  { href: waLink("Здравствуйте!"), label: "WhatsApp", icon: MessageCircle },
  { href: site.telegram, label: "Telegram", icon: Send },
  { href: site.vk, label: "VK", icon: Users },
]

export function Contacts() {
  return (
    <Section id="contacts" title="Контакты" className="bg-muted/60">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {LINKS.map(({ href, label, icon: Icon }) => (
              <Button key={label} asChild variant="outline" className="h-11 px-5">
                <a href={href} target="_blank" rel="noopener noreferrer">
                  <Icon aria-hidden="true" />
                  {label}
                </a>
              </Button>
            ))}
          </div>
          <p className="text-lg">
            WhatsApp:{" "}
            <a href={waLink("Здравствуйте!")} className="font-medium underline-offset-4 hover:underline">
              {site.whatsappDisplay}
            </a>
          </p>
          <ul className="flex flex-col gap-3">
            <li className="flex items-start gap-3">
              <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>
                {site.city}
                <br />
                Адрес: {site.address}
              </span>
            </li>
            <li className="flex items-start gap-3">
              <Clock className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
              <span>Режим работы: {site.hours}</span>
            </li>
          </ul>
        </div>

        {/* Вставить сюда iframe из карточки Яндекс Карт (Поделиться → Встроить карту),
            заменив этот блок. У iframe оставить className="aspect-video w-full rounded-(--radius)" */}
        <div className="flex aspect-video w-full items-center justify-center rounded-(--radius) border-2 border-dashed border-border bg-muted text-muted-foreground">
          Здесь будет карта
        </div>
      </div>
    </Section>
  )
}
