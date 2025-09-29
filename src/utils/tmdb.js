const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL
const API_KEY = import.meta.env.VITE_TMDB_API_KEY

if (!API_KEY) {
  // Non-fatal: allow app to run but surfaces a clear message in UI when requests fail
  console.warn('Missing VITE_TMDB_API_KEY in your .env file')
}

export async function tmdb(path, params = {}) {
  const url = new URL(path, BASE_URL)
  const search = new URLSearchParams({ ...params })
  // Use Bearer token if provided, else fallback to api_key query param
  const bearer = import.meta.env.VITE_TMDB_BEARER
  const headers = bearer ? { Authorization: `Bearer ${bearer}` } : undefined
  if (!bearer) search.set('api_key', API_KEY || '')
  url.search = search.toString()

  const res = await fetch(url.toString(), { headers })
  if (!res.ok) {
    const text = await res.text()
    console.error('TMDB Error:', text)
    throw new Error(`TMDB request failed (${res.status}) - ${text}`)
  }
  return res.json()
}

export const img = (path, size = 'w500') => path ? `https://image.tmdb.org/t/p/${size}${path}` : ''
