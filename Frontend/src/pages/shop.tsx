import { useMemo, useState } from "react"
import { useSearchParams } from "react-router-dom"

import { ProductCard } from "@/components/blocks/product-card"
import { Button } from "@/components/ui/button"
import { CATEGORIES, PRODUCTS } from "@/lib/products"
import type { ProductCategory } from "@/lib/types"

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [search, setSearch] = useState("")

  const activeCategory = searchParams.get("category") as ProductCategory | null

  function setCategory(category: ProductCategory | null) {
    if (category) {
      setSearchParams({ category })
    } else {
      setSearchParams({})
    }
  }

  const filtered = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesCategory = !activeCategory || product.category === activeCategory
      const matchesSearch = product.name
        .toLowerCase()
        .includes(search.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, search])

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Shop</h1>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant={activeCategory ? "outline" : "default"}
            onClick={() => setCategory(null)}
          >
            All
          </Button>
          {CATEGORIES.map(({ id, label }) => (
            <Button
              key={id}
              size="sm"
              variant={activeCategory === id ? "default" : "outline"}
              onClick={() => setCategory(id)}
            >
              {label}
            </Button>
          ))}
        </div>

        <input
          type="search"
          placeholder="Search products"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9 w-full rounded-md border bg-background px-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:w-64"
        />
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <p className="mt-16 text-center text-muted-foreground">
          No products match your search.
        </p>
      )}
    </div>
  )
}
