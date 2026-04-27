import { Check, X } from 'lucide-react';
import { MEMBERSHIP_PLANS } from '@/data/services';
import type { MembershipPlan } from '@/types';
import { VGButton } from '@/components/ui/VGButton';
import { cn } from '@/lib/utils';

const scrollToAuth = (): void => {
  document.getElementById('auth')?.scrollIntoView({ behavior: 'smooth' });
};

function PricingCard({ p }: { p: MembershipPlan }) {
  return (
    <div className={cn(
      'card-vg p-8 relative flex flex-col',
      p.isPopular && 'border-2 border-[hsl(var(--red))]',
    )}>
      {p.isPopular && (
        <div className="absolute -top-3 left-8 badge-vg bg-[hsl(var(--red))] text-white">Most Popular</div>
      )}
      <div className="font-display text-4xl mb-2">{p.tier}</div>
      <div className="flex items-baseline gap-1 mb-6">
        <span className="font-display text-5xl text-[hsl(var(--text-primary))]">{p.price}</span>
        <span className="text-[hsl(var(--text-muted))] text-sm">/month</span>
      </div>
      <ul className="space-y-3 flex-1 mb-8">
        {p.features.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-[hsl(var(--text-body))]">
            <Check className="w-4 h-4 text-green-500 mt-0.5 shrink-0" /> {f}
          </li>
        ))}
        {p.unavailableFeatures.map((f) => (
          <li key={f} className="flex gap-2 text-sm text-[hsl(var(--text-muted))] line-through">
            <X className="w-4 h-4 text-red-500 mt-0.5 shrink-0" /> {f}
          </li>
        ))}
      </ul>
      <VGButton variant={p.isPopular ? 'primary' : 'outline'} onClick={scrollToAuth} className="w-full">
        Choose {p.tier}
      </VGButton>
    </div>
  );
}

export function PricingSection() {
  return (
    <section id="pricing" className="py-24 container-vg">
      <div className="text-center mb-12">
        <div className="overline mb-3">Membership Plans</div>
        <h2 className="font-display text-5xl md:text-6xl">PICK YOUR <span className="text-[hsl(var(--red))]">TIER</span></h2>
        <p className="text-[hsl(var(--text-body))] mt-3">No contracts. No hidden fees. Cancel anytime.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {MEMBERSHIP_PLANS.map((p) => <PricingCard key={p.tier} p={p} />)}
      </div>
    </section>
  );
}
