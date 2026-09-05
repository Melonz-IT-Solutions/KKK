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

import { useClusters } from '@/modules/members/hooks/use-clusters'
import { cn } from '@/lib/utils'

interface BranchComboboxProps {
  id?: string
  value?: string | null
  onChange: (value: string) => void
  invalid?: boolean
  className?: string
  readOnly?: boolean
}

export function BranchCombobox({
  id,
  value,
  onChange,
  invalid,
  className,
  readOnly,
}: BranchComboboxProps) {
  const [open, setOpen] = useState(false)
  const { clusters } = useClusters()

  if (readOnly) {
    return (
      <div
        id={id}
        className={cn(
          'border-input bg-muted text-muted-foreground flex h-10 w-full items-center rounded-md border px-3 text-sm',
          className
        )}
      >
        {value || 'No branch assigned'}
      </div>
    )
  }

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
            'h-10 w-full justify-between bg-white font-normal',
            !value && 'text-muted-foreground',
            className
          )}
        >
          {value ? value : 'Select Branch'}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="max-h-(--radix-popover-content-available-height) w-full overflow-hidden p-0"
        align="start"
      >
        <Command className="max-h-full">
          <CommandInput placeholder="Search branch..." />

          <CommandList className="">
            <CommandEmpty>No branch found.</CommandEmpty>

            {clusters.map(cluster => (
              <CommandGroup key={cluster.id} heading={cluster.name}>
                {cluster.branches.map(branch => (
                  <CommandItem
                    key={branch.id}
                    value={branch.name}
                    onSelect={() => {
                      onChange(branch.name)
                      setOpen(false)
                    }}
                  >
                    <Check
                      className={cn(
                        'mr-2 h-4 w-4',
                        value === branch.name ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                    {branch.name}
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
