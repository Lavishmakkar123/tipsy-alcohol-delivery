import { Route, Routes } from 'react-router-dom'

import { Footer } from '@/components/blocks/footer'
import { Header } from '@/components/blocks/header'
import { AddressProvider } from '@/context/address-context'
import { AuthProvider } from '@/context/auth-context'
import { CartProvider } from '@/context/cart-context'
import { ThemeProvider } from '@/context/theme-context'
import Cart from '@/pages/cart'
import Checkout from '@/pages/checkout'
import Home from '@/pages/home'
import Shop from '@/pages/shop'
import SignIn from '@/pages/sign-in'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AddressProvider>
          <CartProvider>
            <Header />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/sign-in" element={<SignIn />} />
            </Routes>
            <Footer />
          </CartProvider>
        </AddressProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
