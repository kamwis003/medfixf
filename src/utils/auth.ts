import { supabase } from '@/configuration/supabase'

/**
 * Gets the current authentication token from Supabase session
 * @returns Promise<string | null> - The access token or null if not authenticated
 */
export const getAuthToken = async (): Promise<string | null> => {
  const {
    data: { session },
  } = await supabase.auth.getSession()
  return session?.access_token || null
}

/**
 * Creates headers for authenticated API requests
 * @returns Promise<HeadersInit> - Headers with authentication token
 */
export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await getAuthToken()
  if (!token) {
    throw new Error('No authentication token found')
  }

  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}
