import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { LeftNavigation } from './LeftNavigation';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed on mobile
  
  const handleToggleCollapse = useCallback(() => {
    setIsCollapsed(!isCollapsed);
  }, [isCollapsed]);

  const handleOverlayClick = useCallback(() => {
    setIsCollapsed(true);
  }, []);

  return (
    <div className="h-screen overflow-hidden">
      {/* Overlay for mobile */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden transition-opacity duration-300 ${
          isCollapsed ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
        onClick={handleOverlayClick}
      />

      <div className="flex h-full">
        <LeftNavigation isCollapsed={isCollapsed} />
        
        <div className={`flex flex-col flex-1 w-full transition-all duration-300 ${
          !isCollapsed ? 'md:ml-64' : 'md:ml-20'
        }`}>
          <Header 
            isCollapsed={isCollapsed} 
            onToggleCollapse={handleToggleCollapse}
          />
          <main className="flex-1 overflow-auto relative">
            {children}
          </main>
          <Footer />
        </div>
      </div>
    </div>
  );
}