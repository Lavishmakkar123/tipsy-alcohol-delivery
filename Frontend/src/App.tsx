import { Route, Routes } from 'react-router-dom'

import { Footer } from '@/components/blocks/footer'
import { Header } from '@/components/blocks/header'
import { AddressProvider } from '@/context/address-context'
import { AuthProvider } from '@/context/auth-context'
import { CartProvider } from '@/context/cart-context'
import { ThemeProvider } from '@/context/theme-context'
import { WishlistProvider } from '@/context/wishlist-context'
import Cart from '@/pages/cart'
import Checkout from '@/pages/checkout'
import Home from '@/pages/home'
import Product from '@/pages/product'
import Shop from '@/pages/shop'
import SignIn from '@/pages/sign-in'
import Wishlist from '@/pages/wishlist'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <WishlistProvider>
          <AddressProvider>
            <CartProvider>
              <Header />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/product/:id" element={<Product />} />
                <Route path="/wishlist" element={<Wishlist />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/sign-in" element={<SignIn />} />
              </Routes>
              <Footer />
            </CartProvider>
          </AddressProvider>
        </WishlistProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
