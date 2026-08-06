import { LucideIcon } from 'lucide-react'
import { ReactNode } from 'react'

export interface PageHeaderProps {
  title: string
  description?: string
  actions?: ReactNode
  badge?: string
  step?: string
  icon?: LucideIcon
  className?: string
  titleClassName?: string
  iconClassName?: string
  buttonIconClassName?: string
  descriptionClassName?: string

  buttonText?: string
  buttonIcon?: LucideIcon
}
