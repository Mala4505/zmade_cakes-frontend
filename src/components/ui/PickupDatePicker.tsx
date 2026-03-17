import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

interface PickupDatePickerProps {
  /** Batch start date as "YYYY-MM-DD" string */
  batchStartDate: string;
  /** Currently selected date as "YYYY-MM-DD" string, or null */
  value: string | null;
  onChange: (date: string) => void;
}

export function PickupDatePicker({
  batchStartDate,
  value,
  onChange,
}: PickupDatePickerProps) {
  // Build the enabled date window: batch start → start + 3 days
  // Also never allow dates before today
  const batchStart = new Date(batchStartDate);
  batchStart.setHours(0, 0, 0, 0);

  const batchEnd = new Date(batchStart);
  batchEnd.setDate(batchEnd.getDate() + 3);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Earliest selectable = max(batchStart, today)
  const enabledFrom = batchStart < today ? today : batchStart;

  const selected = value ? new Date(value) : undefined;

  const isDisabled = (date: Date): boolean => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    return d < enabledFrom || d > batchEnd;
  };

  const formatDate = (d: Date) =>
    d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="flex flex-col gap-1">
      <DayPicker
        mode="single"
        selected={selected}
        onSelect={(date) => {
          if (date) onChange(date.toISOString().split('T')[0]);
        }}
        disabled={isDisabled}
        defaultMonth={enabledFrom}
        classNames={{
          root: 'rdp-custom',
        }}
      />
      <p className="text-xs text-muted-foreground px-1">
        Available:{' '}
        <span className="font-medium">{formatDate(enabledFrom)}</span>
        {' – '}
        <span className="font-medium">{formatDate(batchEnd)}</span>
      </p>
    </div>
  );
}