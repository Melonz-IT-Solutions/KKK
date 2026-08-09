'use client'

import { Pencil, UserPlus, UserMinus, ShieldCheck, Settings } from 'lucide-react'

export type ActivityLog = {
  id: number
  date: string
  title: string
  description: string
  updatedBy: string
  type: 'update' | 'create' | 'delete' | 'role' | 'settings'
}

const iconMap = {
  update: Pencil,
  create: UserPlus,
  delete: UserMinus,
  role: ShieldCheck,
  settings: Settings,
}

const iconColorMap = {
  update: 'bg-blue-100 text-blue-600',
  create: 'bg-green-100 text-green-600',
  delete: 'bg-red-100 text-red-600',
  role: 'bg-purple-100 text-purple-600',
  settings: 'bg-orange-100 text-orange-600',
}

export default function TableView({ logs }: { logs: ActivityLog[] }) {
  return (
    <div className="w-full">
      <div className="divide-border divide-y">
        {logs.map(log => {
          const Icon = iconMap[log.type]
          const colorClass = iconColorMap[log.type]
          return (
            <div
              key={log.id}
              className="grid grid-cols-[180px_64px_1fr] items-center gap-4 px-2 py-4"
            >
              {/* Left: Date */}
              <div className="text-muted-foreground text-sm font-medium whitespace-nowrap">
                {log.date}
              </div>

              {/* Middle: Circular Icon */}
              <div className="flex justify-center">
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-full ${colorClass}`}
                >
                  <Icon className="h-4 w-4" />
                </div>
              </div>

              {/* Right: Content */}
              <div className="flex flex-col gap-0.5">
                <p className="text-foreground text-sm font-semibold">{log.title}</p>
                <p className="text-muted-foreground text-sm">{log.description}</p>
                <p className="text-muted-foreground/70 text-xs">
                  Updated by:{' '}
                  <span className="text-muted-foreground font-medium">{log.updatedBy}</span>
                </p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
