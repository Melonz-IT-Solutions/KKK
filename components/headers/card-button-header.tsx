import { PageHeaderProps } from '@/types/headers';

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className='flex flex-col gap-4 p-6 md:flex-row md:items-start justify-between'>
      <div>
        <h1 className=' font-semibold md:text-3xl'>{title}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>

      {actions && (
        <div className='flex flex-wrap items-center gap-2 sm:justify-end'>
          {actions}
        </div>
      )}
    </div>
  );
}
