import { Heart, Minus, Plus } from "lucide-react"
import { Link } from "react-router-dom"

import { ProductIllustration } from "@/components/blocks/product-illustration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useWishlist } from "@/context/wishlist-context"
import type { Product } from "@/lib/types"

export function ProductCard({ product }: { product: Product }) {
  const { items, addToCart, setQuantity } = useCart()
  const { user } = useAuth()
  const { productIds, toggle } = useWishlist()
  const quantity = items.find((item) => item.productId === product.id)?.quantity ?? 0
  const wishlisted = productIds.has(product.id)

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-200 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative flex aspect-square items-center justify-center bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
        <Link to={`/product/${product.id}`}>
          <ProductIllustration category={product.category} className="h-28 w-auto" />
        </Link>
        {user ? (
          <Button
            size="icon-sm"
            variant="outline"
            className="absolute right-2 top-2 rounded-full bg-background/80"
            onClick={() => toggle(product.id)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart className={wishlisted ? "fill-destructive text-destructive" : ""} />
          </Button>
        ) : null}
      </div>

      <CardContent className="flex flex-1 flex-col gap-1 pt-4">
        <p className="text-sm text-muted-foreground">{product.size}</p>
        <Link to={`/product/${product.id}`} className="font-medium leading-snug hover:underline">
          {product.name}
        </Link>
        <p className="mt-1 text-sm text-muted-foreground">{product.description}</p>
      </CardContent>

      <CardFooter className="flex items-center justify-between">
        <span className="font-semibold">${product.price.toFixed(2)}</span>
        {quantity === 0 ? (
          <Button size="sm" onClick={() => addToCart(product.id)}>
            <Plus />
            Add
          </Button>
        ) : (
          <div className="flex items-center gap-2 rounded-full border bg-secondary p-1">
            <Button
              size="icon-sm"
              variant="ghost"
              className="size-6 rounded-full"
              onClick={() => setQuantity(product.id, quantity - 1)}
              aria-label={`Remove one ${product.name}`}
            >
              <Minus />
            </Button>
            <span className="w-4 text-center text-sm font-medium">{quantity}</span>
            <Button
              size="icon-sm"
              variant="ghost"
              className="size-6 rounded-full"
              onClick={() => setQuantity(product.id, quantity + 1)}
              aria-label={`Add one more ${product.name}`}
            >
              <Plus />
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
