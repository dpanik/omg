import { addDays, format } from "date-fns"
import { moscowNow, parseDay } from "@/lib/moscowTime"

export const BOOKING_URL: string = import.meta.env.VITE_BOOKING_URL ?? ""
export const IS_DEMO = BOOKING_URL === ""

// time = "" — занят весь день
export type BusySlot = { date: string; time: string; status: string }

export type BookingRequest = {
  date: string
  time: string
  service: string
  name: string
  phone: string
  comment: string
  website: string
}

export type BookingResponse = { ok: true } | { ok: false; error: string }

function demoBusySlots(): BusySlot[] {
  const today = parseDay(moscowNow().date)
  const day = (n: number) => format(addDays(today, n), "yyyy-MM-dd")
  return [
    { date: day(0), time: "18:00", status: "записан" },
    { date: day(1), time: "11:00", status: "записан" },
    { date: day(1), time: "15:00", status: "занято" },
    { date: day(2), time: "", status: "занято" },
    { date: day(3), time: "12:00", status: "записан" },
    { date: day(4), time: "19:00", status: "занято" },
  ]
}

export async function getBusySlots(signal?: AbortSignal): Promise<BusySlot[]> {
  if (IS_DEMO) return demoBusySlots()

  const res = await fetch(BOOKING_URL, { signal })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  const data: unknown = await res.json()
  if (!Array.isArray(data)) throw new Error("Неверный ответ")
  return data.map((row) => ({
    date: String(row?.date ?? ""),
    time: String(row?.time ?? ""),
    status: String(row?.status ?? ""),
  }))
}

export async function sendBooking(data: BookingRequest): Promise<BookingResponse> {
  if (IS_DEMO) {
    await new Promise((resolve) => setTimeout(resolve, 600))
    return { ok: true }
  }

  // text/plain, а не application/json: иначе браузер отправит
  // предварительный CORS-запрос, а Google Apps Script его не поддерживает.
  const res = await fetch(BOOKING_URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify(data),
  })
  const json = (await res.json()) as BookingResponse
  if (typeof json?.ok !== "boolean") throw new Error("Неверный ответ")
  return json
}
