export function StorySection({
  eyebrow,
  title,
  description,
  tint = false,
}: {
  eyebrow: string
  title: string
  description: string
  tint?: boolean
}) {
  return (
    <section className={`px-6 py-24 sm:py-36 ${tint ? "bg-card" : "bg-background"}`}>
      <div className="mx-auto max-w-4xl">
        <span className="text-sm font-medium text-brand-content">{eyebrow}</span>
        <h2 className="mt-4 text-5xl font-semibold tracking-tight text-balance sm:text-7xl">
          {title}
        </h2>
        <p className="mt-6 max-w-xl text-lg text-muted-foreground text-balance">
          {description}
        </p>
      </div>
    </section>
  )
}
