import { Logo } from '@/assets/logo'

export const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Logo className="h-24 w-auto animate-pulse" />
    </div>
  )
}
