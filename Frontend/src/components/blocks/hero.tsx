import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-amber-50 to-background px-6 py-20 text-center dark:from-amber-950/20 sm:py-28">
      <div className="mx-auto flex max-w-2xl flex-col items-center">
        <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-6xl">
          Beer, wine, and spirits at your door
        </h1>

        <p className="mt-6 text-lg text-muted-foreground text-balance">
          Order from local shops and get it delivered in as little as 30
          minutes.
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/shop">Start an order</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/shop">Browse the menu</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

export default Hero
