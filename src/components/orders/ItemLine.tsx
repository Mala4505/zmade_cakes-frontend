// import React from 'react';
// import { Trash2 } from 'lucide-react';
// import { Input } from '../ui/Input';
// import { Button } from '../ui/Button';
// import { OrderItem } from '../../mockData';
// interface ItemLineProps {
//   item: OrderItem;
//   onChange: (id: string, field: keyof OrderItem, value: any) => void;
//   onRemove: (id: string) => void;
//   readOnly?: boolean;
// }
// export function ItemLine({
//   item,
//   onChange,
//   onRemove,
//   readOnly = false
// }: ItemLineProps) {
//   const cakeTypes = [
//   'Birthday Cake',
//   'Wedding Cake',
//   'Cupcakes',
//   'Bento Cake',
//   'Cheesecake',
//   'Custom Cake'];

//   const sizes = [
//   '4 inch',
//   '6 inch',
//   '8 inch',
//   '10 inch',
//   '2 Tier',
//   '3 Tier',
//   'Dozen',
//   'Half Dozen'];

//   const flavors = [
//   'Vanilla',
//   'Chocolate',
//   'Red Velvet',
//   'Carrot',
//   'Lemon',
//   'Strawberry',
//   'Marble'];

//   if (readOnly) {
//     return (
//       <div className="p-4 rounded-xl bg-zm-mintCream/50 border border-zm-greyOlive/10 mb-3">
//         <div className="flex justify-between items-start mb-2">
//           <div>
//             <h4 className="font-semibold text-zm-stoneBrown">{item.type}</h4>
//             <p className="text-sm text-zm-greyOlive">
//               {item.size} • {item.flavor}
//             </p>
//           </div>
//           <div className="text-right">
//             <p className="font-semibold text-zm-deepTeal">
//               {item.price.toFixed(3)} KWD
//             </p>
//             <p className="text-xs text-zm-greyOlive">Qty: {item.quantity}</p>
//           </div>
//         </div>
//         {item.notes &&
//         <div className="text-sm text-zm-stoneBrown/80 bg-white p-2 rounded-lg border border-zm-greyOlive/10">
//             <span className="text-xs font-semibold text-zm-greyOlive block">
//               Notes:
//             </span>
//             {item.notes}
//           </div>
//         }
//       </div>);

//   }
//   return (
//     <div className="p-4 rounded-xl bg-gray-50 border border-zm-greyOlive/10 mb-4 relative group">
//       <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
//         {/* Row 1: Type, Size, Flavor */}
//         <div className="md:col-span-4">
//           <label className="text-xs font-medium text-zm-greyOlive ml-1 mb-1 block">
//             Type
//           </label>
//           <select
//             className="w-full h-11 rounded-xl border border-zm-greyOlive/20 bg-white px-3 text-sm focus:border-zm-deepTeal focus:outline-none"
//             value={item.type}
//             onChange={(e) => onChange(item.id, 'type', e.target.value)}>

//             <option value="">Select Type</option>
//             {cakeTypes.map((t) =>
//             <option key={t} value={t}>
//                 {t}
//               </option>
//             )}
//           </select>
//         </div>
//         <div className="md:col-span-4">
//           <label className="text-xs font-medium text-zm-greyOlive ml-1 mb-1 block">
//             Flavor
//           </label>
//           <select
//             className="w-full h-11 rounded-xl border border-zm-greyOlive/20 bg-white px-3 text-sm focus:border-zm-deepTeal focus:outline-none"
//             value={item.flavor}
//             onChange={(e) => onChange(item.id, 'flavor', e.target.value)}>

//             <option value="">Select Flavor</option>
//             {flavors.map((f) =>
//             <option key={f} value={f}>
//                 {f}
//               </option>
//             )}
//           </select>
//         </div>
//         <div className="md:col-span-4">
//           <label className="text-xs font-medium text-zm-greyOlive ml-1 mb-1 block">
//             Size
//           </label>
//           <select
//             className="w-full h-11 rounded-xl border border-zm-greyOlive/20 bg-white px-3 text-sm focus:border-zm-deepTeal focus:outline-none"
//             value={item.size}
//             onChange={(e) => onChange(item.id, 'size', e.target.value)}>

//             <option value="">Select Size</option>
//             {sizes.map((s) =>
//             <option key={s} value={s}>
//                 {s}
//               </option>
//             )}
//           </select>
//         </div>

//         {/* Row 2: Qty, Price, Notes */}
//         <div className="md:col-span-2">
//           <Input
//             label="Qty"
//             type="number"
//             min="1"
//             value={item.quantity}
//             onChange={(e) =>
//             onChange(item.id, 'quantity', parseInt(e.target.value) || 1)
//             } />

//         </div>
//         <div className="md:col-span-3">
//           <Input
//             label="Price (KWD)"
//             type="number"
//             step="0.100"
//             value={item.price}
//             onChange={(e) =>
//             onChange(item.id, 'price', parseFloat(e.target.value) || 0)
//             } />

