import { Provider as ReduxProvider } from 'react-redux'
import { ThemeProvider } from '@/providers/theme-provider'
import { AuthProvider } from '@/providers/auth-provider'
import { store } from '@/redux/store'

interface IProvidersProps {
  children: React.ReactNode
}

export const Providers = ({ children }: IProvidersProps) => {
  return (
    <ReduxProvider store={store}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AuthProvider>{children}</AuthProvider>
      </ThemeProvider>
    </ReduxProvider>
  )
}
