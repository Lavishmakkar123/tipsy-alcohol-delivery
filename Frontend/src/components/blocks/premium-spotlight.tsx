import { Link } from "react-router-dom"

import { ProductIllustration } from "@/components/blocks/product-illustration"
import { Button } from "@/components/ui/button"

export function PremiumSpotlight() {
  return (
    <section className="relative overflow-hidden bg-neutral-950 px-6 py-20 text-white sm:py-28">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 sm:flex-row sm:justify-between">
        <div className="text-center sm:text-left">
          <span className="text-sm font-medium text-primary">Alcohol</span>
          <h2 className="mt-3 text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
            Top shelf, delivered.
          </h2>
          <p className="mt-4 max-w-md text-white/70 text-balance">
            Reserve Blended Scotch — aged for depth, with dried fruit and oak
            on a long, warm finish. One of the picks in our premium spirits
            lineup.
          </p>
          <Button size="lg" variant="secondary" className="mt-8" asChild>
            <Link to="/shop?category=spirits">Shop premium spirits</Link>
          </Button>
        </div>

        <div className="flex items-end gap-3 opacity-90">
          <ProductIllustration category="spirits" className="h-40 w-auto sm:h-56" />
          <ProductIllustration category="wine" className="h-32 w-auto sm:h-44" />
        </div>
      </div>
    </section>
  )
}
