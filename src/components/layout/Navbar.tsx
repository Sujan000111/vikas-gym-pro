import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Dumbbell } from 'lucide-react';
import { cn } from '@/lib/utils';
import { VGButton } from '@/components/ui/VGButton';
import { useAuth } from '@/context/AuthContext';

const NAV: { to: string; label: string }[] = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/ai-coach', label: 'AI Coach' },
  { to: '/feedback', label: 'Feedback' },
];

export function Navbar() {
  const [open, setOpen] = useState<boolean>(false);
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const goToAuth = (): void => {
    setOpen(false);
    if (location.pathname === '/') {
      const el = document.getElementById('auth');
      el?.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#auth');
    }
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[hsl(var(--bg-primary))]/85 backdrop-blur-md border-b border-[hsl(var(--border-color))] no-print">
      <div className="container-vg flex items-center justify-between h-16">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-sm bg-[hsl(var(--red))] flex items-center justify-center">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="font-display text-2xl tracking-wider">
            VIKAS<span className="text-[hsl(var(--red))]">GYM</span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => (
            <NavLink
              key={n.to}
              to={n.to}
              end={n.to === '/'}
              className={({ isActive }) =>
                cn(
                  'px-3 py-2 text-sm uppercase tracking-wider font-medium transition-colors',
                  isActive
                    ? 'text-[hsl(var(--red))]'
                    : 'text-[hsl(var(--text-body))] hover:text-[hsl(var(--text-primary))]',
                )
              }
            >
              {n.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {isAdmin ? (
            <VGButton size="sm" variant="outline" onClick={() => navigate('/dashboard')}>
              Dashboard
            </VGButton>
          ) : (
            <>
              <VGButton size="sm" variant="ghost" onClick={goToAuth}>Login</VGButton>
              <VGButton size="sm" variant="primary" onClick={goToAuth}>Register</VGButton>
            </>
          )}
        </div>

        <button
          className="md:hidden text-[hsl(var(--text-primary))]"
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden border-t border-[hsl(var(--border-color))] bg-[hsl(var(--bg-surface))]">
          <div className="container-vg py-4 flex flex-col gap-2">
            {NAV.map((n) => (
              <NavLink
                key={n.to}
                to={n.to}
                end={n.to === '/'}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-3 py-2 text-sm uppercase tracking-wider',
                    isActive ? 'text-[hsl(var(--red))]' : 'text-[hsl(var(--text-body))]',
                  )
                }
              >
                {n.label}
              </NavLink>
            ))}
            <div className="flex gap-2 pt-2">
              {isAdmin ? (
                <VGButton size="sm" variant="outline" onClick={() => { setOpen(false); navigate('/dashboard'); }}>Dashboard</VGButton>
              ) : (
                <>
                  <VGButton size="sm" variant="ghost" onClick={goToAuth}>Login</VGButton>
                  <VGButton size="sm" variant="primary" onClick={goToAuth}>Register</VGButton>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
