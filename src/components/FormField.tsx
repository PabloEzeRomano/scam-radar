import { forwardRef } from 'react'

interface FormFieldProps {
  label: string
  name?: string
  type?: 'text' | 'email' | 'url' | 'textarea' | 'select'
  required?: boolean
  optional?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
  error?: string
  value?: string
  onChange?: (value: string) => void
  rows?: number
}

export const FormField = forwardRef<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement, FormFieldProps>(
  ({ label, name, type = 'text', required = false, optional = false, placeholder, options, error, value, onChange, rows }, ref) => {
    const id = `field-${name || 'field'}`

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      onChange?.(e.target.value)
    }

    return (
      <div className="space-y-2">
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
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
            className={`p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              error ? 'border-red-300' : ''
            }`}
          />
        ) : type === 'select' ? (
          <select
            id={id}
            name={name}
            ref={ref as React.Ref<HTMLSelectElement>}
            required={required}
            value={value}
            onChange={handleChange}
            className={`p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              error ? 'border-red-300' : ''
            }`}
          >
            {options?.map((option) => (
              <option className="p-2 bg-background text-foreground text-sm" key={option.value} value={option.value}>
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
            className={`p-2 block w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${
              error ? 'border-red-300' : ''
            }`}
          />
        )}

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    )
  }
)

FormField.displayName = 'FormField'
