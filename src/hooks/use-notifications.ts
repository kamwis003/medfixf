import { useState, useEffect, useRef } from 'react'
import type { INotification } from '@/utils/error-handling'
import {
  createErrorNotification,
  createSuccessNotification,
  createWarningNotification,
  createInfoNotification,
} from '@/utils/error-handling'

interface INotificationOptions {
  autoDismiss?: boolean
  dismissAfter?: number
}

interface IUseNotificationsReturn {
  notification: INotification | null
  showSuccess: (message: string, description?: string, options?: INotificationOptions) => void
  showError: (
    error: unknown,
    title?: string,
    fallbackMessage?: string,
    options?: INotificationOptions
  ) => void
  showWarning: (message: string, description?: string, options?: INotificationOptions) => void
  showInfo: (message: string, description?: string, options?: INotificationOptions) => void
  clearNotification: () => void
  setNotification: (notification: INotification | null) => void
}

/**
 * Custom hook for managing notifications consistently
 */
export const useNotifications = (): IUseNotificationsReturn => {
  const [notification, setNotification] = useState<INotification | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const clearNotificationTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
  }

  const setAutoDismiss = (notification: INotification) => {
    if (notification.autoDismiss && notification.dismissAfter) {
      clearNotificationTimeout()
      timeoutRef.current = setTimeout(() => {
        setNotification(null)
      }, notification.dismissAfter)
    }
  }

  const showSuccess = (message: string, description?: string, options?: INotificationOptions) => {
    const newNotification = createSuccessNotification(message, description, options)
    setNotification(newNotification)
    setAutoDismiss(newNotification)
  }

  const showError = (
    error: unknown,
    title?: string,
    fallbackMessage?: string,
    options?: INotificationOptions
  ) => {
    const newNotification = createErrorNotification(error, title, fallbackMessage, options)
    setNotification(newNotification)
    setAutoDismiss(newNotification)
  }

  const showWarning = (message: string, description?: string, options?: INotificationOptions) => {
    const newNotification = createWarningNotification(message, description, options)
    setNotification(newNotification)
    setAutoDismiss(newNotification)
  }

  const showInfo = (message: string, description?: string, options?: INotificationOptions) => {
    const newNotification = createInfoNotification(message, description, options)
    setNotification(newNotification)
    setAutoDismiss(newNotification)
  }

  const clearNotification = () => {
    clearNotificationTimeout()
    setNotification(null)
  }

  useEffect(() => {
    return () => {
      clearNotificationTimeout()
    }
  }, [])

  return {
    notification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearNotification,
    setNotification,
  }
}
