'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Users,
  BookOpen,
  Settings,
  LogOut,
  Bot,
  Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

const menuItems = [
  { icon: LayoutDashboard, label: 'Overview', href: '/admin/dashboard' },
  { icon: MessageSquare, label: 'Conversations', href: '/admin/conversations' },
  { icon: Users, label: 'Leads', href: '/admin/leads' },
  { icon: BookOpen, label: 'Knowledge', href: '/admin/knowledge' },
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export default function Sidebar() {
  const pathname = usePathname();
  const logout = useAuthStore((state) => state.logout);

  return (
    <aside className="flex w-[240px] shrink-0 flex-col bg-[#0f1419] text-[#e2e8f0]">
      <div className="flex h-14 items-center gap-2.5 border-b border-white/10 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#3276ea] text-white">
          <Bot size={18} />
        </div>
        <div>
          <span className="text-sm font-semibold text-white tracking-tight">MAXR Studio</span>
          <p className="text-[10px] text-[#64748b] leading-none mt-0.5">Botpress-style console</p>
        </div>
      </div>

      <nav className="flex-1 space-y-0.5 p-3">
        <p className="px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-[#64748b]">
          Workspace
        </p>
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-[#3276ea]/15 text-white border-l-2 border-[#3276ea] -ml-px pl-[11px]'
                  : 'text-[#94a3b8] hover:bg-white/5 hover:text-white',
              )}
            >
              <item.icon size={18} className={isActive ? 'text-[#3276ea]' : ''} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 p-3 space-y-2">
        <div className="rounded-lg bg-white/5 px-3 py-2.5 flex items-start gap-2">
          <Sparkles size={14} className="text-[#3276ea] mt-0.5 shrink-0" />
          <p className="text-[11px] text-[#94a3b8] leading-snug">
            Widget connected to NestJS + RAG pipeline.
          </p>
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 text-[#94a3b8] hover:text-white hover:bg-white/5"
          onClick={logout}
        >
          <LogOut size={18} />
          Sign out
        </Button>
      </div>
    </aside>
  );
}
