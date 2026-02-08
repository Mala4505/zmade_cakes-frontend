import React from 'react';
import { Loader2 } from 'lucide-react';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}
export function Button({
  className = '',
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zm-deepTeal disabled:pointer-events-none disabled:opacity-50 active:scale-95';
  const variants = {
    primary:
    'bg-zm-deepTeal text-white hover:bg-zm-deepTealHover shadow-md hover:shadow-lg',
    secondary:
    'bg-zm-mintCream text-zm-deepTeal hover:bg-green-50 border border-transparent',
    outline:
    'border border-zm-greyOlive/30 bg-transparent text-zm-stoneBrown hover:bg-zm-mintCream hover:text-zm-deepTeal',
    ghost: 'hover:bg-zm-mintCream text-zm-stoneBrown hover:text-zm-deepTeal',
    danger: 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-100'
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10'
  };
  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={disabled || isLoading}
      {...props}>

      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>);

}