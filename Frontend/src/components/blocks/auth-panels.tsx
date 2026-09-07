import { GoogleLogin, GoogleOAuthProvider, type CredentialResponse } from "@react-oauth/google"
import { jwtDecode } from "jwt-decode"
import { useEffect, useState, type FormEvent } from "react"
import { useNavigate } from "react-router-dom"

import { AddressAutocomplete } from "@/components/blocks/address-autocomplete"
import { DeliveryMap } from "@/components/blocks/delivery-map"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAddress } from "@/context/address-context"
import { useAuth } from "@/context/auth-context"
import type { GeocodeResult } from "@/lib/geocode"

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const FACEBOOK_APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID

interface GoogleIdToken {
  email: string
}

interface FacebookLoginResponse {
  authResponse?: { accessToken: string }
}

function FacebookMark() {
  return (
    <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
      <rect width="24" height="24" rx="4" fill="#1877F2" />
      <path
        d="M15.5 12.5h-2v7h-3v-7h-1.5v-2.5H10.5V8.5c0-1.4.9-2.7 3-2.7h2v2.4h-1.3c-.4 0-.7.3-.7.8v1h2.2z"
        fill="#fff"
      />
    </svg>
  )
}

declare global {
  interface Window {
    FB?: {
      init: (opts: Record<string, unknown>) => void
      login: (cb: (res: FacebookLoginResponse) => void, opts: Record<string, unknown>) => void
      api: (path: string, opts: Record<string, unknown>, cb: (res: { email?: string }) => void) => void
    }
    fbAsyncInit?: () => void
  }
}

/** Loads the Facebook JS SDK once and reports when window.FB is ready to use. */
function useFacebookSdk(appId?: string) {
  const [ready, setReady] = useState(() => !!window.FB)

  useEffect(() => {
    if (!appId || window.FB) return
    window.fbAsyncInit = () => {
      window.FB!.init({ appId, cookie: true, xfbml: false, version: "v19.0" })
      setReady(true)
    }
    const script = document.createElement("script")
    script.src = "https://connect.facebook.net/en_US/sdk.js"
    script.async = true
    document.body.appendChild(script)
  }, [appId])

  return ready
}

export function AuthPanels({ onDone }: { onDone?: () => void }) {
  const { login, register, socialLogin } = useAuth()
  const { setAddress } = useAddress()
  const navigate = useNavigate()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedAddress, setSelectedAddress] = useState<GeocodeResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const facebookReady = useFacebookSdk(FACEBOOK_APP_ID)

  function finish(path = "/") {
    onDone?.()
    navigate(path)
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    try {
      // One form for both new and returning users: try signing in first, and
      // if that fails because there's no such account, register it instead.
      // A wrong password on an existing account still surfaces correctly,
      // since register() then fails with "already exists" rather than 200.
      try {
        await login(email, password)
      } catch {
        try {
          await register(email, password)
        } catch (registerErr) {
          // register() failing with "already exists" means the account is
          // real and login() failed for some other reason — almost always a
          // wrong password. Say that instead of the more confusing "account
          // already exists," which reads like an error about registering.
          const message = registerErr instanceof Error ? registerErr.message : ""
          throw new Error(message.includes("already exists") ? "Incorrect email or password" : message)
        }
      }
      finish()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in")
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleSuccess(credentialResponse: CredentialResponse) {
    if (!credentialResponse.credential) return
    const { email: googleEmail } = jwtDecode<GoogleIdToken>(credentialResponse.credential)
    try {
      await socialLogin(googleEmail)
      finish()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in with Google")
    }
  }

  function handleFacebookLogin() {
    if (!window.FB) return
    window.FB.login(
      (response) => {
        if (!response.authResponse) return
        window.FB!.api("/me", { fields: "email" }, async (me) => {
          if (!me.email) return
          try {
            await socialLogin(me.email)
            finish()
          } catch (err) {
            setError(err instanceof Error ? err.message : "Could not sign in with Facebook")
          }
        })
      },
      { scope: "public_profile,email" }
    )
  }

  function handleAddressSubmit(e: FormEvent) {
    e.preventDefault()
    if (!selectedAddress) return
    setAddress(selectedAddress.displayName, { lat: selectedAddress.lat, lng: selectedAddress.lng })
    finish("/shop")
  }

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
      <div>
        <h3 className="text-lg font-semibold">I'm new</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Enter your delivery address to see what's available near you — you can create an
          account later.
        </p>
        <form onSubmit={handleAddressSubmit} className="mt-4 flex flex-col gap-3">
          <AddressAutocomplete onSelect={setSelectedAddress} />
          {selectedAddress ? (
            <DeliveryMap coordinates={{ lat: selectedAddress.lat, lng: selectedAddress.lng }} />
          ) : null}
          <Button type="submit" disabled={!selectedAddress}>
            Continue
          </Button>
        </form>
      </div>

      <div className="sm:border-l sm:pl-8">
        <h3 className="text-lg font-semibold">I'm back</h3>
        <p className="mt-1 text-sm text-muted-foreground">Sign in if you already have an account.</p>

        <div className="mt-4 flex flex-col gap-3">
          {GOOGLE_CLIENT_ID ? (
            <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
              <div className="flex justify-center [&>div]:w-full">
                <GoogleLogin onSuccess={handleGoogleSuccess} width="272" />
              </div>
            </GoogleOAuthProvider>
          ) : (
            <Button type="button" variant="outline" disabled>
              Sign in with Google (not configured)
            </Button>
          )}

          <Button
            type="button"
            variant="outline"
            disabled={!FACEBOOK_APP_ID || !facebookReady}
            onClick={handleFacebookLogin}
          >
            <FacebookMark />
            {FACEBOOK_APP_ID ? "Sign in with Facebook" : "Sign in with Facebook (not configured)"}
          </Button>

          <Button type="button" variant="outline" disabled title="Requires a paid Apple Developer account">
            Sign in with Apple (not available)
          </Button>
        </div>

        <div className="my-4 flex items-center gap-3">
          <div className="h-px flex-1 bg-border" />
          <span className="text-xs text-muted-foreground">or</span>
          <div className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="modal-email">Email</Label>
            <Input
              id="modal-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="modal-password">Password</Label>
            <Input
              id="modal-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <Button type="submit" className="mt-1" disabled={submitting}>
            {submitting ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      </div>
    </div>
  )
}
