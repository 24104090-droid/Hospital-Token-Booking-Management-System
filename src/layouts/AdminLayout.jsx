import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from '../components/admin/AdminSidebar';
import AdminNavbar from '../components/admin/AdminNavbar';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex bg-slate-100 font-sans text-slate-900">
      {/* Desktop & Mobile Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 md:static ${sidebarOpen ? 'block' : 'hidden md:block'}`}>
        <AdminSidebar onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* Main Administrative Work Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <AdminNavbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
