// components/button.tsx
'use client'

import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils' // shadcn's default classnames helper

// -----------------------------------------------------------------------
// Variants: two colors, each with its own hover + disabled effect.
// -----------------------------------------------------------------------
const buttonVariants = cva(
  // base styles shared by every button
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed',
  {
    variants: {
      variant: {
        // Solid green "primary" button — used for Save / Generate / Submit
        primary:
          'bg-primary text-primary-foreground hover:bg-secondary disabled:bg-gray-300 disabled:text-gray-500',

        // White / outline button — used for Cancel / Add Dependent, etc.
        outline:
          'border border-gray-300 bg-white text-black hover:bg-gray-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200',
      },
      size: {
        default: 'h-10 px-4 py-2 rounded-sm',
        pill: 'h-10 px-4 py-2 rounded-full',
        sm: 'h-8 px-3 rounded-sm text-xs',
        full: 'w-full h-10 px-4 py-2 rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
export default Button
