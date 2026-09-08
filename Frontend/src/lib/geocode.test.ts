import { afterEach, describe, expect, it, vi } from 'vitest'
import { searchAddress } from '@/lib/geocode'

describe('searchAddress', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns an empty array for a blank query without calling fetch', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)

    const result = await searchAddress('   ')

    expect(result).toEqual([])
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('maps Nominatim results to GeocodeResult', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: true,
        json: () =>
          Promise.resolve([{ display_name: '123 Main St, Toronto', lat: '43.65', lon: '-79.38' }]),
      })
    )

    const result = await searchAddress('123 Main St')

    expect(result).toEqual([{ displayName: '123 Main St, Toronto', lat: 43.65, lng: -79.38 }])
  })

  it('restricts the search to Canada and limits results to 5', async () => {
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve([]) })
    vi.stubGlobal('fetch', fetchSpy)

    await searchAddress('Main St')

    const [url] = fetchSpy.mock.calls[0]
    const parsed = new URL(url as string)
    expect(parsed.searchParams.get('countrycodes')).toBe('ca')
    expect(parsed.searchParams.get('limit')).toBe('5')
  })

  it('returns an empty array when the request fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }))
    const result = await searchAddress('Main St')
    expect(result).toEqual([])
  })
})
