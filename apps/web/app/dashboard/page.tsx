import { LayoutShell } from "@repo/ui/layout-shell";

export default function DashboardPage() {
  return (
    <LayoutShell title="API Monitoring Overview">
      <section className="rounded-lg border border-dashed border-slate-700 bg-slate-900/40 p-6">
        <p className="text-sm text-slate-400">Analytics widgets coming soon.</p>
      </section>
    </LayoutShell>
  );
}
