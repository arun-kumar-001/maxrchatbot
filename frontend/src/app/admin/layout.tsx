import React from 'react';
import Sidebar from '@/components/admin/Sidebar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f7fb]">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-[#e2e8f0] bg-white px-6">
          <div>
            <p className="text-xs font-medium text-[#64748b] uppercase tracking-wide">Studio</p>
            <h2 className="text-sm font-semibold text-[#1e293b]">MAXR Bot Console</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-[#1e293b]">Admin</p>
              <p className="text-xs text-[#64748b]">admin@maxr.io</p>
            </div>
            <Avatar className="h-9 w-9 border border-[#e2e8f0]">
              <AvatarFallback className="bg-[#3276ea] text-white text-xs">AD</AvatarFallback>
            </Avatar>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
