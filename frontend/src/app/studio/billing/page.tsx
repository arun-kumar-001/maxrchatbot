import { CreditCard } from 'lucide-react';
import VerifyEmailBanner from '@/components/workspace/VerifyEmailBanner';
import EmptyState from '@/components/workspace/EmptyState';

export default function BillingPage() {
  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="mb-6">
        <VerifyEmailBanner />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 mb-8">Billing</h1>
      <EmptyState
        icon={<CreditCard className="h-8 w-8" />}
        title="Free plan active"
        description="You're on the Free workspace plan. Upgrade later for more bots, channels, and team members."
      />
    </div>
  );
}
