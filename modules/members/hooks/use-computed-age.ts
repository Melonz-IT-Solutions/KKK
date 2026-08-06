// modules/members/hooks/use-computed-age.ts
import { useEffect } from 'react'
import type { UseFormSetValue, UseFormWatch, FieldPath, FieldValues } from 'react-hook-form'

function computeAge(birthday: string): string {
  if (!birthday) return ''
  const dob = new Date(birthday)
  if (Number.isNaN(dob.getTime())) return ''

  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age -= 1
  }
  return age >= 0 ? String(age) : ''
}

// Watches `birthdayPath`, writes the computed age into `agePath` whenever it
// changes. Use once per birthday/age pair, anywhere in the form tree.
export function useComputedAge<T extends FieldValues>(
  watch: UseFormWatch<T>,
  setValue: UseFormSetValue<T>,
  birthdayPath: FieldPath<T>,
  agePath: FieldPath<T>
) {
  const birthday = watch(birthdayPath)

  useEffect(() => {
    setValue(agePath, computeAge(birthday as string) as never, {
      shouldValidate: false,
      shouldDirty: false,
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [birthday])
}
