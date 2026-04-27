import { Link } from 'react-router-dom';
import { Dumbbell, Instagram, Linkedin, MapPin, Phone, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[hsl(var(--border-color))] bg-[hsl(var(--bg-surface))] mt-16 no-print">
      <div className="container-vg py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <Link to="/" className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-sm bg-[hsl(var(--red))] flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-white" />
            </div>
            <span className="font-display text-xl tracking-wider">
              VIKAS<span className="text-[hsl(var(--red))]">GYM</span>
            </span>
          </Link>
          <p className="text-sm text-[hsl(var(--text-muted))]">
            Science-backed strength training in Bengaluru. Founded by Vikas AP, final-year engineering student and head coach.
          </p>
        </div>

        <div>
          <h4 className="overline mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            {[
              ['/about', 'About'],
              ['/services', 'Services'],
              ['/ai-coach', 'AI Coach'],
              ['/feedback', 'Feedback'],
            ].map(([to, label]) => (
              <li key={to}>
                <Link to={to} className="text-[hsl(var(--text-body))] hover:text-[hsl(var(--red))] transition">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="overline mb-4">Visit</h4>
          <ul className="space-y-3 text-sm text-[hsl(var(--text-body))]">
            <li className="flex gap-2"><MapPin className="w-4 h-4 text-[hsl(var(--red))] mt-0.5 shrink-0" /> Near NHCE, Marathahalli, Bengaluru 560103</li>
            <li className="flex gap-2"><Phone className="w-4 h-4 text-[hsl(var(--red))] mt-0.5 shrink-0" /> +91 98765 43210</li>
            <li className="flex gap-2"><Mail className="w-4 h-4 text-[hsl(var(--red))] mt-0.5 shrink-0" /> hello@vikasgym.com</li>
          </ul>
        </div>

        <div>
          <h4 className="overline mb-4">Follow</h4>
          <div className="flex gap-3">
            {[Instagram, Linkedin].map((Icon, i) => (
              <a key={i} href="#" aria-label="Social link" className="w-9 h-9 border border-[hsl(var(--border-color))] rounded-sm flex items-center justify-center text-[hsl(var(--text-body))] hover:border-[hsl(var(--red))] hover:text-[hsl(var(--red))] transition">
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
          <div className="mt-6 text-xs text-[hsl(var(--text-muted))]">
            Open Mon–Sat · 5:30 AM – 10:30 PM
          </div>
        </div>
      </div>
      <div className="border-t border-[hsl(var(--border-color))] py-4">
        <div className="container-vg text-xs text-[hsl(var(--text-muted))] flex flex-col md:flex-row justify-between gap-2">
          <span>© {new Date().getFullYear()} VikasGym. All rights reserved.</span>
          <span>Built in Bengaluru. Trained for life.</span>
        </div>
      </div>
    </footer>
  );
}
