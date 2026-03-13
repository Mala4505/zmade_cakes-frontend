import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboardIcon,
  PackageIcon,
  UsersIcon,
  ShoppingBagIcon,
  ClipboardListIcon,
  PenToolIcon,
  MenuIcon,
  XIcon,
  LogOutIcon } from
'lucide-react';
interface AppLayoutProps {
  children: React.ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout?: () => void;
}
export function AppLayout({
  children,
  currentPage,
  onNavigate,
  onLogout
}: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboardIcon
  },
  {
    id: 'products',
    label: 'Products',
    icon: ShoppingBagIcon
  },
  {
    id: 'batches',
    label: 'Batches',
    icon: PackageIcon
  },
  {
    id: 'bookings',
    label: 'Bookings',
    icon: ClipboardListIcon
  },
  {
    id: 'custom-orders',
    label: 'Custom Orders',
    icon: PenToolIcon
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: UsersIcon
  }];

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setIsMobileMenuOpen(false);
  };
  return (
    <div className="min-h-screen bg-zm-warm/30 flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 z-40 bg-card border-b border-border px-4 py-3 flex items-center justify-between shadow-sm">
        <h1 className="font-heading text-2xl text-zm-teal">ZMade</h1>
        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -mr-2 text-foreground">

          <MenuIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Mobile Drawer */}
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
              x: '-100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '-100%'
            }}
            transition={{
              type: 'spring',
              damping: 25,
              stiffness: 200
            }}
            className="fixed inset-y-0 left-0 w-64 bg-card z-50 shadow-xl md:hidden flex flex-col">

              <div className="p-4 flex items-center justify-between border-b border-border">
                <h1 className="font-heading text-3xl text-zm-teal">ZMade</h1>
                <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-muted-foreground">

                  <XIcon className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {navItems.map((item) =>
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${currentPage === item.id || currentPage === 'batch-bookings' && item.id === 'batches' ? 'bg-zm-teal/10 text-zm-teal font-medium' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>

                    <item.icon className="h-5 w-5" />
                    <span>{item.label}</span>
                  </button>
              )}
              </nav>
              {onLogout &&
            <div className="p-4 border-t border-border">
                  <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-destructive hover:bg-destructive/10 transition-colors">

                    <LogOutIcon className="h-5 w-5" />
                    <span>Logout</span>
                  </button>
                </div>
            }
            </motion.div>
          </>
        }
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 flex-col fixed inset-y-0 border-r border-border bg-card z-30">
        <div className="p-6">
          <h1 className="font-heading text-4xl text-zm-teal">ZMade</h1>
          <p className="text-xs text-muted-foreground mt-1 font-medium tracking-wider uppercase">
            Artisan Admin
          </p>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {navItems.map((item) =>
          <button
            key={item.id}
            onClick={() => handleNavigate(item.id)}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all ${currentPage === item.id || currentPage === 'batch-bookings' && item.id === 'batches' ? 'bg-zm-teal text-white shadow-md' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>

              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          )}
        </nav>
        {onLogout &&
        <div className="p-4 border-t border-border">
            <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-destructive hover:bg-destructive/10 transition-colors">

              <LogOutIcon className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        }
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 max-w-[1400px] mx-auto w-full overflow-x-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage}
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
            }}
            className="h-full">

            {children}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>);

}