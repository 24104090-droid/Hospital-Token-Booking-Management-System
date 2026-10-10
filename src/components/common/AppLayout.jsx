import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';

/**
 * Master Enterprise Full-Screen Layout Wrapper for TVL SmartCare
 * Optimized for Laptop screens (1366x768, 1440x900, 1920x1080) & Desktops:
 * Fixed 64px (h-16) header, perfectly aligned fixed sidebar, zero gap/overlap,
 * and fluid-width responsive main content area.
 */
const AppLayout = ({ children, noSidebar = false, noFooter = false }) => {
  return (
    <div className="w-full min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 overflow-x-hidden transition-colors duration-200">
      {/* Fixed Full-Width Top Header (Height: 64px = h-16) */}
      <Header />

      <div className="w-full flex flex-1 pt-16">
        {/* Fixed Full-Height Left Sidebar (Width: 288px / w-72 on tablets/laptops, 320px / w-80 on desktops) */}
        {!noSidebar && (
          <aside className="hidden md:block w-72 lg:w-80 fixed top-16 bottom-0 left-0 z-40 bg-slate-900 border-r border-slate-800 overflow-y-auto no-scrollbar shadow-xs">
            <Sidebar />
          </aside>
        )}

        {/* Main Viewport Content Area */}
        <main
          className={`flex-1 flex flex-col w-full min-w-0 min-h-[calc(100vh-4rem)] transition-all duration-150 ${
            !noSidebar ? 'md:pl-72 lg:pl-80' : ''
          }`}
        >
          <div className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto flex flex-col">
            {children}
          </div>

          {!noFooter && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
