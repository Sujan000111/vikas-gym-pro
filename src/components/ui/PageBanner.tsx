import { ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  breadcrumb: string[];
}

export function PageBanner({ title, subtitle, breadcrumb }: Props) {
  return (
    <section className="relative pt-32 pb-16 border-b border-[hsl(var(--border-color))] bg-[hsl(var(--bg-surface))]">
      <div className="container-vg">
        <nav className="flex items-center gap-2 text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-4">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-2">
              <span className={i === breadcrumb.length - 1 ? 'text-[hsl(var(--red))]' : ''}>{crumb}</span>
              {i < breadcrumb.length - 1 && <ChevronRight className="w-3 h-3" />}
            </span>
          ))}
        </nav>
        <h1 className="font-display text-6xl md:text-7xl text-[hsl(var(--text-primary))] leading-none">{title}</h1>
        {subtitle && (
          <p className="mt-4 text-[hsl(var(--text-body))] max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
