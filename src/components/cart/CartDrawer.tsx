import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon, ShoppingBagIcon } from 'lucide-react';
import { useCart } from '../../store/cartStore';
import { CartItemRow } from './CartItemRow';
import { Button } from '../ui/Button';
import { useNavigate } from 'react-router-dom';
interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}
export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { state, updateQuantity, removeItem, getTotal } = useCart();
  const navigate = useNavigate();
  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          onClick={onClose} />

          <motion.div
          initial={{
            x: '100%'
          }}
          animate={{
            x: 0
          }}
          exit={{
            x: '100%'
          }}
          transition={{
            type: 'spring',
            damping: 25,
            stiffness: 200
          }}
          className="fixed inset-y-0 right-0 w-full max-w-md bg-card z-50 shadow-xl flex flex-col">

            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="font-heading text-2xl text-foreground flex items-center">
                <ShoppingBagIcon className="h-5 w-5 mr-2 text-zm-teal" />
                Your Cart
              </h2>
              <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full">

                <XIcon className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {state.items.length === 0 ?
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="p-4 bg-muted rounded-full text-muted-foreground">
                    <ShoppingBagIcon className="h-12 w-12" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Looks like you haven't added anything yet.
                    </p>
                  </div>
                  <Button
                variant="outline"
                onClick={() => {
                  onClose();
                  navigate('/shop');
                }}>

                    Start Shopping
                  </Button>
                </div> :

            <div className="space-y-2">
                  {state.items.map((item) =>
              <CartItemRow
                key={`${item.productId}-${item.batchStockId}`}
                item={item}
                onUpdateQty={(qty) =>
                updateQuantity(item.productId, item.batchStockId, qty)
                }
                onRemove={() =>
                removeItem(item.productId, item.batchStockId)
                } />

              )}
                </div>
            }
            </div>

            {state.items.length > 0 &&
          <div className="border-t border-border p-4 bg-muted/30">
                <div className="flex justify-between text-base font-medium text-foreground mb-4">
                  <p>Subtotal</p>
                  <p className="text-zm-teal">KWD {getTotal()}</p>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button
              variant="primary"
              className="w-full py-6 text-lg"
              onClick={handleCheckout}>

                  Proceed to Checkout
                </Button>
              </div>
          }
          </motion.div>
        </>
      }
    </AnimatePresence>);

}