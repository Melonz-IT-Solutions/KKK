import { useCallback, useState } from 'react'

const ACCEPTED_EXTENSIONS = /\.(xlsx|xls|csv)$/i

function isExcelFile(file: File): boolean {
  return (
    ACCEPTED_EXTENSIONS.test(file.name) ||
    file.type.includes('spreadsheet') ||
    file.type.includes('excel')
  )
}

interface UseFileDropzoneResult {
  file: File | null
  isDragging: boolean
  setFile: (file: File | null) => void
  handleFiles: (fileList?: FileList | null) => void
  dragHandlers: {
    onDragOver: (e: React.DragEvent<HTMLLabelElement>) => void
    onDragLeave: () => void
    onDrop: (e: React.DragEvent<HTMLLabelElement>) => void
  }
}

export function useFileDropzone(): UseFileDropzoneResult {
  const [file, setFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const handleFiles = useCallback((fileList?: FileList | null) => {
    const candidate = fileList && fileList.length > 0 ? fileList[0] : undefined
    if (!candidate) return
    if (isExcelFile(candidate)) setFile(candidate)
  }, [])

  const onDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const onDragLeave = () => setIsDragging(false)

  const onDrop = (e: React.DragEvent<HTMLLabelElement>) => {
    e.preventDefault()
    setIsDragging(false)
    handleFiles(e.dataTransfer?.files)
  }

  return {
    file,
    isDragging,
    setFile,
    handleFiles,
    dragHandlers: { onDragOver, onDragLeave, onDrop },
  }
}
