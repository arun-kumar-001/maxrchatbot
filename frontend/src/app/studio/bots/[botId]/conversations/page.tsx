'use client';

import { useEffect, useState } from 'react';
import { studioDataApi, type StudioConversation } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function BotConversationsPage() {
  const [list, setList] = useState<StudioConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    studioDataApi
      .getConversations()
      .then((data) => {
        setList(data);
        if (data[0]) setSelectedId(data[0].id);
      })
      .catch(() => setList([]))
      .finally(() => setLoading(false));
  }, []);

  const selected = list.find((c) => c.id === selectedId);

  return (
    <div className="flex flex-1 min-h-0 h-[calc(100vh-7rem)]">
      <div className="w-full max-w-sm border-r border-slate-200 overflow-y-auto bg-white">
        {loading && <p className="p-4 text-sm text-slate-500">Loading…</p>}
        {!loading && list.length === 0 && (
          <p className="p-4 text-sm text-slate-500">No conversations yet. Test the webchat on the home page.</p>
        )}
        {list.map((c) => {
          const last = c.messages?.[c.messages.length - 1];
          return (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedId(c.id)}
              className={cn(
                'w-full text-left px-4 py-3 border-b border-slate-100 hover:bg-slate-50',
                selectedId === c.id && 'bg-teal-50/50 border-l-2 border-l-teal-600',
              )}
            >
              <p className="text-sm font-medium text-slate-900 truncate">
                Visitor {c.metadata?.visitor_id?.slice(0, 8) || 'guest'}
              </p>
              <p className="text-xs text-slate-500 truncate">{last?.content || '—'}</p>
              <span className="text-[10px] text-slate-400 capitalize">{c.status}</span>
            </button>
          );
        })}
      </div>
      <div className="flex-1 overflow-y-auto bg-[#f4f6f8] p-6">
        {selected ? (
          <div className="max-w-xl mx-auto space-y-3">
            <p className="text-xs text-slate-500 font-mono">{selected.id}</p>
            {(selected.messages || []).map((m) => (
              <div
                key={m.id}
                className={cn(
                  'rounded-2xl px-4 py-2.5 text-sm max-w-[90%] shadow-sm',
                  m.role === 'user'
                    ? 'ml-auto bg-slate-900 text-white'
                    : 'mr-auto border border-slate-200 bg-white text-slate-900',
                )}
              >
                {m.content}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-slate-500 text-center mt-12">Select a conversation</p>
        )}
      </div>
    </div>
  );
}
