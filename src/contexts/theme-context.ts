import { createContext } from 'react'

export type TThemeMode = 'light' | 'dark' | 'auto'

export interface IThemeProviderState {
  theme: TThemeMode
  setTheme: (theme: TThemeMode) => void
}

export const initialState: IThemeProviderState = {
  theme: 'auto',
  setTheme: () => null,
}

export const ThemeProviderContext = createContext<IThemeProviderState>(initialState)
