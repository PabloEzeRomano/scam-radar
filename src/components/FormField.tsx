import { FormFieldProps } from '@/types';
import { forwardRef } from 'react';

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, FormFieldProps>(
  ({ label, name, type = 'text', required = false, optional = false, placeholder, options, error, value, onChange, rows }, ref) => {
    const id = `field-${name || 'field'}`;
    const errorId = `${id}-error`;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onChange?.(e.target.value);
    };

    const baseInputClasses = `p-3 block w-full rounded-md border shadow-sm text-gray-900 placeholder-gray-500 bg-white sm:text-sm transition-colors duration-200 ${
      error
        ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
        : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
    } focus:outline-none focus:ring-2`;

    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-800">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
          {optional && <span className="text-gray-500 ml-1">(Optional)</span>}
        </label>

        {type === 'textarea' ? (
          <textarea
            id={id}
            name={name}
            ref={ref as React.Ref<HTMLTextAreaElement>}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            rows={rows || 4}
            className={baseInputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
        ) : type === 'select' ? (
          <select
            id={id}
            name={name}
            ref={ref as React.Ref<HTMLSelectElement>}
            required={required}
            value={value}
            onChange={handleChange}
            className={baseInputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          >
            {options?.map((option) => (
              <option className="p-2 bg-white text-gray-900 text-sm" key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            ref={ref as React.Ref<HTMLInputElement>}
            required={required}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            className={baseInputClasses}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
          />
        )}

        {error && (
          <p id={errorId} className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
