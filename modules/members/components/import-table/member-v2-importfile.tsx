import React, { useState, useCallback, useRef } from 'react'
import { Upload } from 'lucide-react'
import Button from '@/components/button-v2/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet'

export default function ImportFileDrawer({
  open = true,
  onOpenChange = () => {},
}: {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}) {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = useCallback((fileList?: FileList | null) => {
    const f = fileList && fileList.length > 0 ? fileList[0] : undefined
    if (!f) return
    const isExcel =
      /\.(xlsx|xls|csv)$/i.test(f.name) ||
      f.type.includes('spreadsheet') ||
      f.type.includes('excel')
    if (isExcel) setFile(f)
  }, [])

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles((e.dataTransfer && (e.dataTransfer.files as FileList)) || undefined)
  }

  const handleImport = () => {
    if (!file) return
    // wire up your actual import mutation here
    console.log('Importing', file.name)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="flex w-full flex-col gap-0 p-0 sm:max-w-sm">
        {/* Header */}
        <SheetHeader className="border-b border-neutral-200 px-6">
          <SheetTitle className="p-4 text-lg font-semibold text-neutral-900">
            Import File
          </SheetTitle>
          <SheetDescription className="sr-only">
            Upload an Excel file to import members in bulk.
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 p-8">
          <label
            htmlFor="import-file-input"
            onDragOver={e => {
              e.preventDefault()
              setIsDragging(true)
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            className={`flex h-40 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed px-6 text-center transition-colors ${
              isDragging
                ? 'border-neutral-400 bg-neutral-50'
                : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50'
            }`}
          >
            <Upload className="h-4 w-4 text-neutral-500" />

            {file ? (
              <div>
                <p className="text-sm font-medium text-neutral-900">{file.name}</p>
                <p className="mt-1 text-xs text-neutral-400">
                  {(file.size / 1024).toFixed(1)} KB &middot; click or drop to replace
                </p>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-neutral-700">
                  Drop file here or click to browse
                </p>
                <p className="mt-1 text-xs text-neutral-400">
                  Upload an Excel file to import members in bulk
                </p>
              </div>
            )}

            <input
              id="import-file-input"
              ref={inputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              className="hidden"
              onChange={e => handleFiles(e.target.files)}
            />
          </label>
        </div>

        {/* Footer */}
        <div className="border-t p-4 px-6 py-5">
          <div className="flex flex-col justify-center gap-4">
            <Button disabled={!file} onClick={handleImport} variant="primary" size="full">
              Import
            </Button>
            <Button variant="outline" size="full" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
