'use client'

import { useEffect, useMemo, useState } from 'react'
import Button from '@/components/button'

import PageV2Header from '@/components/headers/page-v2-header'
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
import { ChevronDown, Import, SearchIcon, UserPlus } from 'lucide-react'
import MemberV2Table from '@/modules/members/components/member-table/member-v2-table'
import ImportFileDrawer from '@/modules/members/components/import-table/member-v2-importfile'
import { AddMemberSheet } from '@/modules/members/components/add-member/member-v2-addmember'

import { BRANCH_OPTIONS } from '@/modules/members/constants/members'
import type { MemberRow } from '@/modules/members/types/member'

export default function MemberV2Page() {
  const [selectedBranch, setSelectedBranch] = useState('all')
  const [search, setSearch] = useState('')
  const [isImportOpen, setIsImportOpen] = useState(false)
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)
  const [members, setMembers] = useState<MemberRow[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMembers = async () => {
    setLoading(true)
    const response = await fetch(
      `/api/members?search=${encodeURIComponent(search)}&branch=${encodeURIComponent(selectedBranch)}`
    )
    const data = await response.json()
    setMembers(data.items ?? [])
    setLoading(false)
  }

  useEffect(() => {
    void fetchMembers()
  }, [search, selectedBranch])

  const filteredMembers = useMemo(() => members, [members])

  const triggerLabel =
    BRANCH_OPTIONS.find(option => option.value === selectedBranch)?.label ??
    'Filter by Cluster / Branch'

  return (
    <div className="p-4">
      <PageV2Header title="Member" description="Manage KKK Members." />
      <div className="flex justify-between">
        {/* Search input */}
        <div className="relative flex gap-6">
          <InputGroup className="h-10">
            <InputGroupInput
              placeholder="Search Member..."
              value={search}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
            />
            <InputGroupAddon>
              <SearchIcon />
            </InputGroupAddon>
          </InputGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2 rounded-md border px-3 text-sm whitespace-nowrap">
                {triggerLabel}
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuLabel>City Proper Cluster</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {BRANCH_OPTIONS.slice(0, 5).map(option =>
                  option.value === 'all' ? null : (
                    <DropdownMenuItem
                      key={option.value}
                      onSelect={() => setSelectedBranch(option.value)}
                    >
                      {option.label}
                    </DropdownMenuItem>
                  )
                )}
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuLabel>East Coast Cluster</DropdownMenuLabel>
              {BRANCH_OPTIONS.slice(5).map(option => (
                <DropdownMenuItem
                  key={option.value}
                  onSelect={() => setSelectedBranch(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex gap-4">
          <Button
            variant="outline"
            className="gap-2 rounded-md border-gray-300 bg-white text-black hover:bg-gray-50"
            onClick={() => setIsImportOpen(true)}
          >
            <Import />
            Import File
          </Button>

          <Button onClick={() => setIsAddMemberOpen(true)}>
            <UserPlus />
            Add Member
          </Button>
          <AddMemberSheet
            open={isAddMemberOpen}
            onOpenChange={setIsAddMemberOpen}
            onSave={async values => {
              await fetch('/api/members', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(values),
              })
              await fetchMembers()
            }}
          />
        </div>

        <ImportFileDrawer open={isImportOpen} onOpenChange={setIsImportOpen} />
      </div>
      <div>
        <div className="py-6">
          {loading ? (
            <p className="text-muted-foreground text-sm">Loading members…</p>
          ) : (
            <MemberV2Table data={filteredMembers} />
          )}
        </div>
      </div>
    </div>
  )
}
