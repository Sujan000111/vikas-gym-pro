import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, BarChart3, CreditCard, Settings, LogOut,
  Search, Plus, Pencil, Trash2, X, ChevronDown, ChevronLeft, ChevronRight, Bell,
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend,
} from 'recharts';
import { MetricCard } from '@/components/ui/MetricCard';
import { VGButton } from '@/components/ui/VGButton';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import type { DashboardSection, Member, MemberStatus, MembershipTier } from '@/types';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

const NAV: { id: DashboardSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'members', label: 'Members', icon: Users },
  { id: 'reports', label: 'Reports', icon: BarChart3 },
  { id: 'payments', label: 'Payments', icon: CreditCard },
  { id: 'settings', label: 'Settings', icon: Settings },
];

const STATUS_CLS: Record<MemberStatus, string> = {
  Active: 'bg-green-500/15 text-green-400 border-green-500/30',
  Expiring: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
  Inactive: 'bg-red-500/15 text-red-400 border-red-500/30',
};

const TIER_CLS: Record<MembershipTier, string> = {
  Basic: 'bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-body))]',
  Pro: 'bg-[hsl(var(--red)/0.15)] text-[hsl(var(--red))] border border-[hsl(var(--red)/0.3)]',
  Elite: 'bg-[hsl(var(--text-primary)/0.1)] text-[hsl(var(--text-primary))] border border-[hsl(var(--text-primary)/0.2)]',
};

function Heatmap() {
  // 5 weeks x 7 days mock
  const cells: { date: string; count: number }[] = Array.from({ length: 35 }, (_, i) => ({
    date: `Day ${i + 1}`,
    count: Math.floor(Math.random() * 80),
  }));
  const max = 80;
  return (
    <div className="card-vg p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-display text-2xl">ATTENDANCE</h3>
        <span className="text-xs text-[hsl(var(--text-muted))]">Last 5 weeks</span>
      </div>
      <div className="grid grid-cols-7 gap-1.5">
        {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, i) => (
          <div key={i} className="text-[10px] uppercase tracking-widest text-[hsl(var(--text-muted))] text-center">{d}</div>
        ))}
        {cells.map((c, i) => {
          const intensity = c.count / max;
          return (
            <div
              key={i}
              title={`${c.date} — ${c.count} check-ins`}
              className="aspect-square rounded-sm border border-[hsl(var(--border-color))] cursor-pointer transition hover:scale-110"
              style={{ backgroundColor: `hsl(0 72% 51% / ${intensity * 0.85 + 0.05})` }}
            />
          );
        })}
      </div>
    </div>
  );
}

