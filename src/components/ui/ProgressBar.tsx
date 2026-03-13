import React from 'react';
import { motion } from 'framer-motion';
interface ProgressBarProps {
  total: number;
  booked: number;
  collected: number;
}
export function ProgressBar({ total, booked, collected }: ProgressBarProps) {
  const bookedPercentage = total > 0 ? booked / total * 100 : 0;
  const collectedPercentage = booked > 0 ? collected / booked * 100 : 0;
  return (
    <div className="space-y-3">
      {/* Booked vs Total */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">
            Booked ({booked}/{total})
          </span>
          <span className="font-medium">{Math.round(bookedPercentage)}%</span>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{
              width: 0
            }}
            animate={{
              width: `${bookedPercentage}%`
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut'
            }}
            className={`h-full rounded-full ${bookedPercentage >= 100 ? 'bg-destructive' : 'bg-zm-teal'}`} />

        </div>
      </div>

      {/* Collected vs Booked */}
      <div>
        <div className="flex justify-between text-xs mb-1">
          <span className="text-muted-foreground">
            Collected ({collected}/{booked})
          </span>
          <span className="font-medium">
            {Math.round(collectedPercentage)}%
          </span>
        </div>
        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
          <motion.div
            initial={{
              width: 0
            }}
            animate={{
              width: `${collectedPercentage}%`
            }}
            transition={{
              duration: 0.8,
              ease: 'easeOut',
              delay: 0.2
            }}
            className="h-full bg-zm-success rounded-full" />

        </div>
      </div>
    </div>);

}