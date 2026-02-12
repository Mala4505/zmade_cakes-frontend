import React, { useEffect } from "react";
import { Navbar } from "./Navbar";

interface LayoutProps {
  children: React.ReactNode;
  showNav?: boolean;
  title?: string; // new prop for page title
}

export function Layout({ children, showNav = true, title }: LayoutProps) {
  useEffect(() => {
    if (title) {
      document.title = title;
    }
    // favicon stays the same globally
    const favicon = document.querySelector<HTMLLinkElement>("link[rel='icon']");
    if (favicon) {
      favicon.href = "/logo.jpeg"; // your global icon in public/
    }
  }, [title]);

  return (
    <div className="min-h-screen bg-zm-white flex flex-col">
      {showNav && <Navbar />}
      <main className="flex-1 container mx-auto px-4 py-6 md:py-8 max-w-7xl">
        {children}
      </main>
      <footer className="py-6 text-center text-xs text-zm-greyOlive/50">
        <p>© 2026 ZMade Cakes Kuwait. All rights reserved.</p>
      </footer>
    </div>
  );
}
