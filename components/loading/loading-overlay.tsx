interface LoadingOverlayProps {
  loading: boolean
  title?: string
  description?: string
}

export default function LoadingOverlay({
  loading,
  title = 'Loading...',
  description = 'Please wait...',
}: LoadingOverlayProps) {
  if (!loading) {
    return null
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
      <div className="flex items-center gap-3 rounded-lg border border-green-100 bg-white px-5 py-4 shadow-lg">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-green-100 border-t-green-600" />

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-green-700">{title}</span>

          <span className="text-xs text-gray-500">{description}</span>
        </div>
      </div>
    </div>
  )
}
