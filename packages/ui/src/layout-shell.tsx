import { ReactNode } from "react";

type LayoutShellProps = {
  title: string;
  children: ReactNode;
};

export const LayoutShell = ({ title, children }: LayoutShellProps) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <aside className="fixed left-0 top-0 h-screen w-64 border-r border-slate-800 bg-slate-900 p-6">
        <p className="text-sm uppercase tracking-wide text-slate-400">API Sentinel</p>
        <h2 className="mt-2 text-xl font-semibold">Dashboard</h2>
      </aside>
      <div className="ml-64">
        <header className="border-b border-slate-800 bg-slate-900 px-8 py-4">
          <h1 className="text-lg font-medium">{title}</h1>
        </header>
        <main className="p-8">{children}</main>
      </div>
    </div>
  );
};
