import { Link } from "react-router-dom"

import { CATEGORIES } from "@/lib/products"

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-12 sm:py-16">
      <h2 className="text-2xl font-semibold tracking-tight">Shop by category</h2>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
        {CATEGORIES.map(({ id, label, icon: Icon }) => (
          <Link
            key={id}
            to={`/shop?category=${id}`}
            className="flex flex-col items-center gap-3 rounded-lg border p-6 text-center transition hover:-translate-y-0.5 hover:bg-accent hover:shadow-md"
          >
            <Icon className="size-8 text-amber-700 dark:text-amber-400" />
            <span className="text-sm font-medium">{label}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
