import { useTranslation } from 'react-i18next'

export interface INotification {
  type: 'success' | 'error' | 'warning' | 'info'
  message: string
  description?: string
  duration?: number
  autoDismiss?: boolean
  dismissAfter?: number // milliseconds
}

export const ERROR_MESSAGES = {
  AUTHENTICATION_REQUIRED: 'Authentication required',
  COURSE_ID_REQUIRED: 'Course ID is required',
  NETWORK_ERROR: 'Network error occurred',
  UNKNOWN_ERROR: 'An unexpected error occurred',
  FILE_TOO_LARGE: 'File size exceeds maximum allowed',
  INVALID_FILE_TYPE: 'Invalid file type',
  COURSE_NOT_FOUND: 'Course not found',
  OPERATION_FAILED: 'Operation failed',
} as const

export const extractErrorMessage = (error: unknown): string => {
  if (error instanceof Error && '__apiError' in error) {
    const apiError = (
      error as Error & { __apiError?: { translationKey?: string; message?: string } }
    ).__apiError
    if (apiError?.translationKey) {
      return apiError.translationKey
    }
    if (apiError?.message) {
      return apiError.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  if (typeof error === 'string') {
    return error
  }

  if (error && typeof error === 'object' && 'message' in error) {
    return String(error.message)
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR
}

export const createErrorNotification = (
  error: unknown,
  title?: string,
  fallbackMessage?: string,
  options?: { autoDismiss?: boolean; dismissAfter?: number }
): INotification => {
  const message = extractErrorMessage(error)
  if (message.includes('.') || message.includes('_')) {
    const { t } = useTranslation()
    return {
      type: 'error',
      message: title || 'Error',
      description: t(message),
      autoDismiss: options?.autoDismiss ?? false,
      dismissAfter: options?.dismissAfter ?? 10000,
    }
  }

  return {
    type: 'error',
    message: title || 'Error',
    description: message || fallbackMessage || ERROR_MESSAGES.UNKNOWN_ERROR,
    autoDismiss: options?.autoDismiss ?? false,
    dismissAfter: options?.dismissAfter ?? 10000,
  }
}

export const createSuccessNotification = (
  message: string,
  description?: string,
  options?: { autoDismiss?: boolean; dismissAfter?: number }
): INotification => {
  return {
    type: 'success',
    message,
    description,
    autoDismiss: options?.autoDismiss ?? true,
    dismissAfter: options?.dismissAfter ?? 5000,
  }
}

export const createWarningNotification = (
  message: string,
  description?: string,
  options?: { autoDismiss?: boolean; dismissAfter?: number }
): INotification => {
  return {
    type: 'warning',
    message,
    description,
    autoDismiss: options?.autoDismiss ?? true,
    dismissAfter: options?.dismissAfter ?? 7000,
  }
}

export const createInfoNotification = (
  message: string,
  description?: string,
  options?: { autoDismiss?: boolean; dismissAfter?: number }
): INotification => {
  return {
    type: 'info',
    message,
    description,
    autoDismiss: options?.autoDismiss ?? true,
    dismissAfter: options?.dismissAfter ?? 6000,
  }
}

export interface IApiError {
  message: string
  error?: string
  status?: number
  details?: Record<string, unknown>
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof Response) {
    throw new Error(`HTTP ${error.status}: ${error.statusText}`)
  }

  if (error instanceof Error) {
    throw error
  }

  if (typeof error === 'string') {
    throw new Error(error)
  }

  throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR)
}

export const withErrorHandling = async <T>(
  operation: () => Promise<T>,
  errorContext?: string
): Promise<T> => {
  try {
    return await operation()
  } catch (error) {
    if (error instanceof Error && '__apiError' in error) {
      throw error
    }

    const message = extractErrorMessage(error)
    const contextMessage = errorContext ? `${errorContext}: ${message}` : message

    throw new Error(contextMessage)
  }
}
