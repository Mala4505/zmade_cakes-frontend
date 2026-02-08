import React from 'react';
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?:
  'default' |
  'secondary' |
  'outline' |
  'success' |
  'warning' |
  'danger' |
  'info';
}
export function Badge({
  className = '',
  variant = 'default',
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: 'bg-zm-deepTeal text-white',
    secondary: 'bg-zm-mintCream text-zm-deepTeal',
    outline: 'text-zm-stoneBrown border border-zm-greyOlive/30',
    success: 'bg-green-100 text-green-700',
    warning: 'bg-amber-100 text-amber-700',
    danger: 'bg-red-100 text-red-700',
    info: 'bg-blue-100 text-blue-700'
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variants[variant]} ${className}`}
      {...props}>

      {children}
    </span>);

}