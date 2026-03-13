import React from 'react';
import { CartItem } from '../../types';
import { QuantitySelector } from '../ui/QuantitySelector';
import { Button } from '../ui/Button';
import { Trash2Icon } from 'lucide-react';
interface CartItemRowProps {
  item: CartItem;
  onUpdateQty: (qty: number) => void;
  onRemove: () => void;
}
export function CartItemRow({ item, onUpdateQty, onRemove }: CartItemRowProps) {
  return (
    <div className="flex py-4 border-b border-border last:border-0">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-border">
        <img
          src={item.image}
          alt={item.productName}
          className="h-full w-full object-cover object-center" />

      </div>

      <div className="ml-4 flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-foreground">
            <h3 className="line-clamp-1">{item.productName}</h3>
            <p className="ml-4 text-zm-teal">KWD {item.price * item.quantity}</p>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Pickup: {new Date(item.pickupDate).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <QuantitySelector
            value={item.quantity}
            onChange={onUpdateQty}
            max={10} // In a real app, this would be the available stock
          />

          <div className="flex">
            <Button
              variant="ghost"
              size="sm"
              onClick={onRemove}
              className="text-destructive hover:text-destructive hover:bg-destructive/10 px-2">

              <Trash2Icon className="h-4 w-4 mr-1" />
              Remove
            </Button>
          </div>
        </div>
      </div>
    </div>);

}