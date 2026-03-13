import React from 'react';
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: {
    value: string;
    label: string;
  }[];
  error?: string;
}
export function Select({
  label,
  options,
  error,
  className = '',
  ...props
}: SelectProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <select
        className={`px-3 py-2 bg-card border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zm-teal focus:border-transparent appearance-none ${error ? 'border-destructive focus:ring-destructive' : 'border-border'} ${className}`}
        {...props}>

        <option value="" disabled>
          Select an option
        </option>
        {options.map((option) =>
        <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )}
      </select>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>);

}