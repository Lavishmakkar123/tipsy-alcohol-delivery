import { Heart, Minus, Plus } from "lucide-react"
import { Link, useParams } from "react-router-dom"

import { ProductIllustration } from "@/components/blocks/product-illustration"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import { PRODUCTS } from "@/lib/products"

export default function ProductPage() {
  const { id } = useParams()
  const product = PRODUCTS.find((p) => p.id === id)
  const { items, addToCart, setQuantity } = useCart()
  const { user } = useAuth()
  const { productIds, toggle } = useWishlist()

  if (!product) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Back to shop</Link>
        </Button>
      </div>
    )
  }

  const quantity = items.find((item) => item.productId === product.id)?.quantity ?? 0
  const wishlisted = productIds.has(product.id)

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <Link to="/shop" className="text-sm text-muted-foreground hover:text-foreground">
        ← Back to shop
      </Link>

      <div className="mt-6 grid grid-cols-1 gap-10 sm:grid-cols-2">
        <div className="relative flex aspect-square items-center justify-center rounded-xl border bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
          <ProductIllustration category={product.category} className="h-48 w-auto" />
          {user ? (
            <Button
              size="icon"
              variant="outline"
              className="absolute right-4 top-4 rounded-full"
              onClick={() => toggle(product.id)}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart className={wishlisted ? "fill-destructive text-destructive" : ""} />
            </Button>
          ) : null}
        </div>

        <div>
          <p className="text-sm text-muted-foreground">{product.size}</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight">{product.name}</h1>
          <p className="mt-4 text-muted-foreground">{product.description}</p>
          <p className="mt-6 text-2xl font-semibold">${product.price.toFixed(2)}</p>

          <div className="mt-8">
            {quantity === 0 ? (
              <Button size="lg" onClick={() => addToCart(product.id)}>
                <Plus />
                Add to cart
              </Button>
            ) : (
              <div className="flex items-center gap-3 rounded-full border bg-secondary p-1 w-fit">
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setQuantity(product.id, quantity - 1)}
                  aria-label={`Remove one ${product.name}`}
                >
                  <Minus />
                </Button>
                <span className="w-6 text-center font-medium">{quantity}</span>
                <Button
                  size="icon"
                  variant="ghost"
                  className="rounded-full"
                  onClick={() => setQuantity(product.id, quantity + 1)}
                  aria-label={`Add one more ${product.name}`}
                >
                  <Plus />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
