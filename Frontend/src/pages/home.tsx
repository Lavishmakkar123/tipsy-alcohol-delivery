import { CategoryGrid } from "@/components/blocks/category-grid"
import { DeliveryHighlight } from "@/components/blocks/delivery-highlight"
import { FeaturedProducts } from "@/components/blocks/featured-products"
import { Hero } from "@/components/blocks/hero"
import { PromoCarousel } from "@/components/blocks/promo-carousel"
import { WhyTipsy } from "@/components/blocks/why-tipsy"

export default function Home() {
  return (
    <>
      <Hero />
      <PromoCarousel />
      <DeliveryHighlight />
      <WhyTipsy />
      <CategoryGrid />
      <FeaturedProducts />
    </>
  )
}
