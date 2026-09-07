export interface GeocodeResult {
  displayName: string
  lat: number
  lng: number
}

interface NominatimResult {
  display_name: string
  lat: string
  lon: string
}

/**
 * Free address search via OpenStreetMap's Nominatim — no API key. Nominatim's
 * usage policy caps this at ~1 request/second, which is why callers should
 * debounce keystrokes rather than search on every character.
 */
export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  if (!query.trim()) return []

  const params = new URLSearchParams({
    q: query,
    format: "json",
    countrycodes: "ca",
    limit: "5",
  })

  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`)
  if (!res.ok) return []

  const data = (await res.json()) as NominatimResult[]
  return data.map((item) => ({
    displayName: item.display_name,
    lat: parseFloat(item.lat),
    lng: parseFloat(item.lon),
  }))
}
