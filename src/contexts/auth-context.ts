import type {
  AuthResponse,
  AuthTokenResponse,
  OAuthResponse,
  Provider,
  SignInWithPasswordCredentials,
  SignUpWithPasswordCredentials,
  User,
  Session,
} from '@supabase/supabase-js'
import { createContext } from 'react'
import type { IUserProfile, IUpdateUser } from '@/types/account'

/**
 * Response for email verification resend
 */
export interface IResendVerificationResponse {
  user: User | null
  session: null
  messageId?: string | null
}

/**
 * Response for account deletion
 */
export interface IDeleteAccountResponse {
  success: boolean
}

export interface AuthContextType {
  user: User | null
  userData: IUserProfile | null
  session: Session | null
  isLoading: boolean
  isUserLoading: boolean
  signInWithEmail: (credentials: SignInWithPasswordCredentials) => Promise<AuthTokenResponse>
  signOut: () => Promise<{ error: Error | null }>
  signUp: (credentials: SignUpWithPasswordCredentials) => Promise<AuthResponse>
  signInWithOAuth: (provider: Provider) => Promise<OAuthResponse>
  resetPasswordForEmail: (email: string) => Promise<{
    data: Record<string, never> | null
    error: Error | null
  }>
  updatePassword: (password: string) => Promise<{
    data: { user: User | null }
    error: Error | null
  }>
  updateSupabaseUser: (user: IUpdateUser) => Promise<{
    data: { user: User | null }
    error: Error | null
  }>
  updateUserProfile: (user: IUpdateUser) => Promise<{
    data: IUserProfile | null
    error: Error | null
  }>
  updateEmail: (email: string) => Promise<{
    data: { user: User | null }
    error: Error | null
  }>
  resendEmailVerification: () => Promise<{
    data: IResendVerificationResponse | null
    error: Error | null
  }>
  deleteAccount: () => Promise<{
    data: IDeleteAccountResponse | null
    error: Error | null
  }>
  deleteUserAccount: () => Promise<{
    data: IDeleteAccountResponse | null
    error: Error | null
  }>
  getJwtToken: () => string | null
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined)
