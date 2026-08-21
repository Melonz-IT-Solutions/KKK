'use client'

import Button from '@/components/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

import { ChevronDown, SearchIcon, X } from 'lucide-react'

import { BRANCH_OPTIONS } from '@/modules/members/constants/members'

import type { StatusFilter } from '@/modules/members/types/member'

interface MemberV2FiltersProps {
  search: string
  selectedBranch: string
  statusFilter: StatusFilter
  isSuperAdmin: boolean
  hasFilters: boolean

  onSearchChange: (value: string) => void
  onBranchChange: (value: string) => void
  onStatusChange: (value: StatusFilter) => void
  onClearFilters: () => void
}

export default function MemberV2Filters({
  search,
  selectedBranch,
  statusFilter,
  isSuperAdmin,
  hasFilters,
  onSearchChange,
  onBranchChange,
  onStatusChange,
  onClearFilters,
}: MemberV2FiltersProps) {
  const triggerLabel =
    BRANCH_OPTIONS.find(option => option.value === selectedBranch)?.label ??
    'Filter by Cluster / Branch'

  const statusLabel =
    statusFilter === 'active' ? 'Active' : statusFilter === 'hidden' ? 'Hidden' : 'All'

  return (
    <div className="relative flex gap-6">
      {/* SEARCH */}

      <InputGroup className="h-10">
        <InputGroupInput
          placeholder="Search Member..."
          value={search}
          onChange={event => onSearchChange(event.target.value)}
        />

        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>

      {/* BRANCH */}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap">
            {triggerLabel}

            <ChevronDown className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="start" className="h-125 w-55 overflow-y-auto">
          {/* CITY PROPER */}

          <DropdownMenuGroup>
            <DropdownMenuLabel>City Proper</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {BRANCH_OPTIONS.slice(0, 4).map(option => (
              <DropdownMenuItem key={option.value} onSelect={() => onBranchChange(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* EAST COAST */}

          <DropdownMenuGroup>
            <DropdownMenuLabel>East Coast</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {BRANCH_OPTIONS.slice(4, 8).map(option => (
              <DropdownMenuItem key={option.value} onSelect={() => onBranchChange(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* WEST COAST */}

          <DropdownMenuGroup>
            <DropdownMenuLabel>West Coast</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {BRANCH_OPTIONS.slice(8, 12).map(option => (
              <DropdownMenuItem key={option.value} onSelect={() => onBranchChange(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* SIBUGAY */}

          <DropdownMenuGroup>
            <DropdownMenuLabel>Sibugay</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {BRANCH_OPTIONS.slice(12, 15).map(option => (
              <DropdownMenuItem key={option.value} onSelect={() => onBranchChange(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* NORTH */}

          <DropdownMenuGroup>
            <DropdownMenuLabel>North</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {BRANCH_OPTIONS.slice(15, 18).map(option => (
              <DropdownMenuItem key={option.value} onSelect={() => onBranchChange(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          {/* BASULTA */}

          <DropdownMenuGroup>
            <DropdownMenuLabel>Basulta</DropdownMenuLabel>

            <DropdownMenuSeparator />

            {BRANCH_OPTIONS.slice(18, 21).map(option => (
              <DropdownMenuItem key={option.value} onSelect={() => onBranchChange(option.value)}>
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* STATUS */}

      {isSuperAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  statusFilter === 'active'
                    ? 'bg-green-500'
                    : statusFilter === 'hidden'
                      ? 'bg-slate-400'
                      : 'bg-blue-500'
                }`}
              />

              <span>Status: {statusLabel}</span>

              <ChevronDown className="size-4" />
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="start">
            <DropdownMenuLabel>Member Status</DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={() => onStatusChange('active')}>
              <span className="mr-2 size-2 rounded-full bg-green-500" />
              Active
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => onStatusChange('hidden')}>
              <span className="mr-2 size-2 rounded-full bg-slate-400" />
              Hidden
            </DropdownMenuItem>

            <DropdownMenuItem onSelect={() => onStatusChange('all')}>
              <span className="mr-2 size-2 rounded-full bg-blue-500" />
              All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}

      {/* CLEAR */}

      {hasFilters && (
        <Button
          variant="outline"
          className="bg-secondary hover:bg-primary rounded-sm border-gray-300 text-white hover:text-white"
          onClick={onClearFilters}
        >
          <X className="text-destructive h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
