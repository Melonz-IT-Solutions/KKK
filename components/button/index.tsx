import * as React from 'react'
import { Button as UIButton, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

type CustomButtonProps = Omit<React.ComponentProps<typeof UIButton>, 'size'> & {
  color?: 'primary'
  size?: 'sm' | 'md' | 'lg'
}

const customColor = {
  primary: 'bg-[#2E6F40] text-white hover:bg-[#1A4528] focus:ring-2 focus:ring-[#2E6F40]',
}

// Bootstrap-like size classes
const sizesClass: Record<NonNullable<CustomButtonProps['size']>, string> = {
  sm: 'h-8 px-3 py-1.5 text-sm rounded', // btn-sm
  md: 'h-10 px-4 py-2 text-base rounded-md', // default
  lg: 'h-12 px-5 py-3 text-lg rounded-lg', // btn-lg
}

const Button = React.forwardRef<HTMLButtonElement, CustomButtonProps>(
  ({ color = 'primary', size = 'md', className, children, ...props }, ref) => {
    return (
      <UIButton
        ref={ref}
        className={cn(
          'cursor-pointer',
          color === 'primary' ? customColor.primary : '',
          sizesClass[size as keyof typeof sizesClass],
          className
        )}
        size={undefined}
        {...props}
      >
        {children}
      </UIButton>
    )
  }
)

Button.displayName = 'Button'

export default Button
