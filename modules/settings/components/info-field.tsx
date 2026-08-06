'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Field, FieldContent, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { InfoFieldProps } from '@/types/accountfield';

export default function InfoField({
  label,
  value,
  onChange,
  type = 'text',
  placeholder,
  options,
}: InfoFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>

      <FieldContent>
        {options ?
          <Select value={value} onValueChange={onChange}>
            <SelectTrigger className='w-full'>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>

            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        : isPasswordField ?
          <div className='relative'>
            <Input
              type={showPassword ? 'text' : 'password'}
              value={value}
              placeholder={placeholder}
              onChange={(e) => onChange(e.target.value)}
              className='pr-10'
            />
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground'
            >
              {showPassword ?
                <EyeOff className='h-4 w-4' />
              : <Eye className='h-4 w-4' />}
            </button>
          </div>
        : <Input
            type={type}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
        }
      </FieldContent>
    </Field>
  );
}
