import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cn } from "@/lib/utils"

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', asChild = false, style, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    const baseStyles: React.CSSProperties = {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      borderRadius: '0.375rem',
      fontSize: '0.875rem',
      fontWeight: 500,
      transition: 'all 0.2s',
      cursor: 'pointer',
      border: 'none',
      ...style,
    }

    const variantStyles: Record<string, React.CSSProperties> = {
      default: {
        backgroundColor: 'var(--color-primary)',
        color: 'var(--color-primary-foreground)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      },
      destructive: {
        backgroundColor: 'var(--color-destructive)',
        color: 'var(--color-destructive-foreground)',
      },
      outline: {
        border: '1px solid var(--color-border)',
        backgroundColor: 'transparent',
        color: 'inherit',
      },
      secondary: {
        backgroundColor: 'var(--color-secondary)',
        color: 'var(--color-secondary-foreground)',
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'inherit',
      },
      link: {
        backgroundColor: 'transparent',
        color: 'var(--color-primary)',
        textDecoration: 'underline',
      },
    }

    const sizeStyles: Record<string, React.CSSProperties> = {
      default: { height: '2.25rem', padding: '0.5rem 1rem' },
      sm: { height: '2rem', padding: '0.25rem 0.75rem', fontSize: '0.75rem' },
      lg: { height: '2.5rem', padding: '0.5rem 2rem' },
      icon: { height: '2.25rem', width: '2.25rem', padding: 0 },
    }

    return (
      <Comp
        className={cn("hover:opacity-90 disabled:pointer-events-none disabled:opacity-50", className)}
        ref={ref}
        style={{ ...baseStyles, ...variantStyles[variant], ...sizeStyles[size] }}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button }
