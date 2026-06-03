'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search, MessageSquare, Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const mockConversations = [
  {
    id: '1',
    user: 'Visitor #4829',
    status: 'active',
    lastMessage: 'How do I reset my password?',
    time: '2m ago',
    channel: 'Webchat',
  },
  {
    id: '2',
    user: 'Sarah Smith',
    status: 'resolved',
    lastMessage: 'Thank you for your help!',
    time: '1h ago',
    channel: 'Webchat',
  },
  {
    id: '3',
    user: 'Mike Johnson',
    status: 'escalated',
    lastMessage: 'Connecting you to a human agent...',
    time: '3h ago',
    channel: 'Webchat',
  },
];

const statusStyles: Record<string, string> = {
  active: 'bg-emerald-500/10 text-emerald-700 border-emerald-200',
  resolved: 'bg-slate-100 text-slate-600 border-slate-200',
  escalated: 'bg-amber-500/10 text-amber-800 border-amber-200',
};

export default function ConversationsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedId, setSelectedId] = useState(mockConversations[0]?.id ?? '');

  const selected = mockConversations.find((c) => c.id === selectedId);
  const filtered = mockConversations.filter(
    (c) =>
      c.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-[#1e293b]">Conversations</h1>
        <p className="text-sm text-[#64748b]">
          Inbox-style view inspired by Botpress Studio — wire to{' '}
          <code className="text-xs bg-white px-1 rounded">/api/admin/conversations</code> when auth is ready.
        </p>
      </div>

      <div className="flex flex-1 min-h-0 rounded-xl border border-[#e2e8f0] bg-white overflow-hidden shadow-sm">
        {/* List pane */}
        <div className="w-full max-w-sm flex flex-col border-r border-[#e2e8f0] bg-[#fafbfc]">
          <div className="p-3 border-b border-[#e2e8f0]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94a3b8]" />
              <Input
                placeholder="Search inbox…"
                className="pl-9 h-9 bg-white border-[#e2e8f0] text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">
            {filtered.map((chat) => (
              <button
                key={chat.id}
                type="button"
                onClick={() => setSelectedId(chat.id)}
                className={cn(
                  'w-full text-left px-4 py-3 border-b border-[#e2e8f0]/80 transition-colors',
                  selectedId === chat.id
                    ? 'bg-[#3276ea]/8 border-l-2 border-l-[#3276ea]'
                    : 'hover:bg-white',
                )}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-medium text-sm text-[#1e293b] truncate">{chat.user}</span>
                  <span className="text-[10px] text-[#94a3b8] shrink-0">{chat.time}</span>
                </div>
                <p className="text-xs text-[#64748b] truncate mb-2">{chat.lastMessage}</p>
                <div className="flex items-center gap-2">
                  <Badge
                    variant="outline"
                    className={cn('text-[10px] px-1.5 py-0', statusStyles[chat.status])}
                  >
                    {chat.status}
                  </Badge>
                  <span className="text-[10px] text-[#94a3b8]">{chat.channel}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread pane */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#f5f7fb]">
          {selected ? (
            <>
              <div className="flex items-center justify-between px-5 py-3 border-b border-[#e2e8f0] bg-white">
                <div>
                  <h3 className="font-semibold text-[#1e293b]">{selected.user}</h3>
                  <p className="text-xs text-[#64748b]">{selected.channel} · {selected.time}</p>
                </div>
                <Badge variant="outline" className={statusStyles[selected.status]}>
                  {selected.status}
                </Badge>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                <div className="flex gap-2 max-w-[85%]">
                  <div className="h-8 w-8 rounded-full bg-white border flex items-center justify-center text-[#3276ea]">
                    <User size={14} />
                  </div>
                  <div className="rounded-2xl rounded-bl-md bg-white border border-[#e2e8f0] px-4 py-2 text-sm shadow-sm">
                    {selected.lastMessage}
                  </div>
                </div>
                <div className="flex gap-2 max-w-[85%] ml-auto flex-row-reverse">
                  <div className="h-8 w-8 rounded-full bg-[#3276ea] flex items-center justify-center text-white">
                    <Bot size={14} />
                  </div>
                  <div className="rounded-2xl rounded-br-md bg-[#3276ea] text-white px-4 py-2 text-sm shadow-sm">
                    I&apos;d be happy to help with that. This preview uses sample data until admin API auth is connected.
                  </div>
                </div>
              </div>
              <div className="p-4 border-t border-[#e2e8f0] bg-white">
                <div className="rounded-xl border border-[#e2e8f0] bg-[#f8fafc] px-4 py-3 text-sm text-[#94a3b8]">
                  Agent reply box — takeover from{' '}
                  <code className="text-xs">POST /api/admin/takeover</code>
                </div>
              </div>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center text-[#94a3b8]">
              <MessageSquare className="h-10 w-10 opacity-20 mb-2" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
