interface MetricCardProps {
  title: string;
  value: string | number;
  description?: string;
}

export function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <div className="rounded-lg border border-slate-700 bg-slate-900/40 p-6">
      <h3 className="text-sm font-medium text-slate-400">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
      {description && (
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      )}
    </div>
  );
}
