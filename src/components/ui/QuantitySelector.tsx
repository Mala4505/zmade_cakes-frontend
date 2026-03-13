import React from 'react';
import { Button } from './Button';
import { MinusIcon, PlusIcon } from 'lucide-react';
interface QuantitySelectorProps {
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  className?: string;
}
export function QuantitySelector({
  value,
  onChange,
  min = 1,
  max = 99,
  className = ''
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (value > min) onChange(value - 1);
  };
  const handleIncrease = () => {
    if (value < max) onChange(value + 1);
  };
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleDecrease}
        disabled={value <= min}
        type="button">

        <MinusIcon className="h-3 w-3" />
      </Button>
      <span className="w-6 text-center font-medium text-foreground">
        {value}
      </span>
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-full"
        onClick={handleIncrease}
        disabled={value >= max}
        type="button">

        <PlusIcon className="h-3 w-3" />
      </Button>
    </div>);

}