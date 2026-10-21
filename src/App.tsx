import { About } from "@/components/sections/About"
import { Booking } from "@/components/sections/Booking"
import { Contacts } from "@/components/sections/Contacts"
import { Footer } from "@/components/sections/Footer"
import { Header } from "@/components/sections/Header"
import { Hero } from "@/components/sections/Hero"
import { Reviews } from "@/components/sections/Reviews"
import { Services } from "@/components/sections/Services"

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Services />
        <Booking />
        <Reviews />
        <About />
        <Contacts />
      </main>
      <Footer />
    </>
  )
}
