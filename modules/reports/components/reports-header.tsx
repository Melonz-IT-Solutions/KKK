// modules/reports/components/reports-header.tsx
'use client';

import Button from '@/components/button';
import PageV2Header from '@/components/headers/page-v2-header';
import { FileText } from 'lucide-react';

interface ReportsHeaderProps {
  onGenerateReport: () => void;
}

export function ReportsHeader({ onGenerateReport }: ReportsHeaderProps) {
  return (
    <div className='flex items-center justify-between'>
      <PageV2Header title='Reports' />

      <Button
        onClick={onGenerateReport}
        className='bg-primary text-primary-foreground hover:bg-primary/90'
      >
        <FileText className='h-4 w-4' />
        Generate Report
      </Button>
    </div>
  );
}
