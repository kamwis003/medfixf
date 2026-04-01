import { VITE_BACKEND_API_URL } from '@/configuration/env'
import { getAuthToken } from './auth'
import { createApiError, isApiError } from './type-guards'

interface IApiErrorResponse {
  message: string
  error?: string
  status?: number
  translationKey?: string
}

/**
 * Generic API request function with authentication
 * @param endpoint - API endpoint path
 * @param options - Fetch options
 * @returns Promise with API response
 */
export const apiRequest = async <T>(endpoint: string, options: RequestInit = {}): Promise<T> => {
  try {
    const token = await getAuthToken()
    if (!token) {
      throw new Error('Authentication required')
    }

    const response = await fetch(`${VITE_BACKEND_API_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData: IApiErrorResponse = await response.json().catch(() => ({
        message: 'An error occurred',
      }))

      // Prefer server translation key when present so client can translate
      const preferred = errorData.translationKey ?? errorData.message

      // Create a structured error with metadata
      throw createApiError(String(preferred), {
        status: errorData.status ?? response.status,
        translationKey: errorData.translationKey,
      })
    }

    return await response.json()
  } catch (error) {
    // If it's already an API error, re-throw it
    if (isApiError(error)) {
      throw error
    }
    // If it's a standard error, re-throw it
    if (error instanceof Error) {
      throw error
    }
    // For unknown errors, throw a generic error
    throw new Error('errors.unknownError')
  }
}
