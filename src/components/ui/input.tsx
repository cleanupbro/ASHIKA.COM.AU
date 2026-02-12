import { forwardRef, InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-xs font-bold uppercase tracking-wide text-black mb-2"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full px-4 py-3 border transition-all duration-200 text-sm bg-white',
            'placeholder:text-gray-400',
            'focus:outline-none focus:border-black focus:ring-0',
            error
              ? 'border-red-500'
              : 'border-gray-300 hover:border-gray-400',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-red-500' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={textareaId}
            className="block text-xs font-bold uppercase tracking-wide text-black mb-2"
          >
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={textareaId}
          className={cn(
            'w-full px-4 py-3 border transition-all duration-200 resize-none text-sm bg-white',
            'placeholder:text-gray-400',
            'focus:outline-none focus:border-black focus:ring-0',
            error
              ? 'border-red-500'
              : 'border-gray-300 hover:border-gray-400',
            className
          )}
          {...props}
        />
        {(error || helperText) && (
          <p className={cn('mt-1.5 text-xs', error ? 'text-red-500' : 'text-gray-500')}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ className, label, error, options, id, placeholder, value, ...props }, ref) => {
    const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');
    const showPlaceholder = !value || value === '';

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-bold uppercase tracking-wide text-black mb-2"
          >
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          value={value}
          className={cn(
            'w-full px-4 py-3 border transition-all duration-200 text-sm',
            'bg-white appearance-none cursor-pointer',
            'focus:outline-none focus:border-black focus:ring-0',
            error
              ? 'border-red-500'
              : 'border-gray-300 hover:border-gray-400',
            showPlaceholder && 'text-gray-400',
            className
          )}
          {...props}
        >
          <option value="" disabled>
            {placeholder || `Select ${label || 'option'}...`}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {error && <p className="mt-1.5 text-sm text-red-500">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
