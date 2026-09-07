import type { ProductCategory } from "@/lib/types"

const PALETTE: Record<
  ProductCategory,
  { body: string; accent: string; label: string }
> = {
  beer: { body: "#C77B2B", accent: "#8A4B14", label: "#FFF6E5" },
  wine: { body: "#5C1A2E", accent: "#3A0F1D", label: "#F4E7D8" },
  spirits: { body: "#CFDBE0", accent: "#9FB4BB", label: "#FFFFFF" },
  cider: { body: "#E0562F", accent: "#B7401F", label: "#FFF4EE" },
  mixers: { body: "#2F8F5B", accent: "#1F6B41", label: "#F0FFF6" },
}

const BOTTLE_CATEGORIES: ProductCategory[] = ["beer", "wine", "spirits"]

/**
 * A small original vector illustration per product category — a bottle
 * shape for beer/wine/spirits, a can shape for cider & coolers/mixers.
 * Stands in for a real product photo without depicting any real brand.
 */
export function ProductIllustration({
  category,
  className,
}: {
  category: ProductCategory
  className?: string
}) {
  const { body, accent, label } = PALETTE[category]

  if (BOTTLE_CATEGORIES.includes(category)) {
    return (
      <svg viewBox="0 0 100 168" className={className} aria-hidden="true">
        <ellipse cx="50" cy="158" rx="26" ry="6" fill="currentColor" className="text-black/10 dark:text-black/40" />
        <rect x="42" y="8" width="16" height="18" rx="2" fill={accent} />
        <path
          d="M43 26 L43 48 Q30 58 30 78 L30 144 Q30 154 40 154 L60 154 Q70 154 70 144 L70 78 Q70 58 57 48 L57 26 Z"
          fill={body}
        />
        <rect x="33" y="88" width="34" height="28" rx="3" fill={label} />
      </svg>
    )
  }

  return (
    <svg viewBox="0 0 100 168" className={className} aria-hidden="true">
      <ellipse cx="50" cy="158" rx="26" ry="6" fill="currentColor" className="text-black/10 dark:text-black/40" />
      <rect x="26" y="14" width="48" height="132" rx="10" fill={body} />
      <rect x="26" y="14" width="48" height="14" rx="7" fill={accent} />
      <rect x="31" y="58" width="38" height="38" rx="3" fill={label} />
    </svg>
  )
}
