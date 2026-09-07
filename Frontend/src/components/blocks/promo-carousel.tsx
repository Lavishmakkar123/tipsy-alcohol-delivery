import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRef } from "react"
import { Link } from "react-router-dom"

import { ProductIllustration } from "@/components/blocks/product-illustration"
import { Button } from "@/components/ui/button"
import type { ProductCategory } from "@/lib/types"

interface Slide {
  category: ProductCategory
  title: string
  subtitle: string
  bg: string
  fg: string
}

const SLIDES: Slide[] = [
  {
    category: "beer",
    title: "Stock the fridge",
    subtitle: "Local and import beer, delivered cold.",
    bg: "bg-gradient-to-br from-amber-100 to-amber-50 dark:from-amber-950/50 dark:to-amber-900/20",
    fg: "text-foreground",
  },
  {
    category: "spirits",
    title: "Stock up on spirits",
    subtitle: "Vodka, whisky, rum, gin — however you take it.",
    bg: "bg-gradient-to-br from-neutral-800 to-neutral-950",
    fg: "text-white",
  },
  {
    category: "wine",
    title: "Wine lovers rejoice",
    subtitle: "Reds, whites, and rosé for every occasion.",
    bg: "bg-gradient-to-br from-rose-950 to-neutral-900",
    fg: "text-white",
  },
]

export function PromoCarousel() {
  const scrollerRef = useRef<HTMLDivElement | null>(null)

  function scrollByAmount(direction: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: direction * el.clientWidth, behavior: "smooth" })
  }

  return (
    <section className="relative w-full py-8">
      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {SLIDES.map((slide) => (
          <div
            key={slide.category}
            className={`relative flex min-w-full shrink-0 snap-start items-center justify-center px-6 py-14 sm:py-20 ${slide.bg}`}
          >
            <div className="flex w-full max-w-6xl items-center justify-between">
              <div className={slide.fg}>
                <h3 className="text-2xl font-semibold tracking-tight sm:text-4xl">{slide.title}</h3>
                <p className="mt-2 max-w-[18rem] text-sm opacity-80 sm:text-base">{slide.subtitle}</p>
                <Button asChild className="mt-5" variant={slide.fg === "text-white" ? "secondary" : "default"}>
                  <Link to={`/shop?category=${slide.category}`}>Shop now</Link>
                </Button>
              </div>

              <div className="hidden items-end gap-2 opacity-90 sm:flex">
                <ProductIllustration category={slide.category} className="h-28 w-auto sm:h-40" />
                <ProductIllustration category={slide.category} className="h-40 w-auto sm:h-52" />
                <ProductIllustration category={slide.category} className="h-24 w-auto sm:h-36" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => scrollByAmount(-1)}
        aria-label="Previous"
        className="absolute left-4 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm sm:flex"
      >
        <ChevronLeft className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => scrollByAmount(1)}
        aria-label="Next"
        className="absolute right-4 top-1/2 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full border bg-background shadow-sm sm:flex"
      >
        <ChevronRight className="size-4" />
      </button>
    </section>
  )
}
