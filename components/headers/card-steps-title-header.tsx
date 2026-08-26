import { PageHeaderProps } from '@/types/headers'

export default function SectionTitle({ step, title, icon: Icon }: PageHeaderProps) {
  return (
    <div className="bg-muted/40 mb-2 flex flex-wrap items-center gap-3 rounded-lg p-4">
      <div className="bg-background text-primary flex h-8 w-8 items-center justify-center rounded-full border text-[10px] font-bold">
        {step}
      </div>

      {Icon && <Icon className="text-primary size-4" />}

      <h3 className="text-foreground text-sm font-semibold tracking-wide">{title}</h3>
    </div>
  )
}
