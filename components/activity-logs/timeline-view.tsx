'use client'

import { Pencil, UserPlus, UserMinus, ShieldCheck, Settings } from 'lucide-react'
import type { ActivityLog } from './table-view'

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

function groupByDate(logs: ActivityLog[]): Map<string, ActivityLog[]> {
  return logs.reduce((acc, log) => {
    const existing = acc.get(log.date) ?? []
    acc.set(log.date, [...existing, log])
    return acc
  }, new Map<string, ActivityLog[]>())
}

export default function TimelineView({ logs }: { logs: ActivityLog[] }) {
  const grouped = groupByDate(logs)

  return (
    <div className="w-full px-2">
      {Array.from(grouped.entries()).map(([date, entries]) => (
        <div key={date} className="mb-8">
          {/* Date header */}
          <div className="mb-4 flex items-center gap-3">
            <span className="text-sm font-semibold text-foreground">{date}</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Entries for this date */}
          <div className="relative ml-4">
            {/* Vertical line */}
            <div className="absolute left-5 top-0 h-full w-px bg-border" />

            <div className="flex flex-col gap-0">
              {entries.map((log) => {
                const Icon = iconMap[log.type]
                const colorClass = iconColorMap[log.type]

                return (
                  <div key={log.id} className="relative flex items-start gap-6 pb-6">
                    {/* Circle icon node */}
                    <div className="relative z-10 flex-shrink-0">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full ring-4 ring-background ${colorClass}`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-0.5 pt-1.5">
                      <p className="text-sm font-semibold text-foreground">{log.title}</p>
                      <p className="text-sm text-muted-foreground">{log.description}</p>
                      <p className="text-xs text-muted-foreground/70">
                        Updated by:{' '}
                        <span className="font-medium text-muted-foreground">{log.updatedBy}</span>
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
