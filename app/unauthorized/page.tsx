import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <h1 className="text-4xl font-bold text-slate-900">Access Denied</h1>

      <p className="mt-3 max-w-md text-sm text-slate-500">
        You do not have permission to access this page. Please contact your administrator if you
        believe this is a mistake.
      </p>

      <Button asChild className="mt-6">
        <Link href="/dashboard">Back to Dashboard</Link>
      </Button>
    </div>
  )
}
