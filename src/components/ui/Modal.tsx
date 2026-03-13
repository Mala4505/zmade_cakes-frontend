import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from 'lucide-react';
import { Button } from './Button';
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}
export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer
}: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen &&
      <>
          <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          transition={{
            duration: 0.2
          }}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          onClick={onClose} />

          <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
            <motion.div
            initial={{
              opacity: 0,
              scale: 0.95,
              y: 10
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              scale: 0.95,
              y: 10
            }}
            transition={{
              duration: 0.25,
              ease: 'easeOut'
            }}
            className="bg-card w-full max-w-md rounded-xl shadow-xl pointer-events-auto overflow-hidden flex flex-col max-h-[90vh]">

              <div className="flex items-center justify-between p-4 border-b border-border">
                <h3 className="font-heading text-2xl text-foreground">
                  {title}
                </h3>
                <Button
                variant="ghost"
                size="icon"
                onClick={onClose}
                className="h-8 w-8 rounded-full">

                  <XIcon className="h-4 w-4" />
                </Button>
              </div>
              <div className="p-4 overflow-y-auto">{children}</div>
              {footer &&
            <div className="p-4 border-t border-border bg-muted/30 flex justify-end space-x-2">
                  {footer}
                </div>
            }
            </motion.div>
          </div>
        </>
      }
    </AnimatePresence>);

}