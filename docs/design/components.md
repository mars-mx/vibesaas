# Component Development Guide

## shadcn/ui Component Architecture

### Installation & Setup

```bash
# Install a component
npx shadcn@latest add button
npx shadcn@latest add card dialog form

# Components are added to src/components/ui/
```

### Component Structure with CVA

Use Class Variance Authority for component variants:

```tsx
// components/ui/button.tsx
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  // Base styles
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary"
      },
      size: {
        default: "h-10 py-2 px-4",
        sm: "h-9 px-3 rounded-md",
        lg: "h-11 px-8 rounded-md",
        icon: "h-10 w-10"
      }
    },
    defaultVariants: {
      variant: "default",
      size: "default"
    }
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
```

## Utility Functions

### cn() Helper

```typescript
// lib/utils.ts
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

## Component Patterns

### Compound Components

```tsx
// components/ui/card.tsx
const Card = ({ className, ...props }) => (
  <div className={cn("rounded-lg border bg-card", className)} {...props} />
)

const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
)

const CardTitle = ({ className, ...props }) => (
  <h3 className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
)

const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

const CardContent = ({ className, ...props }) => (
  <div className={cn("p-6 pt-0", className)} {...props} />
)

const CardFooter = ({ className, ...props }) => (
  <div className={cn("flex items-center p-6 pt-0", className)} {...props} />
)

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter }
```

### Form Components with React Hook Form

```tsx
// components/ui/form.tsx
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

const formSchema = z.object({
  email: z.string().email("Invalid email"),
  name: z.string().min(2, "Name must be at least 2 characters")
})

export function ContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      name: ""
    }
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormDescription>
                We'll never share your email.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  )
}
```

## Design Tokens

### CSS Custom Properties

```css
/* Add to globals.css */
@theme {
  /* Colors */
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  
  /* Spacing */
  --spacing-unit: 0.25rem;
  --spacing-xs: calc(var(--spacing-unit) * 2);
  --spacing-sm: calc(var(--spacing-unit) * 3);
  --spacing-md: calc(var(--spacing-unit) * 4);
  --spacing-lg: calc(var(--spacing-unit) * 6);
  --spacing-xl: calc(var(--spacing-unit) * 8);
  
  /* Border Radius */
  --radius: 0.5rem;
  --radius-sm: calc(var(--radius) - 0.25rem);
  --radius-md: var(--radius);
  --radius-lg: calc(var(--radius) + 0.25rem);
  --radius-full: 9999px;
}
```

## Animation Patterns

### Micro-interactions

```tsx
// Subtle hover effects
<Button
  className="transition-all hover:scale-105 active:scale-95"
  onClick={handleClick}
>
  Click me
</Button>

// Loading states
<Button disabled={isLoading}>
  {isLoading ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      Loading...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### Framer Motion Integration

```tsx
import { motion } from "framer-motion"

export function AnimatedCard({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
      className="rounded-lg border bg-card p-6"
    >
      {children}
    </motion.div>
  )
}
```

## Dark Mode Support

```tsx
// Theme provider setup
import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({ children }) {
  return (
    <html suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

// Theme toggle component
import { useTheme } from "next-themes"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    >
      <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
```

## Component Best Practices

### 1. Composition over Props

```tsx
// Good: Composable
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
    <CardDescription>Description</CardDescription>
  </CardHeader>
  <CardContent>
    {/* Custom content */}
  </CardContent>
</Card>

// Avoid: Too many props
<Card 
  title="Title"
  description="Description"
  content={content}
  footer={footer}
  // ... many more props
/>
```

### 2. Forwarding Refs

```tsx
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2",
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)
Input.displayName = "Input"
```

### 3. Polymorphic Components

```tsx
// Using Slot from Radix UI
import { Slot } from "@radix-ui/react-slot"

interface ButtonProps {
  asChild?: boolean
  // ... other props
}

const Button = ({ asChild = false, ...props }) => {
  const Comp = asChild ? Slot : "button"
  return <Comp {...props} />
}

// Usage
<Button asChild>
  <Link href="/home">Home</Link>
</Button>
```

## Testing Components

```tsx
// Component test example
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders with correct variant', () => {
    render(<Button variant="destructive">Delete</Button>)
    const button = screen.getByRole('button', { name: /delete/i })
    expect(button).toHaveClass('bg-destructive')
  })

  it('handles click events', async () => {
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})