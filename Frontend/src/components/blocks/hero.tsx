import { Link } from "react-router-dom"

import { ProductIllustration } from "@/components/blocks/product-illustration"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-secondary to-background px-6 py-20 sm:py-28">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
            Beer, wine, and spirits at your door
          </h1>

          <p className="mt-6 text-lg text-muted-foreground text-balance sm:text-xl">
            Order from local shops and get it delivered in as little as 30
            minutes.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            <Button size="lg" asChild>
              <Link to="/shop">Start an order</Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/shop">Browse the menu</Link>
            </Button>
          </div>
        </div>

        <div className="hidden items-end justify-center gap-4 lg:flex">
          <ProductIllustration category="beer" className="h-40 w-auto drop-shadow-sm" />
          <ProductIllustration category="wine" className="h-56 w-auto drop-shadow-md" />
          <ProductIllustration category="spirits" className="h-44 w-auto drop-shadow-sm" />
        </div>
      </div>
    </section>
  )
}

export default Hero
