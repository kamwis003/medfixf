# Virtual Fixmed React - Development Guidelines

You are an expert in TypeScript, React, Vite, React Router v7, Shadcn UI, Radix UI, Tailwind CSS, Supabase, and Redux Toolkit.

## Code Style and Structure

- Write concise, technical TypeScript code with accurate examples.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError, canSubmit).
- Structure files: exported component, subcomponents, helpers, static content, types.
- Keep components focused and single-responsibility; extract logic into custom hooks.

## Naming Conventions

### Directories and Files

- Use lowercase with dashes for directories (e.g., `components/auth-wizard`, `hooks/use-auth`).
- Component files use kebab-case (e.g., `login-form.tsx`, `app-sidebar.tsx`).
- Favor named exports for components.

### TypeScript Conventions

- **Interfaces:** Prefix with `I` (e.g., `IUserProfile`, `IAuthProviderProps`).
- **Type Aliases:** Prefix with `T` (e.g., `TUserRole`, `TThemeMode`).
- **Components:** Use PascalCase (e.g., `LoginForm`, `AppSidebar`).
- **Hooks:** Prefix with `use` (e.g., `useAuth`, `useTheme`).
- **Constants:** Use UPPER_SNAKE_CASE for true constants (e.g., `API_URL`).

## TypeScript Usage

- Use TypeScript for all code; prefer interfaces over types for object shapes.
- Avoid enums; use string literal types or const objects instead.
- Use functional components with TypeScript interfaces.
- Enable strict mode and maintain zero TypeScript errors.
- Utilize path aliases: `@/*` maps to `src/*`.

### Interface Pattern Examples

```typescript
// Component props
interface IButtonProps {
  variant?: 'default' | 'destructive' | 'outline'
  size?: 'default' | 'sm' | 'lg'
  children: React.ReactNode
  className?: string
}

// Data models
interface IUserProfile {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  role: TUserRole
}

// Type aliases for unions
type TUserRole = 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
type TThemeMode = 'light' | 'dark' | 'auto'
```

## Syntax and Formatting

- Use the "function" keyword for pure functions and utilities.
- Use arrow functions for component definitions and callbacks.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use declarative JSX with proper component composition.
- Destructure props and hook returns for cleaner code.

## Project Structure

```
src/
├── assets/          # SVG components (logo, placeholders)
├── components/      # React components
│   ├── blocks/      # Complex reusable components (CookieConsent)
│   └── ui/          # Shadcn UI base components (17 components)
├── configuration/   # App config (Supabase, i18n, env validation)
├── contexts/        # React contexts (Auth, Theme)
├── hooks/           # Custom React hooks
├── layouts/         # Layout components (AppLayout, DashboardLayout)
├── lib/             # Utility functions and helpers
├── pages/           # Page components
├── providers/       # Context providers
├── redux/           # Redux store setup and slices
├── routes/          # Routing configuration
├── types/           # TypeScript type definitions
└── utils/           # Helper utilities (auth, cookies)
```

## React Patterns

### Component Structure

- **UI Components** (`components/ui/`): Base Shadcn UI components using Radix primitives.
- **Blocks** (`components/blocks/`): Complex composed components (e.g., CookieConsent).
- **Pages** (`pages/`): Route-level components.
- **Layouts** (`layouts/`): Page structure components.

### Component Composition Pattern

```typescript
import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const componentVariants = cva(
  'base-classes',
  {
    variants: {
      variant: {
        default: 'variant-classes',
        destructive: 'variant-classes'
      },
      size: {
        default: 'size-classes',
        sm: 'size-classes'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface IComponentProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof componentVariants> {
  asChild?: boolean
}

export const Component = React.forwardRef<HTMLElement, IComponentProps>(
  ({ variant, size, className, asChild = false, ...props }, ref) => {
    return (
      <Element
        ref={ref}
        className={cn(componentVariants({ variant, size, className }))}
        {...props}
      />
    )
  }
)

Component.displayName = 'Component'
```

## UI and Styling

### Shadcn UI Configuration

- **Style:** "new-york"
- **Base Color:** neutral
- **CSS Variables:** Enabled for theming
- **Icon Library:** Lucide React

### Tailwind CSS

- Use Tailwind CSS v4 with Vite plugin.
- Implement responsive design with mobile-first approach.
- Use `cn()` utility from `@/lib/utils` for conditional classes.
- Dark mode via `.dark` class on root element.

### Styling Patterns

```typescript
// Conditional classes
<div className={cn(
  'base-classes',
  isActive && 'active-classes',
  variant === 'outline' && 'outline-classes',
  className
)} />

// Responsive design
<div className="flex flex-col md:flex-row lg:grid lg:grid-cols-3" />

// Dark mode
<div className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-50" />
```

## Routing (React Router v7)

- Use `createBrowserRouter` with data router API.
- Implement nested routing with `Outlet` components.
- Protected routes via route guards with auth context.
- Use loaders for data fetching at route level.
- Error boundaries with `errorElement` prop.

### Route Pattern

```typescript
import { createBrowserRouter } from 'react-router'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <HomePage />
      },
      {
        path: 'dashboard',
        element: <ProtectedRoute><DashboardLayout /></ProtectedRoute>,
        children: [
          { index: true, element: <DashboardPage /> }
        ]
      }
    ]
  }
])
```

## State Management

### Redux Toolkit

- Global app state managed via Redux Toolkit.
- Typed hooks: `useAppDispatch`, `useAppSelector` from `@/redux/hooks`.
- Create slices for feature-specific state.
- Use RTK Query for API data fetching when appropriate.

