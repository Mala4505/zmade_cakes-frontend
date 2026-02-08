import React from 'react';
import { Navbar } from './Navbar';
interface LayoutProps {
  children: React.ReactNode;
  onNavigate: (page: string) => void;
  currentPage: string;
  showNav?: boolean;
}
export function Layout({
  children,
  onNavigate,
  currentPage,
  showNav = true
}: LayoutProps) {
  return (
    <div className="min-h-screen bg-zm-white flex flex-col">
      {showNav && <Navbar onNavigate={onNavigate} currentPage={currentPage} />}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {children}
      </main>
      <footer className="py-6 text-center text-xs text-zm-greyOlive/50">
        <p>© 2023 ZMade Cakes Kuwait. All rights reserved.</p>
      </footer>
    </div>);

}