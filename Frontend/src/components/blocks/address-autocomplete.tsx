import { Loader2, MapPin } from "lucide-react"
import { useEffect, useRef, useState } from "react"

import { Input } from "@/components/ui/input"
import { searchAddress, type GeocodeResult } from "@/lib/geocode"

export function AddressAutocomplete({
  onSelect,
}: {
  onSelect: (result: GeocodeResult) => void
}) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeocodeResult[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    if (query.trim().length < 4) return

    debounceRef.current = setTimeout(async () => {
      setLoading(true)
      const found = await searchAddress(query)
      setResults(found)
      setLoading(false)
      setOpen(true)
    }, 400)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  function handleSelect(result: GeocodeResult) {
    setQuery(result.displayName)
    setOpen(false)
    setResults([])
    onSelect(result)
  }

  return (
    <div className="relative">
      <div className="relative">
        <Input
          required
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder="Start typing your address..."
          className="pr-9"
        />
        {loading ? (
          <Loader2 className="absolute right-3 top-1/2 size-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        ) : null}
      </div>

      {open && query.trim().length >= 4 && results.length > 0 ? (
        <ul className="absolute z-10 mt-1 w-full rounded-lg border bg-popover p-1 shadow-md">
          {results.map((result) => (
            <li key={`${result.lat},${result.lng}`}>
              <button
                type="button"
                onClick={() => handleSelect(result)}
                className="flex w-full items-start gap-2 rounded-md p-2 text-left text-sm hover:bg-accent"
              >
                <MapPin className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                <span>{result.displayName}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}
