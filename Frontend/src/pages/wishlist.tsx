import { Link } from "react-router-dom"

import { ProductCard } from "@/components/blocks/product-card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useWishlist } from "@/context/wishlist-context"
import { PRODUCTS } from "@/lib/products"

export default function WishlistPage() {
  const { user } = useAuth()
  const { productIds, loading } = useWishlist()

  if (!user) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Sign in to see your wishlist</h1>
        <p className="mt-2 text-muted-foreground">
          Save products you like and find them here later.
        </p>
        <Button asChild className="mt-6">
          <Link to="/shop">Browse the shop</Link>
        </Button>
      </div>
    )
  }

  const products = PRODUCTS.filter((p) => productIds.has(p.id))

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Your wishlist</h1>

      {loading ? (
        <p className="mt-8 text-muted-foreground">Loading…</p>
      ) : products.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="text-muted-foreground">Nothing saved yet.</p>
          <Button asChild className="mt-6">
            <Link to="/shop">Browse the shop</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}
