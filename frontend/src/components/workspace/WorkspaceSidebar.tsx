'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Home,
  Plug,
  Gauge,
  CreditCard,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/studio', label: 'Home', icon: Home, exact: true },
  { href: '/studio/integrations', label: 'Integrations', icon: Plug },
  { href: '/studio/usage', label: 'Usage', icon: Gauge },
  { href: '/studio/billing', label: 'Billing', icon: CreditCard },
  { href: '/studio/settings', label: 'Settings', icon: Settings },
];

export default function WorkspaceSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col border-r border-slate-200/80 bg-white">
      <div className="flex items-center gap-2.5 px-4 py-4 border-b border-slate-100">
        <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shadow-sm" />
        <div className="min-w-0 flex-1">
          <button
            type="button"
            className="flex w-full items-center gap-1 text-left text-sm font-semibold text-slate-900 truncate"
          >
            Default Workspace
            <ChevronDown className="h-3.5 w-3.5 shrink-0 text-slate-400" />
          </button>
          <span className="inline-flex mt-0.5 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600">
            Free
          </span>
        </div>
      </div>

      <nav className="flex-1 px-2 py-3 space-y-0.5">
        {nav.map(({ href, label, icon: Icon, exact }) => {
          const active = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(`${href}/`);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all',
                active
                  ? 'bg-slate-100 text-slate-900'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900',
              )}
            >
              <Icon className={cn('h-4 w-4', active ? 'text-teal-600' : 'text-slate-400')} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-100 p-3">
        <p className="text-[10px] text-slate-400 leading-relaxed px-1">
          MAXR Studio · Botpress-style workspace
        </p>
      </div>
    </aside>
  );
}
