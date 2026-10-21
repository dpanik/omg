import { BookingCalendar } from "@/components/BookingCalendar"
import { Section } from "@/components/Section"

export function Booking() {
  return (
    <Section
      id="booking"
      title="Онлайн-запись"
      subtitle="Выберите услугу, дату и свободное время. Студия свяжется с вами, чтобы подтвердить запись."
    >
      <BookingCalendar />
    </Section>
  )
}
