import React from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { LeftNavigation } from './LeftNavigation'; // New component

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex flex-col h-screen">
      <Header />
      <div className="flex flex-1 overflow-hidden">
        <LeftNavigation />
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}