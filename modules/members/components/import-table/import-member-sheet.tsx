'use client'

import { useState } from 'react'

import Button from '@/components/button-v2/button'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

import { useFileDropzone } from '@/modules/members/hooks/use-file-dropzone'

import { DropzoneFileInput } from '@/modules/members/components/import-table/dropzone-file-input'

import { importMembers } from '@/modules/members/data/member-service'

import { showSuccessToast, showErrorToast } from '@/lib/toast-messagealert/showSuccessToast'

import type { ImportMemberSheetProps } from '@/modules/members/types/member'

export default function ImportMemberSheet({
  open,
  onOpenChange,
  onImported,
}: ImportMemberSheetProps) {
  const { file, isDragging, handleFiles, dragHandlers, setFile } = useFileDropzone()

  const [isImporting, setIsImporting] = useState(false)

  const handleImport = async () => {
    if (!file) {
      return
    }

    setIsImporting(true)

    try {
      const result = await importMembers(file)

      showSuccessToast(`Successfully imported ${result.importedCount} member(s)`)

      setFile(null)
      onImported?.()
      onOpenChange(false)
    } catch (error) {
      showErrorToast(error instanceof Error ? error.message : 'Failed to import members.')
    } finally {
      setIsImporting(false)
    }
  }

  const handleCancel = () => {
    setFile(null)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
        <SheetHeader className="border-b border-neutral-200 px-6">
          <SheetTitle className="p-4 text-lg font-semibold text-neutral-900">
            Import File
          </SheetTitle>

          <SheetDescription className="sr-only">
            Upload an Excel file to import members in bulk.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 p-8">
          <DropzoneFileInput
            file={file}
            isDragging={isDragging}
            onFilesSelected={handleFiles}
            {...dragHandlers}
          />
        </div>

        <div className="border-t p-4 px-6 py-5">
          <div className="flex flex-col justify-center gap-4">
            <Button
              disabled={!file || isImporting}
              onClick={handleImport}
              variant="primary"
              size="full"
            >
              {isImporting ? 'Importing...' : 'Import'}
            </Button>

            <Button variant="outline" size="full" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
