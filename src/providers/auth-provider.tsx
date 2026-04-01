import { useEffect, useState, useRef, useCallback } from 'react'
import type {
  AuthTokenResponse,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
  AuthResponse,
  Provider,
  OAuthResponse,
  Session,
} from '@supabase/supabase-js'
import { useDispatch } from 'react-redux'

import { supabase } from '@/configuration/supabase'
import { AuthContext } from '@/contexts/auth-context'
import type { IUserProfile, IUpdateUser } from '@/types/account'
import { getAuthHeaders } from '@/utils/auth'
import { apiRequest } from '@/utils/api'
import { isAuthError } from '@/utils/type-guards'
import { VITE_BACKEND_API_URL } from '../configuration/env'
import type { AppDispatch } from '@/redux/store'
import { resetApp } from '@/redux/app-actions'

interface IAuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: IAuthProviderProps) => {
  const dispatch = useDispatch<AppDispatch>()
  const [user, setUser] = useState<User | null>(null)
  const [userData, setUserData] = useState<IUserProfile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true)
  const [lastUserId, setLastUserId] = useState<string | null>(null)

  const currentSessionRef = useRef<string | null>(null)

  /**
   * Clear all Supabase auth keys from localStorage
   */
  const clearSupabaseStorage = () => {
    Object.keys(localStorage)
      .filter(key => key.startsWith('supabase.auth'))
      .forEach(key => localStorage.removeItem(key))
  }

  /**
   * Clear all auth state and reset the app
   */
  const clearAuthState = useCallback(() => {
    setUser(null)
    setUserData(null)
    setSession(null)
    setLastUserId(null)
    setIsLoading(false)
    setIsUserLoading(false)
    currentSessionRef.current = null
    dispatch(resetApp())
  }, [dispatch])

  /**
   * Force clear session locally without making API calls
   * This is used when the session has already expired and API calls would fail
   */
  const forceLocalLogout = useCallback(() => {
    console.warn('Forcing local session clear due to expiration.')
    clearAuthState()
    clearSupabaseStorage()
  }, [clearAuthState])

  const fetchUserData = useCallback(async () => {
    setIsUserLoading(true)
    try {
      const url = `${VITE_BACKEND_API_URL}/users/me`
      const headers = await getAuthHeaders()
      const response = await fetch(url, { method: 'GET', headers })

      if (response.status === 401 || response.status === 403) {
        console.warn('Unauthorized access detected, forcing local logout.')
        forceLocalLogout()
        return
      }

      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const responseData = await response.json()
      setUserData(responseData.data || {})
    } catch (error) {
      console.error(error)

      if (error instanceof Error && error.message.includes('auth')) {
        forceLocalLogout()
        return
      }

      setUserData(null)
    } finally {
      setIsUserLoading(false)
    }
  }, [forceLocalLogout])

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      const currentUser = session?.user

      if (event === 'SIGNED_OUT') {
        if (currentSessionRef.current) {
          console.warn('Session expired or signed out from another device.')
          forceLocalLogout()
        } else {
          clearAuthState()
        }
        return
      }

      setUser(currentUser ?? null)

      if (currentUser && session) {
        currentSessionRef.current = session.access_token

        // Only fetch user data if the user ID changed
        if (currentUser.id !== lastUserId) {
          dispatch(resetApp())
          await fetchUserData()
          setLastUserId(currentUser.id)
        } else {
          setIsUserLoading(false)
        }
      } else {
        setUserData(null)
        setIsUserLoading(false)
        setLastUserId(null)
        currentSessionRef.current = null
      }

      setSession(session)
      setIsLoading(false)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [forceLocalLogout, clearAuthState, fetchUserData, lastUserId, dispatch])

  const signInWithEmail = async (
    credentials: SignInWithPasswordCredentials
  ): Promise<AuthTokenResponse> => {
    return supabase.auth.signInWithPassword(credentials)
  }

  const signOut = async () => {
    const result = await supabase.auth.signOut()
    if (!result.error) {
      dispatch(resetApp())
    }
    return result
  }

  const signUp = async (credentials: SignUpWithPasswordCredentials): Promise<AuthResponse> => {
    return supabase.auth.signUp(credentials)
  }

  const signInWithOAuth = async (provider: Provider): Promise<OAuthResponse> => {
    return supabase.auth.signInWithOAuth({
      provider,
    })
  }

  const resetPasswordForEmail = async (email: string) => {
    return supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })
  }

  const updatePassword = async (password: string) => {
    return supabase.auth.updateUser({ password })
  }

  const updateEmail = async (email: string) => {
    return supabase.auth.updateUser({ email })
  }

  const updateSupabaseUser = async (user: IUpdateUser) => {
    const result = await supabase.auth.updateUser({
      data: {
        firstName: user.firstName,
        lastName: user.lastName,
      },
    })

    if (!result.error && userData) {
      setUserData({
        ...userData,
        firstName: user.firstName || userData.firstName,
        lastName: user.lastName || userData.lastName,
      })
    }

    return result
  }

  /**
   * Update user profile via backend API
   * @param user - User profile data to update (firstName, lastName)
   * @returns Promise with updated profile data or error
   */
  const updateUserProfile = async (user: IUpdateUser) => {
    try {
      const response = await apiRequest<{ data: IUserProfile }>('/users/me', {
        method: 'PATCH',
        body: JSON.stringify({
          firstName: user.firstName,
          lastName: user.lastName,
        }),
      })

      // Update local userData state with the response
      setUserData(response.data)

      return {
        data: response.data,
        error: null,
      }
    } catch (error) {
      console.error('Failed to update user profile:', error)

      // Handle authentication errors
      if (isAuthError(error)) {
        forceLocalLogout()
      }

      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to update user profile'),
      }
    }
  }

  /**
   * Delete user account via backend API
   * @returns Promise with success status or error
   */
  const deleteUserAccount = async () => {
    try {
      const token = await supabase.auth.getSession().then(({ data }) => data.session?.access_token)
      if (!token) {
        throw new Error('Authentication required')
      }

      const response = await fetch(`${VITE_BACKEND_API_URL}/users/me`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      // Handle 401/403 errors
      if (response.status === 401 || response.status === 403) {
        console.warn('Unauthorized access detected, forcing local logout.')
        forceLocalLogout()
        return {
          data: null,
          error: new Error('Unauthorized'),
        }
      }

      // Handle both 204 (no content) and 200 responses as success
      if (response.status === 204 || response.status === 200) {
        // Sign out after successful account deletion
        await signOut()
        return {
          data: { success: true },
          error: null,
        }
      }

      // Handle other error responses
      const errorData = await response.json().catch(() => ({
        message: 'Failed to delete account',
      }))

      return {
        data: null,
        error: new Error(errorData.message || 'Failed to delete account'),
      }
    } catch (error) {
      console.error('Failed to delete user account:', error)

      // Handle authentication errors
      if (error instanceof Error && error.message.includes('auth')) {
        forceLocalLogout()
      }

      return {
        data: null,
        error: error instanceof Error ? error : new Error('Failed to delete user account'),
      }
    }
  }

  const resendEmailVerification = async () => {
    if (user?.new_email) {
      return supabase.auth.resend({
        type: 'email_change',
        email: user?.email || '',
      })
    } else {
      return supabase.auth.resend({
        type: 'signup',
        email: user?.email || '',
      })
    }
  }

  const deleteAccount = async () => {
    return supabase.functions.invoke('self-user-deletion')
  }

  const getJwtToken = (): string | null => {
    return session?.access_token || null
  }

  const value = {
    user,
    userData,
    session,
    isLoading,
    isUserLoading,
    signInWithEmail,
    signOut,
    signUp,
    signInWithOAuth,
    resetPasswordForEmail,
    updatePassword,
    updateEmail,
    resendEmailVerification,
    updateSupabaseUser,
    updateUserProfile,
    deleteAccount,
    deleteUserAccount,
    getJwtToken,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
