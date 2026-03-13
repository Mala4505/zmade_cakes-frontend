import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBagIcon, MenuIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
interface PublicLayoutProps {
  children: React.ReactNode;
  cartItemCount: number;
  onCartClick: () => void;
}
export function PublicLayout({
  children,
  cartItemCount,
  onCartClick
}: PublicLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <div className="min-h-screen bg-zm-warm/30 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <Link to="/shop" className="font-heading text-3xl text-zm-teal">
                ZMade
              </Link>
            </div>

            {/* Desktop Nav */}
            <nav className="hidden md:flex space-x-8">
              <Link
                to="/shop"
                className="text-foreground hover:text-zm-teal px-3 py-2 rounded-md text-sm font-medium transition-colors">

                Shop
              </Link>
            </nav>

            {/* Cart & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onCartClick}
                className="relative p-2 text-foreground hover:text-zm-teal transition-colors">

                <ShoppingBagIcon className="h-6 w-6" />
                {cartItemCount > 0 &&
                <span className="absolute top-0 right-0 -mt-1 -mr-1 flex h-5 w-5 items-center justify-center rounded-full bg-zm-teal text-[10px] font-bold text-white shadow-sm">
                    {cartItemCount}
                  </span>
                }
              </button>

              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-foreground">

                <MenuIcon className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen &&
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
            className="fixed inset-0 bg-black/40 z-50 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)} />

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
            className="fixed inset-y-0 right-0 w-64 bg-card z-50 shadow-xl md:hidden flex flex-col">

              <div className="p-4 flex items-center justify-between border-b border-border">
                <h2 className="font-heading text-2xl text-zm-teal">Menu</h2>
                <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-muted-foreground">

                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-2">
                <Link
                to="/shop"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-lg text-foreground hover:bg-muted font-medium transition-colors">

                  Shop
                </Link>
              </nav>
            </motion.div>
          </>
        }
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{
              opacity: 0,
              y: 15
            }}
            animate={{
              opacity: 1,
              y: 0
            }}
            exit={{
              opacity: 0,
              y: -15
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut'
            }}>

            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="font-heading text-2xl text-zm-teal mb-2">ZMade</p>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} ZMade Artisan Bakery. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>);

}