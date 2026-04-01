export interface ICookieSetOptions {
  maxAgeDays?: number
  maxAgeSeconds?: number
  expires?: Date
  path?: string
  sameSite?: 'Lax' | 'Strict' | 'None'
}

const isBrowser = () => typeof document !== 'undefined'

export const getCookie = (name: string): string | undefined => {
  if (!isBrowser()) return undefined

  const cookieString = document.cookie
  if (!cookieString) return undefined

  const cookies = cookieString.split('; ')
  const targetPrefix = `${encodeURIComponent(name)}=`

  const match = cookies.find(cookie => cookie.startsWith(targetPrefix))
  if (!match) return undefined

  const rawValue = match.slice(targetPrefix.length)
  return decodeURIComponent(rawValue)
}

export const setCookie = (name: string, value: string, options: ICookieSetOptions = {}): void => {
  if (!isBrowser()) return

  const { maxAgeDays = 365, maxAgeSeconds, expires, path = '/', sameSite = 'Lax' } = options

  const encodedName = encodeURIComponent(name)
  const encodedValue = encodeURIComponent(value)

  const secure =
    typeof window !== 'undefined' && window.location.protocol === 'https:' ? '; Secure' : ''

  const ageAttribute =
    typeof maxAgeSeconds === 'number'
      ? `; Max-Age=${Math.floor(maxAgeSeconds)}`
      : `; Max-Age=${Math.floor(maxAgeDays * 24 * 60 * 60)}`

  const expiresAttribute = expires instanceof Date ? `; Expires=${expires.toUTCString()}` : ''

  document.cookie = `${encodedName}=${encodedValue}; Path=${path}${expiresAttribute}${ageAttribute}; SameSite=${sameSite}${secure}`
}
