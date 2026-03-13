import React from 'react';
import { motion } from 'framer-motion';
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverable?: boolean;
}
export function Card({
  children,
  className = '',
  hoverable = false,
  ...props
}: CardProps) {
  const baseStyles =
  'bg-card text-card-foreground rounded-xl border border-border/50 shadow-soft';
  if (hoverable) {
    return (
      <motion.div
        whileHover={{
          y: -2,
          boxShadow:
          '0 4px 12px 0 rgba(0, 0, 0, 0.08), 0 2px 4px -1px rgba(0, 0, 0, 0.04)'
        }}
        transition={{
          duration: 0.2
        }}
        className={`${baseStyles} ${className}`}
        {...props}>

        {children}
      </motion.div>);

  }
  return (
    <div className={`${baseStyles} ${className}`} {...props}>
      {children}
    </div>);

}