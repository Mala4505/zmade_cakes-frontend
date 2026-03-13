import React from 'react';
interface StockIndicatorProps {
  available: number;
  className?: string;
}
export function StockIndicator({
  available,
  className = ''
}: StockIndicatorProps) {
  if (available <= 0) {
    return (
      <span
        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-destructive/10 text-destructive ${className}`}>

        Sold Out
      </span>);

  }
  if (available < 5) {
    return (
      <span className={`text-xs font-medium text-zm-warning ${className}`}>
        Only {available} left
      </span>);

  }
  return (
    <span className={`text-xs font-medium text-zm-success ${className}`}>
      In Stock
    </span>);

}