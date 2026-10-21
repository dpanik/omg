import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { addDays, format } from "date-fns"
import { ru } from "date-fns/locale"
import { CheckCircle2, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { services } from "@/data/services"
import { BOOKING_DAYS, TIME_SLOTS, site } from "@/data/site"
import { IS_DEMO, getBusySlots, sendBooking, type BusySlot } from "@/lib/bookingApi"
import { moscowNow, parseDay } from "@/lib/moscowTime"
import { cn } from "@/lib/utils"
import { waLink } from "@/lib/whatsapp"

const RELOAD_MS = 3 * 60 * 1000

type Status = "idle" | "loading" | "success" | "error"
type Field = "service" | "date" | "time" | "name" | "phone" | "consent"
type FieldErrors = Partial<Record<Field, string>>

function isValidPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "")
  if (digits.length === 11) return digits[0] === "7" || digits[0] === "8"
  if (digits.length === 10) return digits[0] === "9"
  return false
}

function toDisplayDate(value: string): string {
  return format(parseDay(value), "dd.MM.yyyy")
}

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="mt-1.5 text-sm text-primary">
      {message}
    </p>
  )
}

export function BookingCalendar() {
  const [service, setService] = useState("")
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [comment, setComment] = useState("")
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState("")
  const [status, setStatus] = useState<Status>("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const [networkError, setNetworkError] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const [busy, setBusy] = useState<BusySlot[]>([])
  const [slotsState, setSlotsState] = useState<"loading" | "ready" | "error">("loading")
  const [hasData, setHasData] = useState(false)
  const [now, setNow] = useState(moscowNow)
  const abortRef = useRef<AbortController | null>(null)
  const successRef = useRef<HTMLHeadingElement>(null)

  // После отправки показать и озвучить экран успеха: он короче формы, страница сдвигается
  useEffect(() => {
    if (status !== "success") return
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    successRef.current?.focus({ preventScroll: true })
    successRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" })
  }, [status])

  const loadSlots = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    try {
      const slots = await getBusySlots(controller.signal)
      if (controller.signal.aborted) return
      setNow(moscowNow())
      setBusy(slots)
      setHasData(true)
      setSlotsState("ready")
    } catch {
      if (controller.signal.aborted) return
      setNow(moscowNow())
      setSlotsState("error")
    }
  }, [])

  useEffect(() => {
    loadSlots()
    const timer = setInterval(loadSlots, RELOAD_MS)
    const onVisible = () => {
      if (document.visibilityState === "visible") loadSlots()
    }
    document.addEventListener("visibilitychange", onVisible)
    return () => {
      clearInterval(timer)
      document.removeEventListener("visibilitychange", onVisible)
      abortRef.current?.abort()
    }
  }, [loadSlots])

  // Дни, доступные для записи: сегодня и ещё BOOKING_DAYS − 1
  const days = useMemo(() => {
    const first = parseDay(now.date)
    return Array.from({ length: BOOKING_DAYS }, (_, i) => format(addDays(first, i), "yyyy-MM-dd"))
  }, [now.date])

  const busyIndex = useMemo(() => {
    const times = new Map<string, Set<string>>()
    const fullDays = new Set<string>()
    for (const slot of busy) {
      if (!slot.time) {
        fullDays.add(slot.date)
        continue
      }
      if (!times.has(slot.date)) times.set(slot.date, new Set())
      times.get(slot.date)!.add(slot.time)
    }
    return { times, fullDays }
  }, [busy])

  const slotState = useCallback(
    (day: string, slot: string): "free" | "busy" | "past" => {
      if (busyIndex.fullDays.has(day) || busyIndex.times.get(day)?.has(slot)) return "busy"
      if (day === now.date && Number(slot.slice(0, 2)) <= now.hour) return "past"
      return "free"
    },
    [busyIndex, now]
  )

  const isDayDisabled = useCallback(
    (value: Date) => {
      const day = format(value, "yyyy-MM-dd")
      if (!days.includes(day)) return true
      if (!hasData) return false
      return TIME_SLOTS.every((slot) => slotState(day, slot) !== "free")
    },
    [days, hasData, slotState]
  )

  // Если после обновления выбранное время заняли, выбор не засчитывается
  const timeTaken = !!date && !!time && slotState(date, time) !== "free"
  const selectedTime = timeTaken ? "" : time

  const clearFieldError = (field: Field) =>
    setFieldErrors((prev) => (prev[field] ? { ...prev, [field]: undefined } : prev))

  const bookingText = () =>
    `Здравствуйте! Оставил(а) заявку на сайте: ${service}, ${date ? toDisplayDate(date) : ""}, ${selectedTime}. Имя: ${name.trim()}.`

  function validate(): FieldErrors {
    const errors: FieldErrors = {}
    if (!service) errors.service = "Выберите услугу"
    if (!date) errors.date = "Выберите дату"
    if (!selectedTime) errors.time = "Выберите время"
    if (!name.trim()) errors.name = "Введите имя"
    if (!isValidPhone(phone)) errors.phone = "Введите телефон, например +7 916 123-45-67"
    if (!consent) errors.consent = "Нужно согласие на обработку данных"
    return errors
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const errors = validate()
    setFieldErrors(errors)
    if (Object.keys(errors).length > 0) return

    setStatus("loading")
    setErrorMessage("")
    setNetworkError(false)
    try {
      const result = await sendBooking({
        date,
        time: selectedTime,
        service,
        name: name.trim(),
        phone: phone.trim(),
        comment: comment.trim(),
        website,
      })
      if (result.ok) {
        setStatus("success")
      } else {
        setStatus("error")
        setErrorMessage(result.error)
        loadSlots()
      }
    } catch {
      setStatus("error")
      setNetworkError(true)
      setErrorMessage("Не удалось отправить заявку.")
    }
  }

  function resetForm() {
    setService("")
    setDate("")
    setTime("")
    setName("")
    setPhone("")
    setComment("")
    setConsent(false)
    setWebsite("")
    setStatus("idle")
    setErrorMessage("")
    setNetworkError(false)
    setFieldErrors({})
    loadSlots()
  }

  if (status === "success") {
    return (
      <Card className="items-center gap-5 rounded-(--radius) px-5 py-10 text-center shadow-sm ring-border md:py-14">
        <CheckCircle2 className="size-12 text-primary" aria-hidden="true" />
        <h3
          ref={successRef}
          tabIndex={-1}
          className="scroll-mt-28 text-2xl font-semibold outline-none"
        >
          Заявка отправлена
        </h3>
        <p className="max-w-md text-base text-muted-foreground">
          Студия свяжется с вами, чтобы подтвердить запись.
        </p>
        <div className="flex w-full max-w-md flex-col gap-3 sm:flex-row sm:justify-center">
          <Button asChild className="h-11 px-5">
            <a href={waLink(bookingText())} target="_blank" rel="noopener noreferrer">
              <MessageCircle aria-hidden="true" />
              Написать в WhatsApp
            </a>
          </Button>
          <Button variant="outline" className="h-11 px-5" onClick={resetForm}>
            Новая заявка
          </Button>
        </div>
      </Card>
    )
  }

  const today = parseDay(days[0])
  const lastDay = parseDay(days[days.length - 1])

  return (
    <Card className="rounded-(--radius) px-4 py-6 shadow-sm ring-border md:px-8 md:py-8">
      <form onSubmit={handleSubmit} noValidate className="relative flex flex-col gap-8">
        <div className="grid gap-8 md:grid-cols-[auto_1fr] md:grid-rows-[auto_1fr] md:gap-x-10 md:gap-y-6">
          {/* Услуга: на телефоне первая, на компьютере справа сверху */}
          <div className="md:col-start-2 md:row-start-1">
            <Label htmlFor="service" className="mb-2">
              Услуга
            </Label>
            <Select
              value={service}
              onValueChange={(value) => {
                setService(value)
                clearFieldError("service")
              }}
            >
              <SelectTrigger
                id="service"
                aria-invalid={!!fieldErrors.service}
                aria-describedby={fieldErrors.service ? "service-error" : undefined}
                className="w-full bg-card data-[size=default]:h-11"
              >
                <SelectValue placeholder="Выберите услугу" />
              </SelectTrigger>
              <SelectContent>
                {services.map((item) => (
                  <SelectItem key={item.title} value={item.title} className="min-h-10">
                    {item.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError id="service-error" message={fieldErrors.service} />
          </div>

          {/* Дата */}
          <div className="md:col-start-1 md:row-span-2 md:row-start-1">
            <p id="date-label" className="mb-3 text-sm font-medium">
              Дата
            </p>
            <Calendar
              mode="single"
              locale={ru}
              weekStartsOn={1}
              selected={date ? parseDay(date) : undefined}
              onSelect={(value) => {
                setDate(value ? format(value, "yyyy-MM-dd") : "")
                setTime("")
                clearFieldError("date")
              }}
              disabled={isDayDisabled}
              defaultMonth={today}
              startMonth={today}
              endMonth={lastDay}
              aria-labelledby="date-label"
              className="mx-auto bg-transparent p-0 [--cell-size:--spacing(9)] sm:[--cell-size:--spacing(10.5)] md:mx-0"
            />
            <FieldError id="date-error" message={fieldErrors.date} />
          </div>

          {/* Время */}
          <div className="md:col-start-2 md:row-start-2">
            <p id="time-label" className="mb-3 text-sm font-medium">
              Время
            </p>

            {slotsState === "loading" && !hasData && (
              <p className="text-sm text-muted-foreground">Загружаем свободное время…</p>
            )}
            {slotsState === "error" && (
              <p className="mb-3 text-sm">
                Не удалось загрузить время.{" "}
                <a
                  href={waLink("Здравствуйте! Хочу записаться.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-primary underline underline-offset-4"
                >
                  Напишите нам в WhatsApp
                </a>
              </p>
            )}

            {hasData && !date && (
              <p className="text-sm text-muted-foreground">Сначала выберите дату</p>
            )}

            {hasData && date && (
              <div
                role="group"
                aria-labelledby="time-label"
                className="grid grid-cols-3 gap-2 md:grid-cols-4"
              >
                {TIME_SLOTS.map((slot) => {
                  const state = slotState(date, slot)
                  const selected = selectedTime === slot
                  return (
                    <Button
                      key={slot}
                      type="button"
                      variant={selected ? "default" : "outline"}
                      disabled={state !== "free"}
                      aria-pressed={selected}
                      aria-label={
                        state === "busy"
                          ? `${slot}, занято`
                          : state === "past"
                            ? `${slot}, недоступно`
                            : slot
                      }
                      onClick={() => {
                        setTime(slot)
                        clearFieldError("time")
                      }}
                      className={cn(
                        "h-11 text-base",
                        state !== "busy" && !selected && "bg-card",
                        state === "busy" &&
                          "bg-muted text-muted-foreground line-through disabled:opacity-100"
                      )}
                    >
                      {slot}
                    </Button>
                  )
                })}
              </div>
            )}

            {timeTaken && (
              <p className="mt-3 text-sm text-primary">Это время только что заняли, выберите другое</p>
            )}
            <FieldError id="time-error" message={fieldErrors.time} />

            {hasData && date && (
              <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-2">
                  <span className="size-4 rounded border border-border bg-card" aria-hidden="true" />
                  свободно
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-4 rounded bg-primary" aria-hidden="true" />
                  выбрано
                </li>
                <li className="flex items-center gap-2">
                  <span className="size-4 rounded bg-muted ring-1 ring-border" aria-hidden="true" />
                  <span className="line-through">занято</span>
                </li>
              </ul>
            )}
          </div>
        </div>

        {/* Контакты */}
        <div className="flex flex-col gap-5 border-t border-border pt-8">
          {IS_DEMO && (
            <p className="self-start rounded-md bg-muted px-3 py-1.5 text-sm text-muted-foreground">
              Демо-режим: заявки не сохраняются
            </p>
          )}

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <Label htmlFor="name" className="mb-2">
                Имя
              </Label>
              <Input
                id="name"
                name="name"
                autoComplete="name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  clearFieldError("name")
                }}
                aria-invalid={!!fieldErrors.name}
                aria-describedby={fieldErrors.name ? "name-error" : undefined}
                className="h-11 bg-card text-base"
              />
              <FieldError id="name-error" message={fieldErrors.name} />
            </div>
            <div>
              <Label htmlFor="phone" className="mb-2">
                Телефон
              </Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                placeholder="+7"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value)
                  clearFieldError("phone")
                }}
                aria-invalid={!!fieldErrors.phone}
                aria-describedby={fieldErrors.phone ? "phone-error" : undefined}
                className="h-11 bg-card text-base"
              />
              <FieldError id="phone-error" message={fieldErrors.phone} />
            </div>
          </div>

          <div>
            <Label htmlFor="comment" className="mb-2">
              Комментарий <span className="font-normal text-muted-foreground">(необязательно)</span>
            </Label>
            <Textarea
              id="comment"
              name="comment"
              rows={3}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="bg-card text-base"
            />
          </div>

          {/* Ловушка для ботов: людям не видна */}
          <div className="absolute -left-[9999px] h-px w-px overflow-hidden" aria-hidden="true">
            <label htmlFor="website">Сайт</label>
            <input
              id="website"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          <div>
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                checked={consent}
                onCheckedChange={(value) => {
                  setConsent(value === true)
                  clearFieldError("consent")
                }}
                aria-invalid={!!fieldErrors.consent}
                aria-describedby={fieldErrors.consent ? "consent-error" : undefined}
                className="mt-0.5 size-5"
              />
              <Label htmlFor="consent" className="leading-snug font-normal">
                {site.privacyUrl ? (
                  <span>
                    Я согласен(на) на{" "}
                    <a
                      href={site.privacyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline underline-offset-4"
                    >
                      обработку персональных данных
                    </a>
                  </span>
                ) : (
                  "Я согласен(на) на обработку персональных данных"
                )}
              </Label>
            </div>
            <FieldError id="consent-error" message={fieldErrors.consent} />
          </div>

          {status === "error" && errorMessage && (
            <p role="alert" className="text-sm text-primary">
              {errorMessage}{" "}
              {networkError && (
                <a
                  href={waLink(bookingText())}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium underline underline-offset-4"
                >
                  Напишите нам в WhatsApp
                </a>
              )}
            </p>
          )}

          <Button type="submit" disabled={status === "loading"} className="h-12 w-full text-base">
            {status === "loading" ? "Отправляем…" : "Отправить заявку"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
