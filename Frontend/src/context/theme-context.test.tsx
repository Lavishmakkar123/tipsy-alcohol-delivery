import { act, renderHook } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider, useTheme } from '@/context/theme-context'

function renderTheme() {
  return renderHook(() => useTheme(), { wrapper: ThemeProvider })
}

describe('useTheme', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('throws when used outside a ThemeProvider', () => {
    expect(() => renderHook(() => useTheme())).toThrow('useTheme must be used within a ThemeProvider')
  })

  it('defaults to light when nothing is stored', () => {
    const { result } = renderTheme()
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('reads a previously stored theme', () => {
    localStorage.setItem('tipsy-theme', 'dark')
    const { result } = renderTheme()
    expect(result.current.theme).toBe('dark')
  })

  it('ignores an invalid stored value and falls back to light', () => {
    localStorage.setItem('tipsy-theme', 'purple')
    const { result } = renderTheme()
    expect(result.current.theme).toBe('light')
  })

  it('toggleTheme flips the theme and persists it', () => {
    const { result } = renderTheme()
    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('dark')
    expect(localStorage.getItem('tipsy-theme')).toBe('dark')
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    act(() => result.current.toggleTheme())
    expect(result.current.theme).toBe('light')
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