function MembersTable({ members, onEdit, onDelete }: {
  members: Member[];
  onEdit: (m: Member) => void;
  onDelete: (id: string) => void;
}) {
  const [q, setQ] = useState<string>('');
  const [tier, setTier] = useState<MembershipTier | 'All'>('All');
  const [status, setStatus] = useState<MemberStatus | 'All'>('All');
  const [page, setPage] = useState<number>(1);
  const PER = 8;

  const filtered = useMemo(() => {
    return members.filter((m) => {
      if (tier !== 'All' && m.membershipTier !== tier) return false;
      if (status !== 'All' && m.status !== status) return false;
      if (q && !`${m.name} ${m.email}`.toLowerCase().includes(q.toLowerCase())) return false;
      return true;
    });
  }, [members, q, tier, status]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PER));
  const safePage = Math.min(page, totalPages);
  const slice = filtered.slice((safePage - 1) * PER, safePage * PER);

  const handleSearch = (v: string): void => { setQ(v); setPage(1); };
  const handleTier = (v: string): void => { setTier(v as MembershipTier | 'All'); setPage(1); };
  const handleStatus = (v: string): void => { setStatus(v as MemberStatus | 'All'); setPage(1); };

  const sel = 'h-10 bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 text-sm focus:outline-none focus:border-[hsl(var(--red))]';

  return (
    <div className="card-vg p-6">
      <div className="flex flex-wrap gap-3 mb-4 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--text-muted))]" />
          <input
            value={q}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search name or email..."
            className="w-full h-10 bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm pl-9 pr-3 text-sm focus:outline-none focus:border-[hsl(var(--red))]"
          />
        </div>
        <select value={tier} onChange={(e) => handleTier(e.target.value)} className={sel}>
          <option>All</option><option>Basic</option><option>Pro</option><option>Elite</option>
        </select>
        <select value={status} onChange={(e) => handleStatus(e.target.value)} className={sel}>
          <option>All</option><option>Active</option><option>Expiring</option><option>Inactive</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[800px]">
          <thead>
            <tr className="text-left text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] border-b border-[hsl(var(--border-color))]">
              <th className="py-3 pl-2">#</th><th>Member</th><th>Phone</th><th>Tier</th><th>Expiry</th><th>Status</th><th className="text-right pr-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {slice.map((m, i) => (
              <tr key={m.id} className="border-b border-[hsl(var(--border-color))]/50 hover:bg-[hsl(var(--bg-elevated))]/30 transition">
                <td className="py-3 pl-2 text-[hsl(var(--text-muted))]">{(safePage - 1) * PER + i + 1}</td>
                <td>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[hsl(var(--red)/0.15)] border border-[hsl(var(--red))] flex items-center justify-center text-xs font-semibold text-[hsl(var(--red))]">{m.avatarInitials}</div>
                    <div>
                      <div className="font-medium">{m.name}</div>
                      <div className="text-xs text-[hsl(var(--text-muted))]">{m.email}</div>
                    </div>
                  </div>
                </td>
                <td className="text-[hsl(var(--text-body))]">{m.phone}</td>
                <td><span className={cn('badge-vg', TIER_CLS[m.membershipTier])}>{m.membershipTier}</span></td>
                <td className="text-[hsl(var(--text-body))]">{m.expiryDate}</td>
                <td><span className={cn('badge-vg border', STATUS_CLS[m.status])}>{m.status}</span></td>
                <td className="text-right pr-2">
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onEdit(m)} title="Edit" className="w-8 h-8 flex items-center justify-center text-[hsl(var(--text-body))] hover:text-[hsl(var(--red))] transition rounded-sm hover:bg-[hsl(var(--bg-elevated))]"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => onDelete(m.id)} title="Delete" className="w-8 h-8 flex items-center justify-center text-[hsl(var(--text-body))] hover:text-red-400 transition rounded-sm hover:bg-[hsl(var(--bg-elevated))]"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
            {slice.length === 0 && (
              <tr><td colSpan={7} className="py-12 text-center text-[hsl(var(--text-muted))]">No members match these filters.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4 text-xs text-[hsl(var(--text-muted))]">
        <span>Showing {slice.length === 0 ? 0 : (safePage - 1) * PER + 1}–{(safePage - 1) * PER + slice.length} of {filtered.length}</span>
        <div className="flex items-center gap-2">
          <button disabled={safePage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} className="w-8 h-8 flex items-center justify-center border border-[hsl(var(--border-color))] rounded-sm disabled:opacity-30 hover:border-[hsl(var(--red))]"><ChevronLeft className="w-4 h-4" /></button>
          <span>Page {safePage} / {totalPages}</span>
          <button disabled={safePage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className="w-8 h-8 flex items-center justify-center border border-[hsl(var(--border-color))] rounded-sm disabled:opacity-30 hover:border-[hsl(var(--red))]"><ChevronRight className="w-4 h-4" /></button>
        </div>
      </div>
    </div>
  );
}

interface DrawerForm extends Omit<Member, 'id' | 'avatarInitials'> {}

interface MemberRow {
  id: string;
  name: string;
  email: string;
  phone: string;
  dob: string | null;
  membership_tier: MembershipTier;
  join_date: string;
  expiry_date: string | null;
  status: MemberStatus;
  assigned_trainer: string | null;
  notes: string | null;
}

interface AppUserRow {
  full_name: string;
  email: string;
  phone: string | null;
  dob: string | null;
  created_at: string;
}

const initialsOf = (name: string): string =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'NA';

const toMember = (row: MemberRow): Member => ({
  id: row.id,
  name: row.name,
  email: row.email,
  phone: row.phone,
  dob: row.dob ?? '',
  membershipTier: row.membership_tier,
  joinDate: row.join_date,
  expiryDate: row.expiry_date ?? '',
  status: row.status,
  assignedTrainer: row.assigned_trainer ?? '',
  notes: row.notes ?? '',
  avatarInitials: initialsOf(row.name),
});

function MemberDrawer({ open, onClose, onSave, editMember }: {
  open: boolean;
  onClose: () => void;
  onSave: (m: DrawerForm, editingId?: string) => void;
  editMember: Member | null;
}) {
  const initial: DrawerForm = editMember
    ? { name: editMember.name, email: editMember.email, phone: editMember.phone, dob: editMember.dob, membershipTier: editMember.membershipTier, joinDate: editMember.joinDate, expiryDate: editMember.expiryDate, status: editMember.status, assignedTrainer: editMember.assignedTrainer, notes: editMember.notes }
    : { name: '', email: '', phone: '', dob: '', membershipTier: 'Pro', joinDate: new Date().toISOString().slice(0, 10), expiryDate: '', status: 'Active', assignedTrainer: 'Vikas AP', notes: '' };
  const [f, setF] = useState<DrawerForm>(initial);

  if (!open) return null;
  const inp = 'w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-10 text-sm focus:outline-none focus:border-[hsl(var(--red))]';

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-40" onClick={onClose} />
      <div className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] bg-[hsl(var(--bg-surface))] border-l border-[hsl(var(--border-color))] z-50 overflow-y-auto animate-toast-in">
        <div className="p-6 border-b border-[hsl(var(--border-color))] flex items-center justify-between">
          <h3 className="font-display text-2xl">{editMember ? 'EDIT MEMBER' : 'ADD MEMBER'}</h3>
          <button onClick={onClose} className="text-[hsl(var(--text-muted))] hover:text-[hsl(var(--text-primary))]"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Name</label>
            <input value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} className={inp} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Email</label>
            <input type="email" value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} className={inp} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Phone</label>
            <input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} className={inp} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Join Date</label>
              <input type="date" value={f.joinDate} onChange={(e) => setF({ ...f, joinDate: e.target.value })} className={inp} />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Expiry</label>
              <input type="date" value={f.expiryDate} onChange={(e) => setF({ ...f, expiryDate: e.target.value })} className={inp} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Tier</label>
              <select value={f.membershipTier} onChange={(e) => setF({ ...f, membershipTier: e.target.value as MembershipTier })} className={inp}>
                <option>Basic</option><option>Pro</option><option>Elite</option>
              </select>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Status</label>
              <select value={f.status} onChange={(e) => setF({ ...f, status: e.target.value as MemberStatus })} className={inp}>
                <option>Active</option><option>Expiring</option><option>Inactive</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Trainer</label>
            <input value={f.assignedTrainer} onChange={(e) => setF({ ...f, assignedTrainer: e.target.value })} className={inp} />
          </div>
          <div>
            <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">Notes</label>
            <textarea value={f.notes} onChange={(e) => setF({ ...f, notes: e.target.value })} rows={3} className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm p-3 text-sm focus:outline-none focus:border-[hsl(var(--red))] resize-none" />
          </div>
          <div className="flex gap-2 pt-2">
            <VGButton variant="ghost" onClick={onClose} className="flex-1">Cancel</VGButton>
            <VGButton onClick={() => onSave(f, editMember?.id)} className="flex-1">{editMember ? 'Save' : 'Add'}</VGButton>
          </div>
        </div>
      </div>
    </>
  );
}

