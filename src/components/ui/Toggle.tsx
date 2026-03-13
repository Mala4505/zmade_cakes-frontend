import React from 'react';
import { motion } from 'framer-motion';
interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
}
export function Toggle({ checked, onChange, label }: ToggleProps) {
  return (
    <div className="flex items-center space-x-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-zm-teal focus:ring-offset-2 ${checked ? 'bg-zm-teal' : 'bg-muted'}`}>

        <motion.span
          layout
          initial={false}
          animate={{
            x: checked ? 20 : 0
          }}
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30
          }}
          className="pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0" />

      </button>
      {label &&
      <span className="text-sm font-medium text-foreground">{label}</span>
      }
    </div>);

}