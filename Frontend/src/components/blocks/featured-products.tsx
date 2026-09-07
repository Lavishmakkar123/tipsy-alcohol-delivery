import { ProductCard } from "@/components/blocks/product-card"
import { PRODUCTS } from "@/lib/products"

const FEATURED_IDS = [
  "beer-harvest-pale-ale",
  "wine-cabernet-reserve",
  "spirits-highland-style-whisky",
  "cider-citrus-hard-seltzer",
]

export function FeaturedProducts() {
  const featured = FEATURED_IDS.map((id) => PRODUCTS.find((p) => p.id === id)!)

  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <h2 className="text-2xl font-semibold tracking-tight">Popular right now</h2>

      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {featured.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  )
}
