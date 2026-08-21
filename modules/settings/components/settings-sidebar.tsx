'use client'

import type { SettingsSection } from '@/modules/settings/types/settings'

interface SettingsSidebarProps {
  activeSection: SettingsSection
  setActiveSection: (section: SettingsSection) => void
}

const SETTINGS_OPTIONS = [
  {
    id: 'account' as const,
    title: 'Account info',
    description: 'Personal profile details.',
  },
  {
    id: 'password' as const,
    title: 'Change password',
    description: 'Update your security credentials.',
  },
]

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
