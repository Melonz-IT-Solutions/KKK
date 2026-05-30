import { cn } from '@/lib/utils'
import { Input as ShadInput } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React, { forwardRef } from 'react'
import { LucideIcon } from 'lucide-react'
import type { ReactNode } from 'react'

type Variant = 'error' | 'default'

export type Size = 'sm' | 'md' | 'lg'

type Props = {
  label?: string
  type?: 'text' | 'number' | 'password' | 'date' | 'time' | 'file' | 'email' | 'tel'
  variant?: Variant
  size?: Size
  className?: string
  inputClassName?: string
  error?: boolean
  htmlFor?: string
  orientation?: 'horizontal' | 'vertical'
  endIcon?: ReactNode
  startIcon?: ReactNode
  onClickRightIcon?: () => void
  onClickLeftIcon?: () => void
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>

const sizesClass: Record<Size, string> = {
  sm: 'h-8 px-3 py-1.5 text-sm rounded', // btn-sm
  md: 'h-10 px-4 py-2 text-base rounded-md', // default
  lg: 'h-12 px-5 py-3 text-lg rounded-lg', // btn-lg
}

const labelSizeClass: Record<Size, string> = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

const iconSizeMap: Record<Size, number> = {
  sm: 16,
  md: 18,
  lg: 22,
}

function isLucideIconComponent(el: unknown): el is React.ReactElement & { type: LucideIcon } {
  return (
    React.isValidElement(el) &&
    typeof el.type === 'function' &&
    // Lucide icons have a "name" property that matches the icon name and a "toString" that includes 'createLucideIcon'
    ((el.type as any).toString?.().includes('createLucideIcon') || (el.type as any).iconNode)
  )
}

const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      label,
      type = 'text',
      variant = 'default',
      size = 'md',
      className,
      inputClassName,
      id,
      error,
      htmlFor,
      orientation = 'vertical',
      endIcon,
      startIcon,
      onClickRightIcon,
      onClickLeftIcon,
      ...props
    },
    ref
  ) => {
    const variantClasses = {
      error: 'text-red-500 border-red-500 rounded-[4px]',
      default: 'bg-white border-gray-300 border-[1px] rounded-[12px] text-gray-3',
    }

    const labelClasses = cn(error ? 'text-red-500' : variantClasses[variant], labelSizeClass[size])
    const inputBorderClasses = error ? variantClasses.error : variantClasses[variant]
    const EndIcon = endIcon
    const StartIcon = startIcon

    // Ensure className is string or undefined
    const safeClassName = typeof className === 'string' ? className : undefined
    return (
      <div
        className={String(
          cn(
            'relative',
            safeClassName,
            orientation === 'horizontal' ? 'flex items-center gap-1' : undefined
          ) || ''
        )}
      >
        {label && (
          <Label htmlFor={htmlFor || id} className={cn('w-fit text-black', labelClasses)}>
            {label}
          </Label>
        )}

        {/* Start Icon */}
        {StartIcon != null && (
          <div className="absolute top-1/2 left-3 -translate-y-1/2">
            {typeof StartIcon === 'function'
              ? React.createElement(StartIcon, {
                  className: 'cursor-pointer text-gray-500',
                  size: iconSizeMap[size],
                  onClick: onClickLeftIcon,
                })
              : isLucideIconComponent(StartIcon)
                ? React.cloneElement(StartIcon as React.ReactElement<any>, {
                    size: iconSizeMap[size],
                  })
                : StartIcon}
          </div>
        )}

        <ShadInput
          ref={ref}
          id={id}
          type={type}
          className={cn(
            'w-full border-2 bg-white transition-colors focus:ring-0 focus:outline-none focus-visible:ring-0',
            sizesClass[size],
            inputBorderClasses,
            startIcon ? 'pl-10' : '',
            endIcon ? 'pr-10' : '',
            inputClassName
          )}
          {...props}
        />

        {/* End Icon */}
        {EndIcon != null && (
          <div className="absolute top-1/2 right-3 -translate-y-1/2">
            {typeof EndIcon === 'function'
              ? React.createElement(EndIcon, {
                  className: 'cursor-pointer text-gray-500',
                  size: iconSizeMap[size],
                  onClick: onClickRightIcon,
                })
              : isLucideIconComponent(EndIcon)
                ? React.cloneElement(EndIcon as React.ReactElement<any>, {
                    size: iconSizeMap[size],
                  })
                : EndIcon}
          </div>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
