import { cn } from '@/lib/utils';
import { PageHeaderProps } from '@/types/headers';
import Button from '../button';
export default function CardHeader({
  step,
  title,
  description,
  badge,
  icon: Icon,
  buttonText,
  buttonIcon: ButtonIcon,
  className,
  titleClassName,
  buttonIconClassName,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-start justify-between rounded-t-lg p-4',
        className,
      )}
    >
      {step && (
        <div className='flex h-8 w-8 items-center justify-center rounded-full border bg-secondary text-sm font-bold text-primary p-2 '>
          {step}
        </div>
      )}
      <div className='flex items-start gap-3 w-full'>
        {Icon && (
          <div className='bg-primary flex items-center justify-center rounded-md p-3'>
            <Icon className='h-5 w-5 text-white' />
          </div>
        )}

        <div>
          <h2 className={cn('text-xl font-semibold', titleClassName)}>
            {title}
          </h2>

          {description && (
            <p className='text-muted-foreground mt-1 text-sm'>{description}</p>
          )}
        </div>
      </div>

      <div className='flex items-center gap-2'>
        {badge && (
          <span className='inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-sm'>
            {badge}
          </span>
        )}

        {(buttonText || ButtonIcon) && (
          <Button
            variant='outline'
            size='sm'
            className='bg-border hover:bg-border'
          >
            {ButtonIcon && (
              <ButtonIcon className={cn('size-4 ', buttonIconClassName)} />
            )}
            {buttonText}
          </Button>
        )}
      </div>
    </div>
  );
}
