'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  MessageSquare,
  Users,
  Zap,
  Clock,
  ArrowUpRight,
} from 'lucide-react';

const stats = [
  {
    label: 'Conversations',
    value: '—',
    hint: 'Connect admin API',
    icon: MessageSquare,
    accent: 'text-[#3276ea]',
    bg: 'bg-[#3276ea]/10',
  },
  {
    label: 'Leads captured',
    value: '—',
    hint: 'From widget & forms',
    icon: Users,
    accent: 'text-emerald-600',
    bg: 'bg-emerald-500/10',
  },
  {
    label: 'RAG answers',
    value: 'On',
    hint: 'Qdrant + knowledge base',
    icon: Zap,
    accent: 'text-violet-600',
    bg: 'bg-violet-500/10',
  },
  {
    label: 'Avg. response',
    value: '~1.2s',
    hint: 'LLM latency',
    icon: Clock,
    accent: 'text-amber-600',
    bg: 'bg-amber-500/10',
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[#1e293b]">Overview</h1>
        <p className="text-sm text-[#64748b] mt-1">
          Botpress-style studio dashboard for your MAXR assistant.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="border-[#e2e8f0] shadow-sm bg-white"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-[#64748b]">
                {stat.label}
              </CardTitle>
              <div className={`rounded-lg p-2 ${stat.bg}`}>
                <stat.icon className={`h-4 w-4 ${stat.accent}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-[#1e293b]">{stat.value}</div>
              <p className="text-xs text-[#94a3b8] mt-1">{stat.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-[#e2e8f0] shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-[#1e293b]">Getting started</CardTitle>
            <CardDescription>Option A — MAXR-native bot (NestJS + Next.js)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-[#64748b]">
            <div className="flex items-start gap-3 rounded-lg border border-[#e2e8f0] p-3 bg-[#f8fafc]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3276ea] text-white text-xs font-bold">
                1
              </span>
              <div>
                <p className="font-medium text-[#1e293b]">Webchat widget</p>
                <p>Blue Botpress-style widget on the landing page, wired to widget APIs.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-[#e2e8f0] p-3 bg-[#f8fafc]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3276ea] text-white text-xs font-bold">
                2
              </span>
              <div>
                <p className="font-medium text-[#1e293b]">Knowledge + RAG</p>
                <p>Upload articles via Knowledge page; chat uses Qdrant context automatically.</p>
              </div>
            </div>
            <div className="flex items-start gap-3 rounded-lg border border-[#e2e8f0] p-3 bg-[#f8fafc]">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#3276ea] text-white text-xs font-bold">
                3
              </span>
              <div>
                <p className="font-medium text-[#1e293b]">Human handoff</p>
                <p>Visitors can request an agent; status moves to escalated in the database.</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-[#e2e8f0] shadow-sm bg-white">
          <CardHeader>
            <CardTitle className="text-[#1e293b] flex items-center gap-2">
              Live preview
              <ArrowUpRight className="h-4 w-4 text-[#3276ea]" />
            </CardTitle>
            <CardDescription>Open your site to test the widget</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-[#64748b] leading-relaxed">
              Run backend on port <strong>3001</strong> and frontend on <strong>3000</strong>.
              Set <code className="text-xs bg-[#f1f5f9] px-1 rounded">NEXT_PUBLIC_API_URL</code> in{' '}
              <code className="text-xs bg-[#f1f5f9] px-1 rounded">frontend/.env.local</code>.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