//         </div>
//         <div className="md:col-span-7">
//           <Input
//             label="Item Notes"
//             placeholder="e.g. Write 'Happy Birthday'..."
//             value={item.notes}
//             onChange={(e) => onChange(item.id, 'notes', e.target.value)} />

//         </div>
//       </div>

//       <Button
//         variant="ghost"
//         size="icon"
//         className="absolute -top-2 -right-2 bg-white shadow-sm border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 rounded-full"
//         onClick={() => onRemove(item.id)}
//         title="Remove Item">

//         <Trash2 size={14} />
//       </Button>
//     </div>);

// }

import { Trash2 } from "lucide-react";
import { Input } from "../ui/Input";
import { Button } from "../ui/Button";
import { OrderItem } from "../../mockData";

interface ItemLineProps {
  item: OrderItem;
  onChange: (id: string, field: keyof OrderItem, value: any) => void;
  onRemove: (id: string) => void;
  readOnly?: boolean;
}

export function ItemLine({
  item,
  onChange,
  onRemove,
  readOnly = false,
}: ItemLineProps) {
  const cakeTypes = [
    "Birthday Cake",
    "Wedding Cake",
    "Cupcakes",
    "Bento Cake",
    "Cheesecake",
    "Custom Cake",
  ];

  const sizes = [
    "4 inch",
    "6 inch",
    "8 inch",
    "10 inch",
    "2 Tier",
    "3 Tier",
    "Dozen",
    "Half Dozen",
  ];

  const flavors = [
    "Vanilla",
    "Chocolate",
    "Red Velvet",
    "Carrot",
    "Lemon",
    "Strawberry",
    "Marble",
  ];

  if (readOnly) {
    return (
      <div className="p-4 rounded-xl bg-zm-mintCream/50 border border-zm-greyOlive/10 mb-3">
        <div className="flex justify-between items-start mb-2">
          <div>
            <h4 className="font-semibold text-zm-stoneBrown">{item.type}</h4>
            <p className="text-sm text-zm-greyOlive">
              {item.size} • {item.flavor}
            </p>
          </div>
          <div className="text-right">
            <p className="font-semibold text-zm-deepTeal">
              {item.price.toFixed(3)} KWD
            </p>
            <p className="text-xs text-zm-greyOlive">Qty: {item.quantity}</p>
          </div>
        </div>
        {item.notes && (
          <div className="text-sm text-zm-stoneBrown/80 bg-white p-2 rounded-lg border border-zm-greyOlive/10">
            <span className="text-xs font-semibold text-zm-greyOlive block">
              Notes:
            </span>
            {item.notes}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="p-4 rounded-xl bg-gray-50 border border-zm-greyOlive/10 mb-4 relative group">
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
        {/* Type */}
        <div className="md:col-span-4">
          <label className="text-xs font-medium text-zm-greyOlive ml-1 mb-1 block">
            Type
          </label>
          <select
            className="w-full h-11 rounded-xl border border-zm-greyOlive/20 bg-white px-3 text-sm focus:border-zm-deepTeal focus:outline-none"
            value={item.type}
            onChange={(e) => onChange(item.id, "type", e.target.value)}
          >
            <option value="">Select Type</option>
            {cakeTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        {/* Flavor */}
        <div className="md:col-span-4">
          <label className="text-xs font-medium text-zm-greyOlive ml-1 mb-1 block">
            Flavor
          </label>
          <select
            className="w-full h-11 rounded-xl border border-zm-greyOlive/20 bg-white px-3 text-sm focus:border-zm-deepTeal focus:outline-none"
            value={item.flavor}
            onChange={(e) => onChange(item.id, "flavor", e.target.value)}
          >
            <option value="">Select Flavor</option>
            {flavors.map((f) => (
              <option key={f} value={f}>
                {f}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div className="md:col-span-4">
          <label className="text-xs font-medium text-zm-greyOlive ml-1 mb-1 block">
            Size
          </label>
          <select
            className="w-full h-11 rounded-xl border border-zm-greyOlive/20 bg-white px-3 text-sm focus:border-zm-deepTeal focus:outline-none"
            value={item.size}
            onChange={(e) => onChange(item.id, "size", e.target.value)}
          >
            <option value="">Select Size</option>
            {sizes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {/* Qty */}
        <div className="md:col-span-2">
          <Input
            label="Qty"
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              onChange(item.id, "quantity", parseInt(e.target.value) || 1)
            }
          />
        </div>

        {/* Price */}
        <div className="md:col-span-3">
          <Input
            label="Price (KWD)"
            type="number"
            step="0.100"
            value={item.price}
            onChange={(e) =>
              onChange(item.id, "price", parseFloat(e.target.value) || 0)
            }
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-7">
          <Input
            label="Item Notes"
            placeholder="e.g. Write 'Happy Birthday'..."
            value={item.notes}
            onChange={(e) => onChange(item.id, "notes", e.target.value)}
          />
        </div>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="absolute -top-2 -right-2 bg-white shadow-sm border border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600 h-8 w-8 rounded-full"
        onClick={() => onRemove(item.id)}
        title="Remove Item"
      >
        <Trash2 size={14} />
      </Button>
    </div>
  );
}
