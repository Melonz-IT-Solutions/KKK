import { toast } from 'sonner'

export function showError(message: string) {
  toast.error(message, {
    duration: 4000,
    position: 'top-right',
  })
}

export function showSuccess(message: string) {
  toast.success(message, {
    duration: 3000,
    position: 'top-right',
  })
}
