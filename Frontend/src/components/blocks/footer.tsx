import { Beer } from "lucide-react"
import { Link } from "react-router-dom"

import { CATEGORIES } from "@/lib/products"

export function Footer() {
  return (
    <footer className="border-t">
      <div className="mx-auto max-w-6xl px-6 py-12 text-sm text-muted-foreground sm:py-16">
        <div className="flex flex-col justify-between gap-10 sm:flex-row">
          <div className="max-w-xs">
            <div className="flex items-center gap-2 text-base font-semibold text-foreground">
              <Beer className="size-5 text-amber-700 dark:text-amber-400" />
              Tipsy
            </div>
            <p className="mt-2">Beer, wine, and spirits delivered to your door.</p>
          </div>

          <div className="flex flex-col gap-2">
            <span className="font-medium text-foreground">Shop</span>
            {CATEGORIES.map(({ id, label }) => (
              <Link key={id} to={`/shop?category=${id}`} className="transition hover:text-foreground">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <p className="mt-10 border-t pt-6">
          Please enjoy responsibly. You must be 19+ to order. ID is checked
          on delivery.
        </p>
      </div>
    </footer>
  )
}
