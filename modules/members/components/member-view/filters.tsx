'use client'

import { useState } from 'react'

import Button from '@/components/button'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@/components/ui/combobox'

import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'

import { ChevronDown, SearchIcon, X } from 'lucide-react'

import { useClusters } from '@/modules/members/hooks/use-clusters'
import { useSession } from 'next-auth/react'

import type { StatusFilter } from '@/modules/members/types/member'

interface MemberV2FiltersProps {
  search: string
  selectedBranches: string[]
  statusFilter: StatusFilter
  isSuperAdmin: boolean
  hasFilters: boolean

  onSearchChange: (value: string) => void
  onBranchChange: (values: string[]) => void
  onStatusChange: (value: StatusFilter) => void
  onClearFilters: () => void
}

export default function MemberV2Filters({
  search,
  selectedBranches,
  statusFilter,
  isSuperAdmin,
  hasFilters,
  onSearchChange,
  onBranchChange,
  onStatusChange,
  onClearFilters,
}: MemberV2FiltersProps) {
  const { data: session } = useSession()
  const [branchSearch, setBranchSearch] = useState('')
  const { clusters: rawClusters } = useClusters()

  const q = branchSearch.toLowerCase()

  const clusters = rawClusters.map(cluster => ({
    label: cluster.name,
    options: cluster.branches
      .map(b => ({ label: b.name, value: b.name }))
      .filter(o => o.label.toLowerCase().includes(q)),
  }))

  const hasResults = clusters.some(c => c.options.length > 0)

  const selectCluster = (options: { label: string; value: string }[]) => {
    const values = options.map(o => o.value)
    const allSelected = values.every(v => selectedBranches.includes(v))

    if (allSelected) {
      onBranchChange(selectedBranches.filter(v => !values.includes(v)))
    } else {
      onBranchChange(Array.from(new Set([...selectedBranches, ...values])))
    }
  }

  const statusLabel =
    statusFilter === 'active' ? 'Active' : statusFilter === 'inactive' ? 'Inactive' : 'All'

  return (
    <div className="relative flex gap-3">
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

      {/* BRANCH — multi-select combobox */}
      <Combobox multiple value={selectedBranches} onValueChange={onBranchChange}>
        <ComboboxTrigger
          className={
            session?.user.role === 'BRANCH_MANAGER' || session?.user.role === 'CLUSTER_MANAGER'
              ? 'hidden'
              : 'flex h-10 items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap'
          }
        >
          {selectedBranches.length === 0
            ? 'Filter by Cluster / Branch'
            : `${selectedBranches.length} branch${selectedBranches.length !== 1 ? 'es' : ''} selected`}
        </ComboboxTrigger>

        <ComboboxContent className="w-64">
          {/* Manual search input */}
          <div className="border-input/30 bg-input/30 m-1 mb-0 flex h-8 items-center rounded-md border px-2">
            <SearchIcon className="text-muted-foreground mr-1.5 size-3.5 shrink-0" />
            <input
              className="placeholder:text-muted-foreground flex-1 bg-transparent text-sm outline-none"
              placeholder="Search branch..."
              value={branchSearch}
              onChange={e => setBranchSearch(e.target.value)}
              onKeyDown={e => e.stopPropagation()}
            />
            {branchSearch && (
              <button
                className="text-muted-foreground hover:text-foreground ml-1"
                onClick={() => setBranchSearch('')}
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          <ComboboxList>
            {hasResults ? (
              clusters.map((cluster, index) => {
                if (cluster.options.length === 0) return null

                return (
                  <span key={cluster.label}>
                    {index > 0 && <ComboboxSeparator />}

                    <ComboboxGroup>
                      <ComboboxLabel
                        className="hover:text-foreground cursor-pointer text-sm"
                        onClick={() => selectCluster(cluster.options)}
                      >
                        {cluster.label}
                      </ComboboxLabel>

                      {cluster.options.map(option => (
                        <ComboboxItem className="px-4" key={option.value} value={option.value}>
                          {option.label}
                        </ComboboxItem>
                      ))}
                    </ComboboxGroup>
                  </span>
                )
              })
            ) : (
              <p className="text-muted-foreground py-4 text-center text-sm">No branch found.</p>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>

      {/* STATUS */}

      {isSuperAdmin && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex h-10 items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap">
              <span
                className={`h-2 w-2 shrink-0 rounded-full ${
                  statusFilter === 'active'
                    ? 'bg-green-500'
                    : statusFilter === 'inactive'
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

            <DropdownMenuItem onSelect={() => onStatusChange('inactive')}>
              <span className="mr-2 size-2 rounded-full bg-slate-400" />
              Inactive
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
          className="hover:bg-primary rounded-sm border-gray-300 bg-white text-sm text-gray-700 hover:text-white"
          onClick={onClearFilters}
        >
          <X className="text-destructive h-4 w-4" />
          Clear Filters
        </Button>
      )}
    </div>
  )
}
