import WorkspaceSidebar from '@/components/workspace/WorkspaceSidebar';
import WorkspaceTopBar from '@/components/workspace/WorkspaceTopBar';

export default function StudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#f4f6f8]">
      <WorkspaceSidebar />
      <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
        <WorkspaceTopBar />
        <div className="flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
