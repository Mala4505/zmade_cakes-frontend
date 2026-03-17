interface StatusPillProps {
  isProductActive: boolean;
  hasAvailability: boolean;
}

export function StatusPill({ isProductActive, hasAvailability }: StatusPillProps) {
  if (!isProductActive) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50" />
        Currently Unavailable
      </span>
    );
  }

  if (!hasAvailability) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
        <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
        Sold Out
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
      In Stock
    </span>
  );
}