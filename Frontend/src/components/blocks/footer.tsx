import { Beer } from "lucide-react"
import { Link } from "react-router-dom"

import { CATEGORIES } from "@/lib/products"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-16 text-sm text-muted-foreground sm:py-20">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-[1.5fr_1fr_1fr]">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Beer className="size-5 text-primary" />
              Tipsy
            </div>
            <p className="mt-3">Beer, wine, and spirits delivered to your door.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Shop</span>
            {CATEGORIES.map(({ id, label }) => (
              <Link key={id} to={`/shop?category=${id}`} className="transition hover:text-foreground">
                {label}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Delivery</span>
            <p>Same-day, most orders in 30 minutes.</p>
            <p>ID checked at the door — must be 19+.</p>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Tipsy. Please enjoy responsibly.</p>
          <p>Made in Waterloo Region, Ontario.</p>
        </div>
      </div>
    </footer>
  )
}
