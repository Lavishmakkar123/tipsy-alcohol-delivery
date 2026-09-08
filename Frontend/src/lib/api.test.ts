import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addToWishlist,
  confirmPayment,
  createOrder,
  createPaymentIntent,
  getWishlist,
  login,
  register,
  removeFromWishlist,
  socialLogin,
} from '@/lib/api'

function mockFetchOnce(status: number, body: unknown) {
  vi.stubGlobal(
    'fetch',
    vi.fn().mockResolvedValue({
      ok: status >= 200 && status < 300,
      status,
      json: () => Promise.resolve(body),
    })
  )
}

describe('api request helper', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('does not send an Authorization header when no token is stored', async () => {
    mockFetchOnce(200, [])
    await getWishlist()

    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect((options.headers as Record<string, string>).Authorization).toBeUndefined()
  })

  it('sends a Bearer token from localStorage when present', async () => {
    localStorage.setItem('tipsy-token', 'abc123')
    mockFetchOnce(200, [])
    await getWishlist()

    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect((options.headers as Record<string, string>).Authorization).toBe('Bearer abc123')
  })

  it('resolves with the parsed JSON body on success', async () => {
    mockFetchOnce(200, { token: 't', user: { id: '1', email: 'a@b.com', loyaltyPoints: 0 } })
    const result = await login('a@b.com', 'password123')
    expect(result).toEqual({ token: 't', user: { id: '1', email: 'a@b.com', loyaltyPoints: 0 } })
  })

  it('throws an Error using the server-provided message on failure', async () => {
    mockFetchOnce(409, { error: 'An account with that email already exists' })
    await expect(register('a@b.com', 'password123')).rejects.toThrow(
      'An account with that email already exists'
    )
  })

  it('falls back to a generic message when the error body has none', async () => {
    mockFetchOnce(500, {})
    await expect(register('a@b.com', 'password123')).rejects.toThrow('Request failed')
  })

  it('serializes the request body as JSON', async () => {
    mockFetchOnce(201, { id: 'o1' })
    await createOrder([{ productId: 'p1', quantity: 2 }], 'a@b.com')

    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(JSON.parse(options.body as string)).toEqual({
      items: [{ productId: 'p1', quantity: 2 }],
      customerEmail: 'a@b.com',
    })
  })

  it('sends a POST for addToWishlist', async () => {
    mockFetchOnce(204, {})
    await addToWishlist('p1')

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toContain('/api/wishlist/p1')
    expect(options.method).toBe('POST')
  })

  it('sends a DELETE for removeFromWishlist', async () => {
    mockFetchOnce(204, {})
    await removeFromWishlist('p1')

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toContain('/api/wishlist/p1')
    expect(options.method).toBe('DELETE')
  })

  it('requests a payment intent for an order', async () => {
    mockFetchOnce(200, { clientSecret: 'secret_123' })
    const result = await createPaymentIntent('o1')

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toContain('/api/orders/o1/payment-intent')
    expect(options.method).toBe('POST')
    expect(result).toEqual({ clientSecret: 'secret_123' })
  })

  it('confirms a payment for an order', async () => {
    mockFetchOnce(200, { id: 'o1', status: 'paid' })
    await confirmPayment('o1', 'pi_123')

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toContain('/api/orders/o1/confirm-payment')
    expect(JSON.parse(options.body as string)).toEqual({ paymentIntentId: 'pi_123' })
  })

  it('logs in via a social provider email', async () => {
    mockFetchOnce(200, { token: 't', user: { id: '1', email: 'a@b.com', loyaltyPoints: 0 } })
    await socialLogin('a@b.com')

    const [url, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(url).toContain('/api/auth/social-login')
    expect(JSON.parse(options.body as string)).toEqual({ email: 'a@b.com' })
  })
})
