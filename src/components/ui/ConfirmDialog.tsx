import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from './Button';
interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'default' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
}
export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'default',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200 border border-zm-greyOlive/10"
        role="dialog"
        aria-modal="true">

        <div className="flex items-start gap-4 mb-4">
          {variant === 'danger' &&
          <div className="p-2 bg-red-50 rounded-full text-red-500 shrink-0">
              <AlertTriangle size={24} />
            </div>
          }
          <div>
            <h3 className="text-lg font-heading font-bold text-zm-stoneBrown">
              {title}
            </h3>
            <p className="text-sm text-zm-greyOlive mt-1">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onCancel}>
            {cancelText}
          </Button>
          <Button
            variant={variant === 'danger' ? 'danger' : 'primary'}
            onClick={onConfirm}>

            {confirmText}
          </Button>
        </div>
      </div>
    </div>);

}