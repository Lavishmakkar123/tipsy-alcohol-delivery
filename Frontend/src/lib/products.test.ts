import { describe, expect, it } from 'vitest'
import { CATEGORIES, PRODUCTS } from '@/lib/products'

describe('PRODUCTS catalog', () => {
  it('is not empty', () => {
    expect(PRODUCTS.length).toBeGreaterThan(0)
  })

  it('has a unique id for every product', () => {
    const ids = PRODUCTS.map((p) => p.id)
    expect(new Set(ids).size).toBe(ids.length)
  })

  it('only uses categories declared in CATEGORIES', () => {
    const validCategories = new Set(CATEGORIES.map((c) => c.id))
    for (const product of PRODUCTS) {
      expect(validCategories.has(product.category)).toBe(true)
    }
  })

  it('has a positive price for every product', () => {
    for (const product of PRODUCTS) {
      expect(product.price).toBeGreaterThan(0)
    }
  })

  it('has a non-empty name, size, and description for every product', () => {
    for (const product of PRODUCTS) {
      expect(product.name.trim().length).toBeGreaterThan(0)
      expect(product.size.trim().length).toBeGreaterThan(0)
      expect(product.description.trim().length).toBeGreaterThan(0)
    }
  })
})

describe('CATEGORIES', () => {
  it('has a unique id and label for every category', () => {
    const ids = CATEGORIES.map((c) => c.id)
    expect(new Set(ids).size).toBe(ids.length)
    for (const category of CATEGORIES) {
      expect(category.label.trim().length).toBeGreaterThan(0)
    }
  })
})
