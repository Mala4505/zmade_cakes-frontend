import React from 'react';
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}
export function Input({ label, error, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col space-y-1.5 w-full">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <input
        className={`px-3 py-2 bg-card border rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-zm-teal focus:border-transparent ${error ? 'border-destructive focus:ring-destructive' : 'border-border'} ${className}`}
        {...props} />

      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>);

}