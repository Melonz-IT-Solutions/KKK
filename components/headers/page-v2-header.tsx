import { PageHeaderProps } from '@/types/headers'

export default function PageV2Header({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>

      {actions && (
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          {actions}
        </div>
      )}
    </div>
  )
}
