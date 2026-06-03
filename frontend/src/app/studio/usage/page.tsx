import Link from 'next/link';
import { ExternalLink, Gauge } from 'lucide-react';
import VerifyEmailBanner from '@/components/workspace/VerifyEmailBanner';
import EmptyState from '@/components/workspace/EmptyState';
import { Button } from '@/components/ui/button';

export default function UsagePage() {
  return (
    <div className="p-6 lg:p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mb-6">
        <VerifyEmailBanner />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8 w-full max-w-3xl">Usage</h1>
      <EmptyState
        icon={<Gauge className="h-8 w-8" />}
        title="Manage usage in Analytics"
        description="Conversation volume, AI spend, and message metrics are available in your workspace analytics and bot conversations."
      >
        <Link href="/studio/bots/main/conversations">
          <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
            View conversations
            <ExternalLink className="h-4 w-4" />
          </Button>
        </Link>
      </EmptyState>
    </div>
  );
}
