import * as React from 'react'
import { useFormContext, FormProvider, UseFormReturn, FieldValues } from 'react-hook-form'

interface FormProps<T extends FieldValues> extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  'onSubmit'
> {
  form: UseFormReturn<T>
  onSubmit?: (data: T) => void | Promise<void>
}

export function Form<T extends FieldValues>({ form, children, onSubmit, ...props }: FormProps<T>) {
  // Only wrap with handleSubmit if onSubmit is provided, otherwise use a no-op
  const handleFormSubmit = onSubmit
    ? form.handleSubmit(onSubmit as (data: T) => void | Promise<void>)
    : (e: React.FormEvent<HTMLFormElement>) => e.preventDefault()
  return (
    <FormProvider {...form}>
      <form {...props} onSubmit={handleFormSubmit}>
        {children}
      </form>
    </FormProvider>
  )
}
