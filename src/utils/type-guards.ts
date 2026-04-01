/**
 * Type guards and type utilities for safe type narrowing
 */

/**
 * Interface for API errors with optional metadata
 */
export interface IApiErrorMetadata {
  status?: number
  translationKey?: string
}

/**
 * Extended Error type with API error metadata
 */
export interface IApiError extends Error {
  __apiError?: IApiErrorMetadata
}

/**
 * Type guard to check if an error is an API error with metadata
 */
export function isApiError(error: unknown): error is IApiError {
  return (
    error instanceof Error &&
    '__apiError' in error &&
    typeof (error as IApiError).__apiError === 'object'
  )
}

/**
 * Type guard to check if an error has a status code
 */
export function hasStatusCode(
  error: unknown
): error is IApiError & { __apiError: { status: number } } {
  return (
    isApiError(error) &&
    error.__apiError !== undefined &&
    typeof error.__apiError.status === 'number'
  )
}

/**
 * Type guard to check if an error has a translation key
 */
export function hasTranslationKey(
  error: unknown
): error is IApiError & { __apiError: { translationKey: string } } {
  return (
    isApiError(error) &&
    error.__apiError !== undefined &&
    typeof error.__apiError.translationKey === 'string'
  )
}

/**
 * Safely extract error message from unknown error
 * @param error - Unknown error object
 * @param fallback - Fallback message if error cannot be extracted
 * @returns Error message string
 */
export function getErrorMessage(error: unknown, fallback = 'An error occurred'): string {
  if (error instanceof Error) {
    return error.message
  }
  if (typeof error === 'string') {
    return error
  }
  return fallback
}

/**
 * Safely extract API error translation key or message
 * @param error - Unknown error object
 * @returns Translation key or error message
 */
export function getApiErrorMessage(error: unknown): string | null {
  if (hasTranslationKey(error)) {
    return error.__apiError.translationKey
  }
  if (isApiError(error)) {
    return error.message
  }
  if (error instanceof Error) {
    return error.message
  }
  return null
}

/**
 * Check if error is an authentication error (401/403)
 * @param error - Unknown error object
 * @returns True if error is 401 or 403
 */
export function isAuthError(error: unknown): boolean {
  if (!hasStatusCode(error)) {
    return false
  }
  const status = error.__apiError.status
  return status === 401 || status === 403
}

/**
 * Create an API error with metadata
 * @param message - Error message
 * @param metadata - Optional API error metadata
 * @returns API error with metadata
 */
export function createApiError(message: string, metadata?: IApiErrorMetadata): IApiError {
  const error = new Error(message) as IApiError
  if (metadata) {
    error.__apiError = metadata
  }
  return error
}
