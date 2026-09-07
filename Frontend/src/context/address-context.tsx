import { createContext, useContext, useState, type ReactNode } from "react"

export interface Coordinates {
  lat: number
  lng: number
}

interface AddressContextValue {
  address: string | null
  coordinates: Coordinates | null
  setAddress: (address: string, coordinates?: Coordinates) => void
}

const AddressContext = createContext<AddressContextValue | null>(null)

const ADDRESS_KEY = "tipsy-address"
const COORDINATES_KEY = "tipsy-address-coordinates"

function getInitialCoordinates(): Coordinates | null {
  const stored = localStorage.getItem(COORDINATES_KEY)
  return stored ? (JSON.parse(stored) as Coordinates) : null
}

export function AddressProvider({ children }: { children: ReactNode }) {
  const [address, setAddressState] = useState<string | null>(() =>
    localStorage.getItem(ADDRESS_KEY)
  )
  const [coordinates, setCoordinatesState] = useState<Coordinates | null>(getInitialCoordinates)

  function setAddress(value: string, nextCoordinates?: Coordinates) {
    localStorage.setItem(ADDRESS_KEY, value)
    setAddressState(value)

    if (nextCoordinates) {
      localStorage.setItem(COORDINATES_KEY, JSON.stringify(nextCoordinates))
      setCoordinatesState(nextCoordinates)
    } else {
      localStorage.removeItem(COORDINATES_KEY)
      setCoordinatesState(null)
    }
  }

  return (
    <AddressContext.Provider value={{ address, coordinates, setAddress }}>
      {children}
    </AddressContext.Provider>
  )
}

export function useAddress() {
  const ctx = useContext(AddressContext)
  if (!ctx) throw new Error("useAddress must be used within an AddressProvider")
  return ctx
}
