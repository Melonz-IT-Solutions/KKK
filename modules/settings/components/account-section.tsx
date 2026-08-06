import Button from '@/components/button'
import { Save } from 'lucide-react'
import InfoField from './info-field'
import { ACCOUNT_FIELDS } from '@/lib/data/settings'
import CardHeader from '../../../components/headers/card-header'
import type { AccountSectionProps } from '@/types/accountfield'

export default function AccountSection({ accountInfo, updateField }: AccountSectionProps) {
  return (
    <div className="w-full">
      <section className="border p-6">
        <CardHeader title="Account Information" badge="Profile" />

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ACCOUNT_FIELDS.map(field => (
            <InfoField
              key={field.key}
              label={field.label}
              value={accountInfo[field.key]}
              onChange={value => updateField(field.key, value)}
            />
          ))}

          <div className="flex justify-end md:col-span-2">
            <Button>
              <Save className="h-4 w-4" />
              Update Account
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
