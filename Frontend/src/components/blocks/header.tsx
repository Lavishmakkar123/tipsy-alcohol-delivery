import { Beer, Moon, ShoppingCart, Sun, User } from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

import { AuthDialog } from "@/components/blocks/auth-dialog"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/auth-context"
import { useCart } from "@/context/cart-context"
import { useTheme } from "@/context/theme-context"

export function Header() {
  const { cartCount } = useCart()
  const { theme, toggleTheme } = useTheme()
  const { user, signOut } = useAuth()
  const [authOpen, setAuthOpen] = useState(false)

  return (
    <header className="sticky top-0 z-20 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2 text-xl font-semibold tracking-tight">
          <Beer className="size-5 text-amber-700 dark:text-amber-400" />
          Tipsy
        </Link>

        <nav className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link to="/">Home</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link to="/shop">Shop</Link>
          </Button>
          <Button variant="outline" asChild className="relative">
            <Link to="/cart">
              <ShoppingCart />
              Cart
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
            <Button variant="ghost" onClick={signOut}>
              <User />
              {user.email}
            </Button>
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
