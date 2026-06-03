import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  children?: ReactNode;
}

export default function EmptyState({ icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-white px-8 py-16 text-center max-w-lg mx-auto">
      <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-400">
        {icon}
      </div>
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-500 max-w-sm">{description}</p>
      {children && <div className="mt-8 w-full">{children}</div>}
    </div>
  );
}
