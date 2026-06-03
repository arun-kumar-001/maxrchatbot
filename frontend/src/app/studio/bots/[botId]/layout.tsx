import BotEditorNav from '@/components/workspace/BotEditorNav';

export default function BotLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-full min-h-0 bg-[#f4f6f8]">
      <BotEditorNav />
      <div className="flex-1 min-h-0">{children}</div>
    </div>
  );
}
