const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000"
const TOKEN_KEY = "tipsy-token"

interface Order {
  id: string
  userId: string | null
  customerEmail: string
  items: { productId: string; name: string; unitPrice: number; quantity: number; lineTotal: number }[]
  total: number
  status: string
  createdAt: string
}

interface AuthResponse {
  token: string
  user: { id: string; email: string; loyaltyPoints: number }
}

interface ApiProduct {
  id: string
  name: string
  category: string
  price: number
  size: string
  description: string
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem(TOKEN_KEY)
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  const body = await res.json()
  if (!res.ok) throw new Error(body.error || "Request failed")
  return body as T
}

export function createOrder(items: { productId: string; quantity: number }[], customerEmail: string) {
  return request<Order>("/api/orders", {
    method: "POST",
    body: JSON.stringify({ items, customerEmail }),
  })
}

export function createPaymentIntent(orderId: string) {
  return request<{ clientSecret: string }>(`/api/orders/${orderId}/payment-intent`, {
    method: "POST",
  })
}

export function confirmPayment(orderId: string, paymentIntentId: string) {
  return request<Order>(`/api/orders/${orderId}/confirm-payment`, {
    method: "POST",
    body: JSON.stringify({ paymentIntentId }),
  })
}

export function register(email: string, password: string) {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function login(email: string, password: string) {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  })
}

export function socialLogin(email: string) {
  return request<AuthResponse>("/api/auth/social-login", {
    method: "POST",
    body: JSON.stringify({ email }),
  })
}

export function getWishlist() {
  return request<ApiProduct[]>("/api/wishlist")
}

export function addToWishlist(productId: string) {
  return request<void>(`/api/wishlist/${productId}`, { method: "POST" })
}

export function removeFromWishlist(productId: string) {
  return request<void>(`/api/wishlist/${productId}`, { method: "DELETE" })
}
