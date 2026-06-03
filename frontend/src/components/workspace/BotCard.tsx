'use client';

import Link from 'next/link';
import { Bot, MoreHorizontal, MessageSquare, AlertCircle } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface BotCardProps {
  id: string;
  name: string;
  deployedAgo?: string;
  messages?: number;
  errors?: number;
}

export default function BotCard({
  id,
  name,
  deployedAgo = 'Deployed recently',
  messages = 0,
  errors = 0,
}: BotCardProps) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/studio/bots/${id}/workflows`} className="flex items-center gap-3 min-w-0">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-slate-100 to-slate-50 border border-slate-200">
            <Bot className="h-5 w-5 text-teal-600" />
          </div>
          <div className="min-w-0 text-left">
            <p className="font-semibold text-slate-900 truncate group-hover:text-teal-700 transition-colors">
              {name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{deployedAgo}</p>
          </div>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => (window.location.href = `/studio/bots/${id}/workflows`)}>
              Open editor
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = `/studio/bots/${id}/conversations`)}>
              Conversations
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => (window.location.href = '/')}>
              Preview webchat
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3 border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <MessageSquare className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-900">{messages}</span> Messages
        </div>
        <div className="flex items-center gap-2 text-xs text-slate-600">
          <AlertCircle className="h-3.5 w-3.5 text-slate-400" />
          <span className="font-medium text-slate-900">{errors}</span> Errors
        </div>
      </div>
    </div>
  );
}
