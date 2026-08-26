import { LucideIcon } from 'lucide-react'

export type DashboardCardData =
  | {
      type: 'members'
      label: string
      value: string
      trend: string
      footerTitle: string
      footerSub: string
      icon: LucideIcon
    }
  | {
      type: 'department'
      label: string
      percent: number
      icon: LucideIcon
    }
  | {
      type: 'managers'
      label: string
      value: number
      avatars: string[]
      icon: LucideIcon
    }
