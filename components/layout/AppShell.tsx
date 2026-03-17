import BottomNav from "./BottomNav";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col h-dvh  pt-[env(safe-area-inset-top)] bg-blue-400-900 pb-16 dark:bg-slate-400">
      <main>{children}</main>
      <BottomNav />
    </div>
  );
}
