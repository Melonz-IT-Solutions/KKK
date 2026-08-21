import Button from '@/components/button-v2/button'
import PageV2Header from '@/components/headers/page-v2-header'
import { FileText } from 'lucide-react'

interface ReportsHeaderProps {
  onGenerateReport: () => void
}

export function ReportsHeader({ onGenerateReport }: ReportsHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <PageV2Header title="Reports" />

      <Button variant="primary" onClick={onGenerateReport}>
        <FileText className="h-4 w-4" />
        Generate Report
      </Button>
    </div>
  )
}
