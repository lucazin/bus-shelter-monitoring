import * as React from "react"
import { cn } from "@/lib/utils"

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning'
}

function Badge({ className, variant = 'default', style, ...props }: BadgeProps) {
  const variantStyles: Record<string, React.CSSProperties> = {
    default: {
      backgroundColor: 'var(--color-primary)',
      color: 'var(--color-primary-foreground)',
    },
    secondary: {
      backgroundColor: 'var(--color-secondary)',
      color: 'var(--color-secondary-foreground)',
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
    success: {
      backgroundColor: '#22c55e',
      color: 'white',
    },
    warning: {
      backgroundColor: '#eab308',
      color: 'white',
    },
  }

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold transition-colors",
        className
      )}
      style={{ ...variantStyles[variant], ...style }}
      {...props}
    />
  )
}

export { Badge }
