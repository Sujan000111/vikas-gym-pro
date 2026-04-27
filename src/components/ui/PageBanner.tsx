import { ChevronRight } from 'lucide-react';

interface Props {
  title: string;
  subtitle?: string;
  breadcrumb: string[];
}

export function PageBanner({ title, subtitle, breadcrumb }: Props) {
  return (
    <section className="relative pt-32 pb-16 border-b border-[hsl(var(--border-color))] bg-[hsl(var(--bg-surface))/0.5] overflow-hidden">
      <div
        className="absolute inset-0 opacity-70 pointer-events-none"
        style={{
          background:
            'radial-gradient(circle at 8% 25%, hsl(var(--red)/0.12), transparent 28%), radial-gradient(circle at 90% 70%, hsl(var(--red)/0.08), transparent 24%)',
        }}
      />
      <div className="container-vg">
        <nav className="relative z-10 flex items-center gap-2 text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-4">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb} className="flex items-center gap-2">
              <span className={i === breadcrumb.length - 1 ? 'text-[hsl(var(--red))]' : ''}>{crumb}</span>
              {i < breadcrumb.length - 1 && <ChevronRight className="w-3 h-3" />}
            </span>
          ))}
        </nav>
        <h1 className="relative z-10 font-display text-5xl md:text-7xl text-[hsl(var(--text-primary))] leading-none">{title}</h1>
        {subtitle && (
          <p className="relative z-10 mt-4 text-[hsl(var(--text-body))] max-w-2xl">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
