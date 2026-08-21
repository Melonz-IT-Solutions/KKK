import { Upload } from 'lucide-react'

import type { DropzoneFileInputProps } from '@/modules/members/types/member'

export function DropzoneFileInput({
  file,
  isDragging,
  onDragOver,
  onDragLeave,
  onDrop,
  onFilesSelected,
}: DropzoneFileInputProps) {
  return (
    <label
      htmlFor="import-file-input"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
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
          <p className="text-sm font-medium text-neutral-700">Drop file here or click to browse</p>

          <p className="mt-1 text-xs text-neutral-400">
            Upload an Excel file to import members in bulk
          </p>
        </div>
      )}

      <input
        id="import-file-input"
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={event => onFilesSelected(event.target.files)}
      />
    </label>
  )
}
