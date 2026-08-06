'use client'

import CardHeader from '../headers/card-header'
import InfoField from '@/modules/settings/components/info-field'
import Button from '@/components/button'
import { UserPlus, Zap } from 'lucide-react'

import { Field, FieldContent, FieldLabel } from '@/components/ui/field'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function CreateBranchManagerSection() {
  return (
    <section className="bg-background rounded-lg border">
      <div className="grid p-6">
        <CardHeader
          title="Create Branch Manager"
          description="Assign administrative control to a specific branch or module."
          icon={UserPlus}
        />

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <InfoField
            label="Full Name"
            value=""
            onChange={() => {}}
            placeholder="e.g. Marcus Aurelius"
          />

          <InfoField
            label="Email Address"
            value=""
            onChange={() => {}}
            placeholder="manager@kkk-works.com"
          />

          <Field>
            <FieldLabel>Assign Branch/Module</FieldLabel>

            <FieldContent>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>

                <SelectContent>
                  <SelectItem value="finance">Finance Department</SelectItem>

                  <SelectItem value="hr">HR Department</SelectItem>

                  <SelectItem value="operations">Operations Department</SelectItem>
                </SelectContent>
              </Select>
            </FieldContent>
          </Field>

          <InfoField
            label="Temporary Password"
            value="password123"
            onChange={() => {}}
            type="password"
          />
        </div>

        <div className="flex justify-end gap-3 p-4">
          <Button className="text-green border bg-white">Cancel</Button>

          <Button>
            <Zap className="size-4" />
            Deploy Account
          </Button>
        </div>
      </div>
    </section>
  )
}
