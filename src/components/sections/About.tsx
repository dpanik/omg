import { ArrowUpDown, Lightbulb, Sparkles } from "lucide-react"
import { PhotoPlaceholder } from "@/components/PhotoPlaceholder"
import { Section } from "@/components/Section"

const FEATURES = [
  { icon: Sparkles, text: "Две локации и сезонный декор" },
  { icon: Lightbulb, text: "Фотограф поможет с освещением и позированием" },
  { icon: ArrowUpDown, text: "Есть лифт" },
]

export function About() {
  return (
    <Section id="about" title="О студии">
      <div className="grid items-center gap-10 md:grid-cols-2">
        <ul className="flex flex-col gap-5">
          {FEATURES.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-4">
              <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-card text-primary shadow-sm">
                <Icon className="size-6" aria-hidden="true" />
              </span>
              <span className="text-lg">{text}</span>
            </li>
          ))}
        </ul>
        <PhotoPlaceholder label="Фото интерьера" />
      </div>
    </Section>
  )
}
