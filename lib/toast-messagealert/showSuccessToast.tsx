'use client';

import { toast } from 'sonner';
import { Check, X } from 'lucide-react';

/**
 * Custom success toast matching the design:
 * dark green background, white checkmark circle,
 * bold "Success!" title, message, close button,
 * and a timestamp (e.g. "01:33 PM 07/25/2026").
 *
 * Usage:
 *   showSuccessToast('Succesfully Added a new staff');
 *   showSuccessToast('Succesfully generated a report');
 */
export function showSuccessToast(message: string) {
  toast.custom(
    (t) => (
      <div className='flex w-full max-w-sm items-start gap-3 rounded-lg bg-[#1B5E33] px-4 py-3 text-white shadow-lg'>
        {/* Checkmark icon */}
        <div className='mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white'>
          <Check className='h-3.5 w-3.5 text-[#1B5E33]' strokeWidth={3} />
        </div>

        {/* Content */}
        <div className='flex-1 min-w-0'>
          <p className='text-sm font-semibold leading-tight'>Success!</p>
          <p className='mt-0.5 text-sm leading-snug text-white/90'>{message}</p>
          <p className='mt-1 text-xs text-white/70'>{getTimestamp()}</p>
        </div>

        {/* Close button */}
        <button
          onClick={() => toast.dismiss(t)}
          className='shrink-0 rounded-sm text-white/80 transition-colors hover:text-white'
          aria-label='Close'
        >
          <X className='h-4 w-4' />
        </button>
      </div>
    ),
    {
      duration: 4000,
      position: 'top-right',
    },
  );
}

function getTimestamp() {
  const now = new Date();

  const time = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  const date = now
    .toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
    })
    .replace(/\//g, '/');

  return `${time} ${date}`;
}
