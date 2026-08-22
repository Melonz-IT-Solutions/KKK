'use client'

import { SETTINGS_OPTIONS } from '@/modules/settings/data/settings'

import type { SettingsSidebarProps } from '@/modules/settings/types/settings'

export default function SettingsSidebar({ activeSection, setActiveSection }: SettingsSidebarProps) {
  return (
    <div className="flex flex-col gap-2">
      {SETTINGS_OPTIONS.map(option => (
        <button
          key={option.id}
          type="button"
          onClick={() => setActiveSection(option.id)}
          className={`rounded-sm border p-3 text-left ${
            activeSection === option.id ? 'border-primary bg-primary/10' : 'border-border'
          }`}
        >
          <p className="font-semibold">{option.title}</p>

          <p className="text-muted-foreground text-xs">{option.description}</p>
        </button>
      ))}
    </div>
  )
}
