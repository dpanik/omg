// Отзывы публикуются с согласия студии.
// Пока согласия нет, здесь заглушки. Тексты настоящих отзывов — в omg-studio-site/brief.md.

export type Review = {
  text: string
  author: string
}

const PLACEHOLDER: Review = {
  text: "Здесь будет отзыв клиента. Добавим после согласования со студией.",
  author: "Имя клиента",
}

export const reviews: Review[] = [PLACEHOLDER, PLACEHOLDER, PLACEHOLDER, PLACEHOLDER]
