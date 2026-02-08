import React from 'react';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}
export function Input({
  className = '',
  label,
  error,
  icon,
  id,
  ...props
}: InputProps) {
  const inputId = id || props.name || Math.random().toString(36).substr(2, 9);
  return (
    <div className="w-full space-y-1.5">
      {label &&
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-zm-stoneBrown/80 ml-1">

          {label}
        </label>
      }
      <div className="relative">
        {icon &&
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-zm-greyOlive">
            {icon}
          </div>
        }
        <input
          id={inputId}
          className={`
            flex h-11 w-full rounded-xl border border-zm-greyOlive/20 bg-white px-3 py-2 text-sm text-zm-stoneBrown 
            placeholder:text-zm-greyOlive/50 focus:border-zm-deepTeal focus:outline-none focus:ring-1 focus:ring-zm-deepTeal 
            disabled:cursor-not-allowed disabled:opacity-50 transition-all shadow-sm
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : ''}
            ${className}
          `}
          {...props} />

      </div>
      {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
    </div>);

}