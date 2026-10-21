// Список услуг: используется в секции «Услуги» и в выборе услуги при записи.
import {
  Baby,
  Camera,
  GraduationCap,
  Music,
  Package,
  Palette,
  Users,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react"

export type Service = {
  title: string
  description: string
  icon: LucideIcon
}

export const services: Service[] = [
  {
    title: "Фотоуслуги и аренда фотостудии",
    description: "Зал для вашей съёмки: две локации, свет и реквизит.",
    icon: Camera,
  },
  {
    title: "Предметная съёмка и бизнес-фото",
    description: "Фото товаров, контент для соцсетей и портреты для работы.",
    icon: Package,
  },
  {
    title: "Семейные фотосессии",
    description: "Съёмка для всей семьи, от малышей до бабушек и дедушек.",
    icon: Users,
  },
  {
    title: "Детские тематические фотосессии",
    description: "Сезонные декорации и реквизит для детских образов.",
    icon: Baby,
  },
  {
    title: "Выпускные альбомы",
    description: "Альбомы для выпускников детского сада и школы.",
    icon: GraduationCap,
  },
  {
    title: "Фуд-фотосъёмка",
    description: "Кадры блюд для меню, сайта и соцсетей.",
    icon: UtensilsCrossed,
  },
  {
    title: "Мастер-классы",
    description: "Занятия в студии. Темы и расписание: [уточнить у студии].",
    icon: Palette,
  },
  {
    title: "Класс фортепиано",
    description: "Занятия фортепиано. Формат и расписание: [уточнить у студии].",
    icon: Music,
  },
]
