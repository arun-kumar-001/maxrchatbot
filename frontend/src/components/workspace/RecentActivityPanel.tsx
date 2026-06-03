'use client';

import { useEffect, useState } from 'react';
import { studioDataApi } from '@/lib/api';
import Link from 'next/link';

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function RecentActivityPanel() {
  const [items, setItems] = useState<
    Array<{ id: string; text: string; time: string }>
  >([
    { id: '1', text: 'Published workflow for MAXR Agent', time: 'Just now' },
  ]);

  useEffect(() => {
    studioDataApi
      .getConversations()
      .then((convs) => {
        const derived = convs.slice(0, 5).map((c) => ({
          id: c.id,
          text: `New conversation from visitor ${c.metadata?.visitor_id?.slice(0, 6) || 'guest'}`,
          time: timeAgo(c.updated_at || c.created_at),
        }));
        if (derived.length) setItems(derived);
      })
      .catch(() => {});
  }, []);

  return (
    <aside className="w-full lg:w-[300px] shrink-0 rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <h3 className="text-sm font-semibold text-slate-900">Recent Activity</h3>
        <Link href="/studio/bots/main/conversations" className="text-xs font-medium text-teal-600 hover:underline">
          View all
        </Link>
      </div>
      <ul className="divide-y divide-slate-100 max-h-[420px] overflow-y-auto">
        {items.map((item) => (
          <li key={item.id} className="flex gap-3 px-4 py-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-violet-100 text-xs font-semibold text-violet-700">
              M
            </div>
            <div className="min-w-0">
              <p className="text-xs text-slate-700 leading-snug">{item.text}</p>
              <p className="text-[10px] text-slate-400 mt-1">{item.time}</p>
            </div>
          </li>
        ))}
      </ul>
    </aside>
  );
}
