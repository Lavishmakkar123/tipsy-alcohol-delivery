import { ArrowRight, Beer, Martini, Wine } from "lucide-react"
import { Link } from "react-router-dom"

import type { ProductCategory } from "@/lib/types"

const LINKS: { category: ProductCategory; label: string; icon: typeof Beer }[] = [
  { category: "beer", label: "Beer delivery", icon: Beer },
  { category: "spirits", label: "Spirits delivery", icon: Martini },
  { category: "wine", label: "Wine delivery", icon: Wine },
]

export function DeliveryHighlight() {
  return (
    <section className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-12 sm:py-16 md:grid-cols-[minmax(0,260px)_1fr]">
      <div className="flex flex-col gap-3">
        {LINKS.map(({ category, label, icon: Icon }) => (
          <Link
            key={category}
            to={`/shop?category=${category}`}
            className="flex items-center gap-3 rounded-lg border bg-card p-4 transition hover:-translate-y-0.5 hover:bg-accent hover:shadow-md"
          >
            <Icon className="size-6 text-primary" />
            <span className="flex-1 text-sm font-medium">{label}</span>
            <ArrowRight className="size-4 text-muted-foreground" />
          </Link>
        ))}
      </div>

      <div className="flex items-center rounded-lg bg-muted/50 px-8 py-10 sm:py-0">
        <h2 className="text-3xl font-semibold uppercase leading-tight tracking-tight text-balance sm:text-5xl">
          Same-day delivery of beer, wine, and spirits
        </h2>
      </div>
    </section>
  )
}
