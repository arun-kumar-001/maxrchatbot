'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Pencil, Copy, Upload, AlertTriangle } from 'lucide-react';
import VerifyEmailBanner from '@/components/workspace/VerifyEmailBanner';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const tabs = ['Details', 'Members', 'Audits'] as const;

export default function SettingsPage() {
  const [tab, setTab] = useState<(typeof tabs)[number]>('Details');
  const workspaceId = 'ws_' + 'maxr-default-7f3a2b1c';

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <VerifyEmailBanner />
      </div>

      <h1 className="text-2xl font-bold text-slate-900 mb-6">Settings</h1>

      <div className="flex gap-1 rounded-lg border border-slate-200 bg-slate-100/80 p-1 w-fit mb-6">
        {tabs.map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
              tab === t ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Details' && (
        <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-slate-100 px-6 py-4">
            <h2 className="font-semibold text-slate-900">Workspace Details</h2>
          </div>
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Display Name</p>
                <p className="text-slate-900 font-medium">Default Workspace</p>
              </div>
              <button type="button" className="p-2 rounded-lg hover:bg-slate-100 text-slate-500">
                <Pencil className="h-4 w-4" />
              </button>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Handle</p>
              <Link href="#" className="text-sm font-medium text-teal-600 hover:underline">
                Set workspace handle
              </Link>
              <p className="text-xs text-slate-500 mt-1">
                Your handle appears in public URLs: maxr.app/@your-handle
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500 mb-1">Workspace Owner</p>
              <p className="text-sm text-slate-800">admin@maxr.io</p>
            </div>

            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium text-slate-500 mb-1">Workspace ID</p>
                <p className="text-sm font-mono text-slate-700">{workspaceId}</p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(workspaceId);
                  toast.success('Copied');
                }}
                className="p-2 rounded-lg hover:bg-slate-100 text-slate-500"
              >
                <Copy className="h-4 w-4" />
              </button>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 items-start">
              <div className="h-24 w-24 rounded-xl bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 shrink-0" />
              <div>
                <p className="text-xs font-medium text-slate-500 mb-2">Profile picture</p>
                <Button variant="outline" size="sm" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload image
                </Button>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-slate-100">
              <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                Leave workspace
              </Button>
            </div>
          </div>
        </div>
      )}

      {tab === 'Members' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Invite teammates from your identity provider (coming soon).
        </div>
      )}

      {tab === 'Audits' && (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Audit log events will appear here.
        </div>
      )}

      {tab === 'Details' && (
        <div className="mt-8 rounded-2xl border border-red-200 bg-red-50/50 p-6">
          <h3 className="text-sm font-semibold text-red-800">Delete workspace</h3>
          <p className="text-sm text-red-700/90 mt-2 leading-relaxed">
            Deleting this workspace is irreversible. All bots, workflows, and conversation data will be
            permanently removed.
          </p>
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
            <AlertTriangle className="h-4 w-4 shrink-0" />
            Action required — confirm in account settings before delete is enabled.
          </div>
        </div>
      )}
    </div>
  );
}
