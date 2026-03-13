import React from 'react';
type BadgeVariant =
'booked' |
'collected' |
'cancelled' |
'full' |
'active' |
'closed' |
'upcoming' |
'paid' |
'partial' |
'unpaid';
interface BadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}
export function Badge({ variant, children, className = '' }: BadgeProps) {
  const variantStyles: Record<BadgeVariant, string> = {
    booked: 'bg-zm-warning-light text-zm-warning border border-zm-warning/20',
    collected:
    'bg-zm-success-light text-zm-success border border-zm-success/20',
    cancelled:
    'bg-destructive/10 text-destructive border border-destructive/20',
    full: 'bg-destructive text-destructive-foreground',
    active: 'bg-zm-teal-light text-zm-teal border border-zm-teal/20',
    closed: 'bg-muted text-muted-foreground border border-border',
    upcoming: 'bg-zm-gold-light text-zm-gold border border-zm-gold/20',
    paid: 'bg-zm-success-light text-zm-success border border-zm-success/20',
    partial: 'bg-zm-warning-light text-zm-warning border border-zm-warning/20',
    unpaid: 'bg-destructive/10 text-destructive border border-destructive/20'
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${variantStyles[variant]} ${className}`}>

      {children}
    </span>);

}