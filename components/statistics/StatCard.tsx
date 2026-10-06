interface StatCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  accent?: boolean;
}

export default function StatCard({ label, value, subtitle, accent }: StatCardProps) {
  return (
    <div className={`p-6 rounded-xl border ${accent ? 'border-l-4 border-l-[var(--color-accent)] bg-[var(--color-soft-yellow)]' : 'border-[var(--color-border)] bg-white'}`}>
      <div className="text-sm font-medium text-[var(--color-muted)] uppercase tracking-wide mb-2">
        {label}
      </div>
      <div className="text-4xl font-bold text-[var(--color-heading)] mb-1">
        {value}
      </div>
      {subtitle && (
        <div className="text-sm text-[var(--color-muted)]">{subtitle}</div>
      )}
    </div>
  );
}
