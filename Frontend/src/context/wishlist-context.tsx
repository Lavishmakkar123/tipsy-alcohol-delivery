import { createContext, useContext, useEffect, useState, type ReactNode } from "react"

import { useAuth } from "@/context/auth-context"
import { addToWishlist, getWishlist, removeFromWishlist } from "@/lib/api"

interface WishlistContextValue {
  productIds: Set<string>
  loading: boolean
  toggle: (productId: string) => Promise<void>
}

const WishlistContext = createContext<WishlistContextValue | null>(null)

export function WishlistProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [productIds, setProductIds] = useState<Set<string>>(new Set())
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setProductIds(new Set())
      return
    }
    setLoading(true)
    getWishlist()
      .then((products) => setProductIds(new Set(products.map((p) => p.id))))
      .catch(() => setProductIds(new Set()))
      .finally(() => setLoading(false))
  }, [user])

  async function toggle(productId: string) {
    if (!user) return
    const isSaved = productIds.has(productId)
    // Optimistic update — the heart flips immediately, then reconciles if the request fails.
    setProductIds((prev) => {
      const next = new Set(prev)
      if (isSaved) next.delete(productId)
      else next.add(productId)
      return next
    })
    try {
      if (isSaved) await removeFromWishlist(productId)
      else await addToWishlist(productId)
    } catch {
      setProductIds((prev) => {
        const next = new Set(prev)
        if (isSaved) next.add(productId)
        else next.delete(productId)
        return next
      })
    }
  }

  return (
    <WishlistContext.Provider value={{ productIds, loading, toggle }}>
      {children}
    </WishlistContext.Provider>
  )
}

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider")
  return ctx
}
