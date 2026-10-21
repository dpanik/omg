// Данные студии. Здесь меняются контакты, адрес, режим работы и часы записи.
// Всё, что помечено «[уточнить у студии]», нужно заменить на данные от студии.

export const site = {
  name: "OMG. Studio, Store & School",
  logo: "OMG. Studio",
  // Номер для ссылок wa.me: только цифры, без «+»
  whatsapp: "79169333063",
  whatsappDisplay: "+7 916 933-30-63",
  telegram: "https://t.me/zafotostudio",
  vk: "https://vk.ru/zafoto.studio",
  city: "Москва, рядом с метро",
  address: "[уточнить у студии]",
  metro: "[уточнить у студии]",
  hours: "[уточнить у студии]",
  // Добавить ссылку на политику конфиденциальности, когда студия её даст
  privacyUrl: "",
}

// Временные значения, уточнить у студии.
// Должны совпадать с SLOTS в apps-script/Code.gs.
export const WORK_START = 10
export const WORK_END = 22

// Сегодня и ещё 13 дней
export const BOOKING_DAYS = 14

// Слоты по часу: 10:00 … 21:00
export const TIME_SLOTS: string[] = Array.from(
  { length: WORK_END - WORK_START },
  (_, i) => `${String(WORK_START + i).padStart(2, "0")}:00`
)
