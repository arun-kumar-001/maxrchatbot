import Link from 'next/link';
import Webchat from '@/components/webchat/Webchat';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm sticky top-0 z-40">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600" />
            <span className="font-semibold text-slate-900">MAXR</span>
          </div>
          <Link
            href="/studio"
            className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
          >
            Open Studio
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-24 text-center">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
          Build bots like Botpress
        </h1>
        <p className="mt-4 text-lg text-slate-500 max-w-xl mx-auto">
          White workspace, visual workflows, knowledge base, and webchat — hosted on your stack.
        </p>
        <Link
          href="/studio"
          className="inline-flex mt-8 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-medium text-slate-900 shadow-sm hover:bg-slate-50"
        >
          Go to Default Workspace →
        </Link>
      </main>

      <Webchat />
    </div>
  );
}
