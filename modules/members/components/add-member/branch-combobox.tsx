'use client'

import { useState } from 'react'

import { Check, ChevronsUpDown } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'

import { BRANCH_CLUSTERS } from '@/modules/members/constants/members'
import { cn } from '@/lib/utils'

const CLUSTER_LABELS: Record<string, string> = {
  city_proper_cluster: 'City Proper Cluster',
  east_coast_cluster: 'East Coast Cluster',
  west_coast_cluster: 'West Coast Cluster',
  sibugay_cluster: 'Sibugay Cluster',
  north_cluster: 'North Cluster',
  basulta_cluster: 'Basulta Cluster',
}

const BRANCH_LABEL_BY_VALUE = new Map(
  Object.values(BRANCH_CLUSTERS)
    .flat()
    .map(option => [option.value, option.label])
)

interface BranchComboboxProps {
  id?: string
  value?: string | null
  onChange: (value: string) => void
  invalid?: boolean
  className?: string
}

export function BranchCombobox({ id, value, onChange, invalid, className }: BranchComboboxProps) {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          id={id}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-invalid={invalid}
          className={cn(
            'h-10 w-full justify-between font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {value ? (BRANCH_LABEL_BY_VALUE.get(value) ?? value) : 'Select Branch'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="max-h-(--radix-popover-content-available-height) w-full overflow-hidden p-0"
        align="start"
      >
        <Command className="max-h-full">
          <CommandInput placeholder="Search branch..." />

          <CommandList className="max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--radix-popover-content-available-height)---spacing(9)))] overscroll-contain">
            <CommandEmpty>No branch found.</CommandEmpty>

            {Object.entries(BRANCH_CLUSTERS).map(([clusterKey, options]) => (
              <CommandGroup key={clusterKey} heading={CLUSTER_LABELS[clusterKey] ?? clusterKey}>
                {options.map(option => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      onChange(option.value)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === option.value ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {option.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
