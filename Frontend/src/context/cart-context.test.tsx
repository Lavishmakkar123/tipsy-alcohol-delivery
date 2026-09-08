import { act, renderHook } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PRODUCTS } from '@/lib/products'
import { CartProvider, useCart } from '@/context/cart-context'

const [productA, productB] = PRODUCTS

function renderCart() {
  return renderHook(() => useCart(), { wrapper: CartProvider })
}

describe('useCart', () => {
  it('throws when used outside a CartProvider', () => {
    expect(() => renderHook(() => useCart())).toThrow('useCart must be used within a CartProvider')
  })

  it('starts empty', () => {
    const { result } = renderCart()
    expect(result.current.items).toEqual([])
    expect(result.current.cartCount).toBe(0)
    expect(result.current.subtotal).toBe(0)
  })

  it('adds a product to the cart, defaulting to quantity 1', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(productA.id))
    expect(result.current.items).toEqual([{ productId: productA.id, quantity: 1 }])
    expect(result.current.cartCount).toBe(1)
    expect(result.current.subtotal).toBeCloseTo(productA.price)
  })

  it('increases quantity when adding the same product again', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(productA.id, 2))
    act(() => result.current.addToCart(productA.id, 3))
    expect(result.current.items).toEqual([{ productId: productA.id, quantity: 5 }])
    expect(result.current.subtotal).toBeCloseTo(productA.price * 5)
  })

  it('tracks multiple distinct products and computes their combined subtotal', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(productA.id, 1))
    act(() => result.current.addToCart(productB.id, 2))
    expect(result.current.cartCount).toBe(3)
    expect(result.current.subtotal).toBeCloseTo(productA.price + productB.price * 2)
  })

  it('removes a product from the cart', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(productA.id))
    act(() => result.current.removeFromCart(productA.id))
    expect(result.current.items).toEqual([])
  })

  it('setQuantity updates the quantity for an existing item', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(productA.id, 1))
    act(() => result.current.setQuantity(productA.id, 4))
    expect(result.current.items).toEqual([{ productId: productA.id, quantity: 4 }])
  })

  it('setQuantity removes the item when the quantity drops to zero or below', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(productA.id, 1))
    act(() => result.current.setQuantity(productA.id, 0))
    expect(result.current.items).toEqual([])
  })

  it('clearCart empties the cart', () => {
    const { result } = renderCart()
    act(() => result.current.addToCart(productA.id))
    act(() => result.current.addToCart(productB.id))
    act(() => result.current.clearCart())
    expect(result.current.items).toEqual([])
    expect(result.current.cartCount).toBe(0)
  })
})
