import { Elements, PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { useState, type FormEvent } from "react"
import { Link } from "react-router-dom"

import { DeliveryMap } from "@/components/blocks/delivery-map"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddress } from "@/context/address-context"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { confirmPayment as confirmPaymentApi, createOrder, createPaymentIntent } from "@/lib/api"

const STRIPE_PUBLISHABLE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const IS_TEST_MODE = STRIPE_PUBLISHABLE_KEY?.startsWith("pk_test_") ?? false
const stripePromise = STRIPE_PUBLISHABLE_KEY ? loadStripe(STRIPE_PUBLISHABLE_KEY) : null

function TestCardHint() {
  return (
    <div className="mb-4 rounded-lg border border-dashed bg-muted/40 p-3 text-sm">
      <p className="font-medium">Test mode — no real charge will happen</p>
      <p className="mt-1 text-muted-foreground">
        Card <span className="font-mono">4242 4242 4242 4242</span> · any future expiry · any
        3-digit CVC · any postal code
      </p>
    </div>
  )
}

function PaymentForm({ orderId, onPaid }: { orderId: string; onPaid: () => void }) {
  const stripe = useStripe()
  const elements = useElements()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!stripe || !elements) return
    setSubmitting(true)
    setError(null)

    const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    })

    if (stripeError) {
      setError(stripeError.message ?? "Payment failed")
      setSubmitting(false)
      return
    }

    if (paymentIntent?.status === "succeeded") {
      try {
        await confirmPaymentApi(orderId, paymentIntent.id)
        onPaid()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Could not confirm payment")
      }
    }
    setSubmitting(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <PaymentElement />
      {error ? <p className="text-sm text-destructive">{error}</p> : null}
      <Button type="submit" size="lg" disabled={!stripe || submitting}>
        {submitting ? "Processing…" : "Pay now"}
      </Button>
    </form>
  )
}

export default function Checkout() {
  const { items, subtotal, clearCart } = useCart()
  const { user } = useAuth()
  const { address, coordinates } = useAddress()
  const [email, setEmail] = useState(user?.email ?? "")
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const [orderId, setOrderId] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paid, setPaid] = useState(false)

  async function handleStartPayment(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const order = await createOrder(items, email)
      const { clientSecret: secret } = await createPaymentIntent(order.id)
      setOrderId(order.id)
      setClientSecret(secret)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not start checkout")
    } finally {
      setLoading(false)
    }
  }

  function handlePaid() {
    setPaid(true)
    clearCart()
  }

  if (items.length === 0 && !paid) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <Button asChild className="mt-6">
          <Link to="/shop">Browse the shop</Link>
        </Button>
      </div>
    )
  }

  if (paid) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Order confirmed</h1>
        <p className="mt-2 text-muted-foreground">
          Thanks — your order{orderId ? ` #${orderId.slice(0, 8)}` : ""} is on its way.
        </p>
        <Button asChild className="mt-6">
          <Link to="/shop">Keep shopping</Link>
        </Button>
      </div>
    )
  }

  if (!STRIPE_PUBLISHABLE_KEY) {
    return (
      <div className="mx-auto max-w-lg px-6 py-24 text-center">
        <h1 className="text-2xl font-semibold">Checkout isn&apos;t configured yet</h1>
        <p className="mt-2 text-muted-foreground">
          Payments aren&apos;t set up — add a Stripe publishable key to get this working.
        </p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <Card>
        <CardHeader>
          <CardTitle>Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6 flex items-center justify-between border-b pb-4">
            <span className="text-sm text-muted-foreground">Total</span>
            <span className="text-lg font-semibold">${subtotal.toFixed(2)}</span>
          </div>

          {address ? (
            <div className="mb-6">
              <p className="mb-2 text-sm text-muted-foreground">Delivering to</p>
              <p className="text-sm font-medium">{address}</p>
              {coordinates ? <div className="mt-2"><DeliveryMap coordinates={coordinates} /></div> : null}
            </div>
          ) : null}

          {!clientSecret ? (
            <form onSubmit={handleStartPayment} className="flex flex-col gap-3">
              <Label htmlFor="checkout-email">Email</Label>
              <Input
                id="checkout-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
              {error ? <p className="text-sm text-destructive">{error}</p> : null}
              <Button type="submit" size="lg" disabled={loading} className="mt-2">
                {loading ? "Preparing checkout…" : "Continue to payment"}
              </Button>
            </form>
          ) : (
            <>
              {IS_TEST_MODE ? <TestCardHint /> : null}
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <PaymentForm orderId={orderId!} onPaid={handlePaid} />
              </Elements>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
