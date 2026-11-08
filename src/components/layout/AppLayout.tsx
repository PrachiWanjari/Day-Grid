import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppHeader } from './AppHeader';
import { MobileNavigation } from './MobileNavigation';
import { ToastContainer } from '../common/ToastContainer';
import { ConfirmModal } from '../common/ConfirmModal';

export const AppLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FBFBFA] flex flex-col md:flex-row selection:bg-[#D1E7D7] selection:text-[#1E5031]">
      {/* Persistent Left Desktop Sidebar */}
      <AppSidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-24 md:pb-10">
          <Outlet />
        </main>
      </div>

      {/* Mobile Navigation bar */}
      <MobileNavigation />

      {/* Global Feedback Notifications & Confirmations */}
      <ToastContainer />
      <ConfirmModal />
    </div>
  );
};
