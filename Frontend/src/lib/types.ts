export type ProductCategory = "beer" | "wine" | "spirits" | "cider" | "mixers"

export interface Product {
  id: string
  name: string
  category: ProductCategory
  price: number
  size: string
  description: string
}
