import Link from 'next/link';
import { Box } from 'lucide-react';
import VerifyEmailBanner from '@/components/workspace/VerifyEmailBanner';
import EmptyState from '@/components/workspace/EmptyState';

export default function IntegrationsPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <VerifyEmailBanner />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Integrations</h1>
      <EmptyState
        icon={<Box className="h-8 w-8" />}
        title="You own no integrations"
        description="Integrations connect your bot to Slack, WhatsApp, and other channels. Start from the hub or build your own."
      >
        <div className="grid sm:grid-cols-2 gap-6 text-left w-full max-w-md">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Looking for an integration</p>
            <Link href="#" className="text-sm font-semibold text-teal-600 hover:underline">
              Search the integration hub
            </Link>
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1">Build your own</p>
            <Link href="/studio/bots/main/workflows" className="text-sm font-semibold text-teal-600 hover:underline">
              Open workflow API docs
            </Link>
          </div>
        </div>
      </EmptyState>
    </div>
  );
}
