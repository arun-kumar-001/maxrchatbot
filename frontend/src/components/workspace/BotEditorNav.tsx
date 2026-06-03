'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { GitBranch, MessageSquare, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

const links = [
  { href: '/studio/bots/main/workflows', label: 'Workflows', icon: GitBranch },
  { href: '/studio/bots/main/conversations', label: 'Conversations', icon: MessageSquare },
  { href: '/studio/bots/main/knowledge', label: 'Knowledge', icon: BookOpen },
];

export default function BotEditorNav() {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-1 border-b border-slate-200 bg-white px-4">
      {links.map(({ href, label, icon: Icon }) => (
        <Link
          key={href}
          href={href}
          className={cn(
            'flex items-center gap-2 border-b-2 px-3 py-2.5 text-sm font-medium -mb-px transition-colors',
            pathname.startsWith(href)
              ? 'border-teal-600 text-teal-700'
              : 'border-transparent text-slate-500 hover:text-slate-800',
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </div>
  );
}
