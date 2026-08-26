import { PageHeaderProps } from '@/types/headers'

export default function PageHeader({ title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col justify-between p-6 md:flex-row md:items-start">
      <div>
        <h1 className="text-2xl font-semibold md:text-3xl">{title}</h1>
        <p className="text-muted-foreground mt-1 text-sm">{description}</p>
      </div>

      {actions && <div className="xm:flex-row flex flex-col gap-2 sm:flex-row">{actions}</div>}
    </div>
  )
}
