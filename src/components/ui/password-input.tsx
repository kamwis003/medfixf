import { useState, forwardRef } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

export interface PasswordInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  toggleAriaLabel?: string
  showPasswordLabel?: string
  hidePasswordLabel?: string
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  (
    {
      className,
      toggleAriaLabel = 'Toggle password visibility',
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)

    return (
      <div className="relative">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          {...props}
        />
        <button
          type="button"
          className="absolute right-0 top-0 flex h-full items-center justify-center px-3 text-muted-foreground cursor-pointer"
          onClick={() => setShowPassword(!showPassword)}
          title={showPassword ? hidePasswordLabel : showPasswordLabel}
          aria-label={toggleAriaLabel}
        >
          {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    )
  }
)

PasswordInput.displayName = 'PasswordInput'
