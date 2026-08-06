import { PageHeaderProps } from '@/types/headers';

export default function SectionTitle({
  step,
  title,
  icon: Icon,
}: PageHeaderProps) {
  return (
    <div className='mb-2 flex flex-wrap items-center gap-3 rounded-lg bg-muted/40 p-4'>
      <div className='flex h-8 w-8  items-center justify-center rounded-full border bg-background text-[10px] font-bold text-primary'>
        {step}
      </div>

      {Icon && <Icon className='size-4 text-primary' />}

      <h3 className='text-sm font-semibold tracking-wide text-foreground'>
        {title}
      </h3>
    </div>
  );
}
