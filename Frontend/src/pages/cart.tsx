import { Minus, Plus, Trash2 } from "lucide-react"
import { Link } from "react-router-dom"

import { Button } from "@/components/ui/button"
import { useCart } from "@/context/cart-context"
import { PRODUCTS } from "@/lib/products"

export default function Cart() {
  const { items, removeFromCart, setQuantity, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="text-3xl font-semibold tracking-tight">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">
          Add something from the shop to get started.
        </p>
        <Button asChild className="mt-6">
          <Link to="/shop">Browse the shop</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Your cart</h1>

      <ul className="mt-8 divide-y">
        {items.map((item) => {
          const product = PRODUCTS.find((p) => p.id === item.productId)
          if (!product) return null

          return (
            <li key={item.productId} className="flex items-center gap-4 py-4">
              <div className="flex-1">
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  {product.size} · ${product.price.toFixed(2)}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  aria-label="Decrease quantity"
                >
                  <Minus />
                </Button>
                <span className="w-6 text-center text-sm">{item.quantity}</span>
                <Button
                  size="icon-sm"
                  variant="outline"
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus />
                </Button>
              </div>

              <span className="w-16 text-right font-medium">
                ${(product.price * item.quantity).toFixed(2)}
              </span>

              <Button
                size="icon-sm"
                variant="ghost"
                onClick={() => removeFromCart(item.productId)}
                aria-label="Remove item"
              >
                <Trash2 />
              </Button>
            </li>
          )
        })}
      </ul>

      <div className="mt-8 flex items-center justify-between border-t pt-6">
        <span className="text-lg font-semibold">Subtotal</span>
        <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
      </div>

      <Button size="lg" className="mt-6 w-full" asChild>
        <Link to="/checkout">Checkout</Link>
      </Button>
    </div>
  )
}
