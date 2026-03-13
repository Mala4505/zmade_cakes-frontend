import React, { useEffect, useState } from 'react';
interface AnimatedCounterProps {
  value: number;
  prefix?: string;
  duration?: number;
  className?: string;
}
export function AnimatedCounter({
  value,
  prefix = '',
  duration = 1000,
  className = ''
}: AnimatedCounterProps) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let startTime: number | null = null;
    const startValue = 0;
    const endValue = value;
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      // Ease out quad
      const easeProgress = progress * (2 - progress);
      setCount(Math.floor(easeProgress * (endValue - startValue) + startValue));
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
      }
    };
    requestAnimationFrame(animate);
  }, [value, duration]);
  return (
    <span className={className}>
      {prefix}
      {count.toLocaleString()}
    </span>);

}