import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { LeftNavigation } from './LeftNavigation';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState('US');

  const handleToggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <div className="flex h-screen">
      <LeftNavigation isCollapsed={isCollapsed} />
      <div className="flex flex-col flex-1">
        <Header 
          isCollapsed={isCollapsed} 
          onToggleCollapse={handleToggleCollapse}
          selectedCountry={selectedCountry}
          onCountryChange={setSelectedCountry}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}