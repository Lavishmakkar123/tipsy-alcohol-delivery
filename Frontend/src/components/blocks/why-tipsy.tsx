import { MapPin, ShieldCheck, Sparkles } from "lucide-react"

const FEATURES = [
  {
    icon: ShieldCheck,
    title: "Age verified, every time",
    description: "Every driver checks ID at the door — no exceptions, no shortcuts.",
    wash: "from-rose-100 via-amber-50 to-orange-100 dark:from-rose-950/40 dark:via-amber-950/20 dark:to-orange-950/30",
  },
  {
    icon: MapPin,
    title: "Track it live",
    description: "Watch your order move from the shop shelf to your front door in real time.",
    wash: "from-sky-100 via-cyan-50 to-blue-100 dark:from-sky-950/40 dark:via-cyan-950/20 dark:to-blue-950/30",
  },
  {
    icon: Sparkles,
    title: "Curated, not endless",
    description: "A tight selection of good beer, wine, and spirits — picked, not padded.",
    wash: "from-emerald-100 via-teal-50 to-green-100 dark:from-emerald-950/40 dark:via-teal-950/20 dark:to-green-950/30",
  },
]

export function WhyTipsy() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16 text-center sm:py-20">
      <span className="text-sm font-medium text-brand-content">Why Tipsy</span>
      <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
        Everything you need, delivered fast.
      </h2>

      <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3">
        {FEATURES.map(({ icon: Icon, title, description, wash }) => (
          <div key={title} className="flex flex-col items-start rounded-xl border p-6 text-left">
            <div className={`flex size-12 items-center justify-center rounded-lg bg-gradient-to-br ${wash}`}>
              <Icon className="size-5 text-foreground/70" />
            </div>
            <h3 className="mt-4 font-medium">{title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
