import { Outlet } from 'react-router-dom'
import { ModeToggle } from './mode-toggle'
// import { useAuth } from '@/hooks/use-auth'
import { LanguageSwitcher } from './language-switcher'
import * as React from 'react'
import { Skeleton } from './ui/skeleton'
import { ScrollToTop } from './scroll-to-top'
import { CookieConsent } from './blocks/cookie-consent'

export const AppLayout = () => {
  // const { user } = useAuth()

  return (
    <div className="bg-background text-foreground flex min-h-screen flex-col antialiased">
      <ScrollToTop />
      <header
        className={`border-border overflow-hidden fixed top-0 z-10 h-16 w-full items-center justify-end border-b bg-background px-4 md:px-6 hidden`}
      >
        <div className="flex items-center gap-4">
          <React.Suspense fallback={<Skeleton className="h-10 w-32" />}>
            <LanguageSwitcher />
          </React.Suspense>
          <ModeToggle />
        </div>
      </header>
      <main className={`flex-1 pt-0`}>
        <Outlet />
      </main>
      <CookieConsent variant="default" isDeclineShown={false} />
    </div>
  )
}
