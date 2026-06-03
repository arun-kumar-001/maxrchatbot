'use client';

import Link from 'next/link';

export default function VerifyEmailBanner() {
  return (
    <div className="rounded-xl border border-sky-200 bg-gradient-to-r from-sky-50 to-white px-4 py-3 text-sm text-slate-800">
      <span>Your email address is not verified. Verification will be enforced soon. </span>
      <Link href="/studio/settings" className="font-semibold text-sky-700 hover:underline">
        Verify now
      </Link>
    </div>
  );
}