### React Context

- **AuthContext:** User authentication state, session management.
- **ThemeContext:** Dark/light/auto theme switching.
- Use custom hooks to consume contexts: `useAuth()`, `useTheme()`.

### State Hierarchy

```
Global App State (Redux) → App-wide data, API cache
       ↓
Feature State (Contexts) → Auth, Theme, Language
       ↓
Local State (Hooks) → Component UI state, forms
```

## Forms and Validation

- Use `react-hook-form` for form state management.
- Use `zod` for schema validation with `zodResolver`.
- Display inline error messages from validation.
- Implement loading and disabled states during submission.

### Form Pattern

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

type TFormData = z.infer<typeof formSchema>

export function LoginForm() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<TFormData>({
    resolver: zodResolver(formSchema)
  })

  const onSubmit = async (data: TFormData) => {
    // Handle submission
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Loading...' : 'Submit'}
      </button>
    </form>
  )
}
```

## Authentication (Supabase)

- Use Supabase client from `@/configuration/supabase`.
- Implement AuthProvider with custom `useAuth()` hook.
- Session management with auto-refresh tokens.
- PKCE flow for OAuth authentication.
- Force logout on 401/403 responses.

### Auth Pattern

```typescript
// utils/auth.ts
export const getAuthHeaders = async (): Promise<HeadersInit> => {
  const token = await getAuthToken()
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }
}

// Usage in components
const { user, isLoading, signIn, signOut } = useAuth()

const handleLogin = async (email: string, password: string) => {
  await signIn(email, password)
}
```

## API Integration

- Backend API URL from environment: `VITE_BACKEND_API_URL`.
- Use `getAuthHeaders()` for authenticated requests.
- Handle 401/403 with forced logout.
- Implement proper error handling with status codes.
- Consider RTK Query for complex data fetching needs.

### API Pattern

```typescript
const response = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/endpoint`, {
  method: 'POST',
  headers: await getAuthHeaders(),
  body: JSON.stringify(data),
})

if (!response.ok) {
  if (response.status === 401 || response.status === 403) {
    forceLocalLogout()
    return
  }
  throw new Error('API request failed')
}

const result = await response.json()
```

## Internationalization (i18n)

- Use `react-i18next` for translations.
- Supported languages: Polish (default), English, Ukrainian.
- Translation files in `public/locales/{lang}/translation.json`.
- Use `useTranslation` hook in every component with user-facing text.
- No hardcoded strings; all text must be translatable.

### i18n Pattern

```typescript
import { useTranslation } from 'react-i18next'

export function Component() {
  const { t } = useTranslation()

  return (
    <div>
      <h1>{t('pages.dashboard.title')}</h1>
      <p>{t('pages.dashboard.description', { count: 5 })}</p>
    </div>
  )
}
```

## Environment Variables

- Validate environment variables at startup using Zod schema.
- Required variables:
  - `VITE_SUPABASE_URL`: Supabase project URL
  - `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key
  - `VITE_BACKEND_API_URL`: Backend API base URL
- Access via `import.meta.env.VITE_*`.

## Error Handling

- Implement try-catch blocks in all async operations.
- Display user-friendly error messages via i18n.
- Log errors to console for debugging.
- Handle network errors gracefully.
- Use error boundaries at route level.
- Clear sensitive state on authentication errors.

### Error Pattern

```typescript
try {
  const result = await apiCall()
  return result
} catch (error) {
  console.error('Operation failed:', error)
  const errorMessage = error instanceof Error ? error.message : t('errors.unknownError')
  toast.error(errorMessage)
}
```

## Performance Optimization

- Use `React.lazy` and `Suspense` for code splitting.
- Wrap lazy-loaded components with loading fallback.
- Minimize unnecessary re-renders with proper dependency arrays.
- Use `React.memo` strategically for expensive components.
- Optimize images: use WebP format, implement lazy loading.
- Leverage Vite's code splitting capabilities.

## Accessibility

- Use semantic HTML elements.
- Include ARIA labels where needed.
- Support keyboard navigation.
- Ensure color contrast meets WCAG standards.
- Use `sr-only` class for screen reader only content.
- Test with keyboard and screen readers.

## Testing (To Be Implemented)

- Set up Vitest for unit and integration tests.
- Use React Testing Library for component tests.
- Mock Supabase with test utilities.
- Test user interactions and form submissions.
- Aim for high test coverage on critical paths.

## Security Best Practices

- Validate environment variables at startup.
- Use PKCE flow for OAuth authentication.
- Implement auto-refresh for tokens.
- Use HttpOnly, Secure, SameSite cookies.
- Clear sensitive state on logout.
- Sanitize user inputs.
- Never expose API keys or secrets in client code.

## Key Conventions

- Always use path aliases (`@/*`) for imports.
- Export components and utilities with named exports.
- Use `import * as React from 'react'` for React imports.
- Keep files under 300 lines; extract when larger.
- One component per file (except compound components).
- Co-locate related files (component, styles, tests).

## Development Workflow

1. Run development server: `pnpm dev`
2. Build for production: `pnpm build`
3. Preview production build: `pnpm preview`
4. Lint code: `pnpm lint`
5. Type check: `pnpm tsc --noEmit`

## Additional Resources

- For Shadcn UI components: <https://ui.shadcn.com>
- For Radix primitives: <https://radix-ui.com>
- For React Router: <https://reactrouter.com>
- For Supabase: <https://supabase.com/docs>
- For up-to-date library usage, always use context7.
- You can store memory inside memory bank MCP for future reference
