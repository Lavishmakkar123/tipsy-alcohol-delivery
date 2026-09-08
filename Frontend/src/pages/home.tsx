import { CategoryGrid } from "@/components/blocks/category-grid"
import { DeliveryHighlight } from "@/components/blocks/delivery-highlight"
import { FeaturedProducts } from "@/components/blocks/featured-products"
import { Hero } from "@/components/blocks/hero"
import { PremiumSpotlight } from "@/components/blocks/premium-spotlight"
import { PromoCarousel } from "@/components/blocks/promo-carousel"
import { StorySection } from "@/components/blocks/story-section"

export default function Home() {
  return (
    <>
      <Hero />
      <PromoCarousel />
      <DeliveryHighlight />

      <StorySection
        eyebrow="Speed"
        title="Fast."
        description="Order and it's on its way in minutes, not hours. Most deliveries land inside 30 minutes of checking out."
      />
      <StorySection
        eyebrow="Trust"
        title="Verified."
        description="Every driver checks ID at the door, every time — no exceptions, no shortcuts, no awkward guesswork."
        tint
      />
      <StorySection
        eyebrow="Visibility"
        title="Tracked."
        description="Watch your order move from the shelf to your door in real time. No wondering, no waiting in the dark."
      />
      <StorySection
        eyebrow="Selection"
        title="Curated."
        description="A tight lineup of good beer, wine, and spirits from local shops — picked with care, not padded for volume."
        tint
      />

      <CategoryGrid />
      <FeaturedProducts />
      <PremiumSpotlight />
    </>
  )
}
