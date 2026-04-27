import type { ReactNode } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  label: string;
  value: ReactNode;
  change?: string;
  changeType?: 'up' | 'down';
  colorAccent?: string;
  icon?: ReactNode;
}

export function MetricCard({ label, value, change, changeType, colorAccent, icon }: Props) {
  return (
    <div
      className="card-vg p-5 relative overflow-hidden"
      style={colorAccent ? { backgroundColor: colorAccent } : undefined}
    >
      <div className="flex items-start justify-between mb-2">
        <span className="text-xs uppercase tracking-widest text-[hsl(var(--text-muted))]">{label}</span>
        {icon && <span className="text-[hsl(var(--text-muted))]">{icon}</span>}
      </div>
      <div className="font-display text-4xl text-[hsl(var(--text-primary))] leading-none">{value}</div>
      {change && (
        <div className={cn('mt-2 inline-flex items-center gap-1 text-xs font-medium',
          changeType === 'up' ? 'text-green-400' : 'text-red-400')}>
          {changeType === 'up' ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
          {change}
        </div>
      )}
    </div>
  );
}
