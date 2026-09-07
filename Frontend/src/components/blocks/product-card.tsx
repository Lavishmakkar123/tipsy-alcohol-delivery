import { Minus, Plus } from "lucide-react"

import { ProductIllustration } from "@/components/blocks/product-illustration"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { useCart } from "@/context/cart-context"
import type { Product } from "@/lib/types"

export function ProductCard({ product }: { product: Product }) {
  const { items, addToCart, setQuantity } = useCart()
  const quantity = items.find((item) => item.productId === product.id)?.quantity ?? 0

  return (
    <Card className="flex flex-col overflow-hidden transition-shadow hover:shadow-md">
      <div className="flex aspect-square items-center justify-center bg-gradient-to-b from-neutral-100 to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
        <ProductIllustration category={product.category} className="h-28 w-auto" />
      </div>

      <CardContent className="flex flex-1 flex-col gap-1 pt-4">
        <p className="text-sm text-muted-foreground">{product.size}</p>
        <h3 className="font-medium leading-snug">{product.name}</h3>
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
