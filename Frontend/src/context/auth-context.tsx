import { createContext, useContext, useState, type ReactNode } from "react"

import { login as loginApi, register as registerApi, socialLogin as socialLoginApi } from "@/lib/api"

interface User {
  id: string
  email: string
  loyaltyPoints: number
}

interface AuthContextValue {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  socialLogin: (email: string) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const TOKEN_KEY = "tipsy-token"
const USER_KEY = "tipsy-user-info"

function getInitialUser(): User | null {
  const stored = localStorage.getItem(USER_KEY)
  return stored ? (JSON.parse(stored) as User) : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(getInitialUser)

  function persist(token: string, nextUser: User) {
    localStorage.setItem(TOKEN_KEY, token)
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
    setUser(nextUser)
  }

  async function login(email: string, password: string) {
    const { token, user: nextUser } = await loginApi(email, password)
    persist(token, nextUser)
  }

  async function register(email: string, password: string) {
    const { token, user: nextUser } = await registerApi(email, password)
    persist(token, nextUser)
  }

  async function socialLogin(email: string) {
    const { token, user: nextUser } = await socialLoginApi(email)
    persist(token, nextUser)
  }

  function signOut() {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, socialLogin, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider")
  return ctx
}
