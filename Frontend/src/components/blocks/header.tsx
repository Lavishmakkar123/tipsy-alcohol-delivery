import { Beer, Gift, Heart, Moon, Search, ShoppingCart, Sun, User } from "lucide-react"
import { useEffect, useState, type FormEvent } from "react"
import { Link, useNavigate } from "react-router-dom"

import { AuthDialog } from "@/components/blocks/auth-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useTheme } from "@/context/theme-context"

export function Header() {
  const { cartCount, subtotal } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [search, setSearch] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 8)
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  function handleSearch(e: FormEvent) {
    e.preventDefault()
    navigate(search.trim() ? `/shop?q=${encodeURIComponent(search.trim())}` : "/shop")
  }

  return (
    <header
      className={`sticky top-0 z-20 border-b bg-background/90 backdrop-blur transition-shadow ${
        scrolled ? "shadow-sm" : ""
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-4 px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Beer className="size-5 text-primary" />
          Tipsy
        </Link>

        <form onSubmit={handleSearch} className="order-3 w-full sm:order-none sm:ml-4 sm:max-w-xs sm:flex-1">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
              className="h-9 w-full rounded-full border bg-background pl-9 pr-3 text-sm shadow-xs outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>
        </form>

        <nav className="ml-auto flex items-center gap-2">
          <Button variant="ghost" asChild className="hidden md:inline-flex">
            <Link to="/shop">Shop</Link>
          </Button>

          {user ? (
            <Button variant="ghost" size="icon" asChild aria-label="Wishlist">
              <Link to="/wishlist">
                <Heart />
              </Link>
            </Button>
          ) : null}

          <Button variant="outline" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart />
              {cartCount > 0 ? `$${subtotal.toFixed(2)}` : "Cart"}
              {cartCount > 0 ? (
                <span className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
                  {cartCount}
                </span>
              ) : null}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "Switch to light mode" : "Switch to night mode"}
          >
            {theme === "dark" ? <Sun /> : <Moon />}
          </Button>

          {user ? (
            <>
              <span
                className="hidden items-center gap-1 rounded-full border bg-secondary px-3 py-1.5 text-xs font-medium sm:flex"
                title="Loyalty points"
              >
                <Gift className="size-3.5" />
                {user.loyaltyPoints}
              </span>
              <Button variant="ghost" onClick={signOut}>
                <User />
                {user.email}
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => setAuthOpen(true)}>
              Sign in
            </Button>
          )}
        </nav>
      </div>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </header>
  )
}
