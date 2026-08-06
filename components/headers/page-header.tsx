import { PageHeaderProps } from '@/types/headers';

export default function PageHeader({
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className='flex flex-col md:flex-row md:items-start justify-between p-6 '>
      <div>
        <h1 className='text-2xl font-semibold md:text-3xl'>{title}</h1>
        <p className='mt-1 text-sm text-muted-foreground'>{description}</p>
      </div>

      {actions && (
        <div className='flex flex-col gap-2 sm:flex-row xm:flex-row '>
          {actions}
        </div>
      )}
    </div>
  );
}