function ExpiryAlerts({ members, onRemind }: { members: Member[]; onRemind: (n: string) => void }) {
  const [open, setOpen] = useState<boolean>(true);
  const upcoming = members.filter((m) => {
    const days = Math.round((new Date(m.expiryDate).getTime() - Date.now()) / 86400000);
    return days >= 0 && days <= 7;
  });
  return (
    <div className="card-vg p-6">
      <button onClick={() => setOpen((v) => !v)} className="w-full flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Bell className="w-5 h-5 text-amber-400" />
          <h3 className="font-display text-2xl">EXPIRY ALERTS <span className="text-amber-400">({upcoming.length})</span></h3>
        </div>
        <ChevronDown className={cn('w-5 h-5 transition', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="space-y-2">
          {upcoming.length === 0 && <p className="text-sm text-[hsl(var(--text-muted))]">No upcoming expiries this week.</p>}
          {upcoming.map((m) => {
            const days = Math.round((new Date(m.expiryDate).getTime() - Date.now()) / 86400000);
            return (
              <div key={m.id} className="flex items-center justify-between p-3 bg-[hsl(var(--bg-elevated))] rounded-sm">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[hsl(var(--red)/0.15)] border border-[hsl(var(--red))] flex items-center justify-center text-xs font-semibold text-[hsl(var(--red))]">{m.avatarInitials}</div>
                  <div>
                    <div className="text-sm font-medium">{m.name}</div>
                    <div className="text-xs text-amber-400">{days === 0 ? 'Expires today' : `${days} day${days === 1 ? '' : 's'} left`}</div>
                  </div>
                </div>
                <VGButton size="sm" variant="outline" onClick={() => onRemind(m.name)}>Remind</VGButton>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [section, setSection] = useState<DashboardSection>('overview');
  const [members, setMembers] = useState<Member[]>([]);
  const [membersLoading, setMembersLoading] = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [editMember, setEditMember] = useState<Member | null>(null);
  const { logout, userEmail } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const chartData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      const month = d.toLocaleString('en-US', { month: 'short' });
      return { month, value: 0 };
    });
    const map = new Map(months.map((m) => [m.month, m]));
    members.forEach((m) => {
      const d = new Date(m.joinDate);
      if (Number.isNaN(d.getTime())) return;
      const key = d.toLocaleString('en-US', { month: 'short' });
      const row = map.get(key);
      if (row) row.value += 1;
    });
    return months;
  }, [members]);

  const tierData = useMemo(() => {
    const total = members.length || 1;
    const basic = members.filter((m) => m.membershipTier === 'Basic').length;
    const pro = members.filter((m) => m.membershipTier === 'Pro').length;
    const elite = members.filter((m) => m.membershipTier === 'Elite').length;
    return [
      { name: 'Basic', value: Math.round((basic / total) * 100), color: '#6b7280' },
      { name: 'Pro', value: Math.round((pro / total) * 100), color: '#dc2626' },
      { name: 'Elite', value: Math.round((elite / total) * 100), color: '#f9fafb' },
    ];
  }, [members]);

  useEffect(() => {
    const loadMembers = async (): Promise<void> => {
      setMembersLoading(true);
      // Auto-sync: ensure registered app users also exist in members table.
      const { data: appUsers, error: appUsersError } = await supabase
        .from('app_users')
        .select('full_name,email,phone,dob,created_at')
        .neq('email', 'vikasap2005@gmail.com');
      if (appUsersError) {
        addToast('Could not read app users for member sync.', 'error');
      }

      const { data: existingMembers, error: existingMembersError } = await supabase
        .from('members')
        .select('email');
      if (existingMembersError) {
        addToast('Could not read existing members before sync.', 'error');
      }

      if (appUsers && existingMembers) {
        const existingEmails = new Set((existingMembers as { email: string }[]).map((m) => m.email.toLowerCase()));
        const toInsert = (appUsers as AppUserRow[])
          .filter((u) => !existingEmails.has(u.email.toLowerCase()))
          .map((u) => {
            const joinDate = String(u.created_at ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10);
            const expiry = new Date(joinDate);
            expiry.setMonth(expiry.getMonth() + 1);
            return {
              name: u.full_name,
              email: u.email,
              phone: u.phone ?? '',
              dob: u.dob,
              membership_tier: 'Pro',
              join_date: joinDate,
              expiry_date: expiry.toISOString().slice(0, 10),
              status: 'Active',
              assigned_trainer: 'Vikas AP',
              notes: 'Auto-added from registered users',
            };
          });

        if (toInsert.length > 0) {
          const { error: syncError } = await supabase
            .from('members')
            .upsert(toInsert, { onConflict: 'email' });
          if (syncError) {
            addToast('Member sync blocked by database policy. Showing app users directly.', 'warning');
          }
        }
      }

      const { data, error } = await supabase
        .from('members')
        .select('id,name,email,phone,dob,membership_tier,join_date,expiry_date,status,assigned_trainer,notes')
        .order('created_at', { ascending: false });

      if (error) {
        addToast('Could not load members from database.', 'error');
      } else {
        const dbMembers = (data as MemberRow[]).map(toMember);
        const byEmail = new Set(dbMembers.map((m) => m.email.toLowerCase()));
        const fallbackFromUsers = ((appUsers ?? []) as AppUserRow[])
          .filter((u) => !byEmail.has(u.email.toLowerCase()))
          .map((u) => {
            const joinDate = String(u.created_at ?? '').slice(0, 10) || new Date().toISOString().slice(0, 10);
            const expiry = new Date(joinDate);
            expiry.setMonth(expiry.getMonth() + 1);
            return {
              id: `app-${u.email.toLowerCase()}`,
              name: u.full_name,
              email: u.email,
              phone: u.phone ?? '',
              dob: u.dob ?? '',
              membershipTier: 'Pro' as MembershipTier,
              joinDate,
              expiryDate: expiry.toISOString().slice(0, 10),
              status: 'Active' as MemberStatus,
              assignedTrainer: 'Vikas AP',
              notes: 'From app_users (not yet persisted in members)',
              avatarInitials: initialsOf(u.full_name),
            };
          });
        setMembers([...dbMembers, ...fallbackFromUsers]);
      }
      setMembersLoading(false);
    };

    loadMembers();
  }, [addToast]);

  const handleLogout = (): void => {
    logout()
      .then(() => {
        addToast('Logged out.', 'info');
        navigate('/');
      })
      .catch(() => {
        addToast('Could not log out.', 'error');
      });
  };

  const handleSave = async (data: DrawerForm, editingId?: string): Promise<void> => {
    const payload = {
      name: data.name,
      email: data.email,
      phone: data.phone,
      dob: data.dob || null,
      membership_tier: data.membershipTier,
      join_date: data.joinDate,
      expiry_date: data.expiryDate || null,
      status: data.status,
      assigned_trainer: data.assignedTrainer || null,
      notes: data.notes || null,
    };

    if (editingId) {
      const { data: updated, error } = await supabase
        .from('members')
        .update(payload)
        .eq('id', editingId)
        .select('id,name,email,phone,dob,membership_tier,join_date,expiry_date,status,assigned_trainer,notes')
        .single();
      if (error) {
        addToast(error.message, 'error');
        return;
      }
      setMembers((ms) => ms.map((m) => (m.id === editingId ? toMember(updated as MemberRow) : m)));
      addToast('Member updated.', 'success');
    } else {
      const { data: created, error } = await supabase
        .from('members')
        .insert(payload)
        .select('id,name,email,phone,dob,membership_tier,join_date,expiry_date,status,assigned_trainer,notes')
        .single();
      if (error) {
        addToast(error.message, 'error');
        return;
      }
      setMembers((ms) => [toMember(created as MemberRow), ...ms]);
      addToast('Member added.', 'success');
    }
    setDrawerOpen(false);
    setEditMember(null);
  };

  const handleDelete = async (id: string): Promise<void> => {
    const { error } = await supabase.from('members').delete().eq('id', id);
    if (error) {
      addToast(error.message, 'error');
      return;
    }
    setMembers((ms) => ms.filter((m) => m.id !== id));
    addToast('Member removed.', 'success');
  };

  const handleEdit = (m: Member): void => { setEditMember(m); setDrawerOpen(true); };
  const handleAdd = (): void => { setEditMember(null); setDrawerOpen(true); };

  return (
    <div className="min-h-screen flex bg-[hsl(var(--bg-primary))] pt-16">
      {/* Sidebar */}
      <aside className="hidden lg:flex w-[240px] shrink-0 flex-col border-r border-[hsl(var(--border-color))] bg-[hsl(var(--bg-surface))] fixed top-16 bottom-0 left-0 no-print">
        <div className="p-6 border-b border-[hsl(var(--border-color))]">
          <div className="overline">Admin Panel</div>
          <div className="text-xs text-[hsl(var(--text-muted))] mt-1 truncate">{userEmail}</div>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {NAV.map((n) => {
            const active = section === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setSection(n.id)}
                className={cn(
                  'w-full flex items-center gap-3 px-3 h-10 rounded-sm text-sm font-medium uppercase tracking-wider transition border-l-[3px]',
                  active
                    ? 'border-[hsl(var(--red))] bg-[hsl(var(--bg-elevated))] text-[hsl(var(--text-primary))]'
                    : 'border-transparent text-[hsl(var(--text-body))] hover:bg-[hsl(var(--bg-elevated))]/50',
                )}
              >
                <n.icon className="w-4 h-4" /> {n.label}
              </button>
            );
          })}
        </nav>
        <div className="p-3 border-t border-[hsl(var(--border-color))]">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 h-10 rounded-sm text-sm font-medium text-[hsl(var(--text-body))] hover:text-[hsl(var(--red))] hover:bg-[hsl(var(--bg-elevated))]/50 transition">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 lg:ml-[240px] p-6 space-y-6">
        {/* Mobile section switcher */}
        <div className="lg:hidden flex gap-2 overflow-x-auto no-scrollbar">
          {NAV.map((n) => (
            <button key={n.id} onClick={() => setSection(n.id)}
              className={cn('shrink-0 px-3 h-9 rounded-sm border text-xs uppercase tracking-wider',
                section === n.id ? 'border-[hsl(var(--red))] bg-[hsl(var(--red))] text-white' : 'border-[hsl(var(--border-color))] text-[hsl(var(--text-body))]')}>
              {n.label}
            </button>
          ))}
          <button onClick={handleLogout} className="shrink-0 px-3 h-9 rounded-sm border border-[hsl(var(--border-color))] text-xs uppercase tracking-wider text-[hsl(var(--text-body))]">Logout</button>
        </div>

        {section === 'overview' && (
          <>
            <div>
              <div className="overline">Today</div>
              <h1 className="font-display text-5xl">DASHBOARD</h1>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Total Members" value={members.length} change="+12 this month" changeType="up" colorAccent="hsl(220 70% 50% / 0.06)" />
              <MetricCard label="Active" value={members.filter((m) => m.status === 'Active').length} change="+8%" changeType="up" colorAccent="hsl(140 70% 45% / 0.06)" />
              <MetricCard label="Expiring (7d)" value={members.filter((m) => m.status === 'Expiring').length} change="Renewals due" changeType="down" colorAccent="hsl(40 90% 55% / 0.06)" />
              <MetricCard label="New Members (30d)" value={members.filter((m) => {
                const t = new Date(m.joinDate).getTime();
                return !Number.isNaN(t) && t >= Date.now() - 30 * 86400000;
              }).length} change="From DB" changeType="up" colorAccent="hsl(0 72% 51% / 0.06)" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="card-vg p-6 lg:col-span-2">
                <h3 className="font-display text-2xl mb-4">MEMBER GROWTH TREND</h3>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 4 }} />
                      <Bar dataKey="value" fill="#dc2626" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="card-vg p-6">
                <h3 className="font-display text-2xl mb-4">TIER MIX</h3>
                <div style={{ width: '100%', height: 280 }}>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={tierData} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3}>
                        {tierData.map((d) => <Cell key={d.name} fill={d.color} stroke="#080808" strokeWidth={2} />)}
                      </Pie>
                      <Legend wrapperStyle={{ fontSize: 12, color: '#d1d5db' }} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid #222', borderRadius: 4 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Heatmap />
              <ExpiryAlerts members={members} onRemind={(n) => addToast(`Reminder sent to ${n}.`, 'success')} />
            </div>
          </>
        )}

        {section === 'members' && (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="overline">Manage</div>
                <h1 className="font-display text-5xl">MEMBERS</h1>
              </div>
              <VGButton onClick={handleAdd}><Plus className="w-4 h-4" /> Add Member</VGButton>
            </div>
            {membersLoading ? (
              <div className="card-vg p-12 text-center text-[hsl(var(--text-muted))]">Loading members...</div>
            ) : (
              <MembersTable members={members} onEdit={handleEdit} onDelete={(id) => void handleDelete(id)} />
            )}
          </>
        )}

        {section === 'reports' && (
          <>
            <h1 className="font-display text-5xl">REPORTS</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-vg p-6">
                <h3 className="font-display text-2xl mb-4">MEMBER GROWTH — 6 MONTHS</h3>
                <div style={{ width: '100%', height: 320 }}>
                  <ResponsiveContainer>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="month" stroke="#6b7280" fontSize={12} />
                      <YAxis stroke="#6b7280" fontSize={12} />
                      <Tooltip contentStyle={{ background: '#111', border: '1px solid #222' }} />
                      <Bar dataKey="value" fill="#dc2626" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <Heatmap />
            </div>
          </>
        )}

        {section === 'payments' && (
          <>
            <h1 className="font-display text-5xl">PAYMENTS</h1>
            <div className="card-vg p-12 text-center">
              <CreditCard className="w-12 h-12 text-[hsl(var(--red))] mx-auto mb-4" />
              <p className="text-[hsl(var(--text-body))]">Payment provider integration coming soon.</p>
            </div>
          </>
        )}

        {section === 'settings' && (
          <>
            <h1 className="font-display text-5xl">SETTINGS</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-vg p-6">
                <h3 className="font-display text-2xl mb-4">GYM PROFILE</h3>
                <div className="space-y-3">
                  {[['Gym Name', 'VikasGym'], ['Address', 'Marathahalli, Bengaluru'], ['Phone', '+91 98765 43210'], ['Email', 'hello@vikasgym.com']].map(([l, v]) => (
                    <div key={l}>
                      <label className="block text-xs uppercase tracking-widest text-[hsl(var(--text-muted))] mb-1.5">{l}</label>
                      <input defaultValue={v} className="w-full bg-[hsl(var(--bg-elevated))] border border-[hsl(var(--border-color))] rounded-sm px-3 h-10 text-sm focus:outline-none focus:border-[hsl(var(--red))]" />
                    </div>
                  ))}
                  <VGButton onClick={() => addToast('Profile saved.', 'success')}>Save</VGButton>
                </div>
              </div>
              <div className="card-vg p-6">
                <h3 className="font-display text-2xl mb-4">NOTIFICATIONS</h3>
                <div className="space-y-4">
                  {['New registration alerts', 'Expiry reminders', 'Feedback notifications'].map((l) => (
                    <label key={l} className="flex items-center justify-between cursor-pointer">
                      <span className="text-sm text-[hsl(var(--text-body))]">{l}</span>
                      <input type="checkbox" defaultChecked className="w-5 h-5 accent-[hsl(var(--red))]" />
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <MemberDrawer
        open={drawerOpen}
        onClose={() => { setDrawerOpen(false); setEditMember(null); }}
        onSave={(m, editingId) => { void handleSave(m, editingId); }}
        editMember={editMember}
      />
    </div>
  );
}
