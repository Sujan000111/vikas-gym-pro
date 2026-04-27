import type { Member } from '@/types';

const initialsOf = (n: string): string =>
  n.split(' ').map((p) => p[0]).slice(0, 2).join('').toUpperCase();

const today = new Date();
const addDays = (d: Date, n: number): string => {
  const c = new Date(d);
  c.setDate(c.getDate() + n);
  return c.toISOString().slice(0, 10);
};

const raw: Omit<Member, 'avatarInitials'>[] = [
  { id: 'm-1', name: 'Aarav Sharma', email: 'aarav@example.com', phone: '+91 98450 11201', dob: '1998-04-12', membershipTier: 'Pro', joinDate: '2024-08-10', expiryDate: addDays(today, 22), status: 'Active', assignedTrainer: 'Rohan Mehta', notes: 'Focus: hypertrophy' },
  { id: 'm-2', name: 'Priya Iyer', email: 'priya.i@example.com', phone: '+91 98450 11202', dob: '1995-11-03', membershipTier: 'Elite', joinDate: '2023-06-22', expiryDate: addDays(today, 4), status: 'Expiring', assignedTrainer: 'Anjali Rao', notes: 'Marathon prep' },
  { id: 'm-3', name: 'Karan Reddy', email: 'karan.r@example.com', phone: '+91 98450 11203', dob: '2000-02-19', membershipTier: 'Basic', joinDate: '2025-01-12', expiryDate: addDays(today, 65), status: 'Active', assignedTrainer: 'Vikas AP', notes: '' },
  { id: 'm-4', name: 'Sneha Pillai', email: 'sneha.p@example.com', phone: '+91 98450 11204', dob: '1992-07-30', membershipTier: 'Pro', joinDate: '2024-03-15', expiryDate: addDays(today, -10), status: 'Inactive', assignedTrainer: 'Rohan Mehta', notes: 'On hold' },
  { id: 'm-5', name: 'Arjun Nair', email: 'arjun.n@example.com', phone: '+91 98450 11205', dob: '1997-09-08', membershipTier: 'Elite', joinDate: '2022-11-01', expiryDate: addDays(today, 90), status: 'Active', assignedTrainer: 'Anjali Rao', notes: 'Powerlifting meet Jun' },
  { id: 'm-6', name: 'Ishita Banerjee', email: 'ishita.b@example.com', phone: '+91 98450 11206', dob: '1999-12-21', membershipTier: 'Basic', joinDate: '2025-02-28', expiryDate: addDays(today, 6), status: 'Expiring', assignedTrainer: 'Vikas AP', notes: '' },
  { id: 'm-7', name: 'Rahul Verma', email: 'rahul.v@example.com', phone: '+91 98450 11207', dob: '1994-05-17', membershipTier: 'Pro', joinDate: '2024-10-04', expiryDate: addDays(today, 45), status: 'Active', assignedTrainer: 'Rohan Mehta', notes: '' },
  { id: 'm-8', name: 'Meera Joshi', email: 'meera.j@example.com', phone: '+91 98450 11208', dob: '1996-01-25', membershipTier: 'Elite', joinDate: '2023-09-19', expiryDate: addDays(today, 120), status: 'Active', assignedTrainer: 'Sanjay Kumar', notes: 'Yoga + lifting' },
  { id: 'm-9', name: 'Vikram Singh', email: 'vikram.s@example.com', phone: '+91 98450 11209', dob: '1990-03-14', membershipTier: 'Pro', joinDate: '2024-06-30', expiryDate: addDays(today, 2), status: 'Expiring', assignedTrainer: 'Vikas AP', notes: 'Send renewal reminder' },
  { id: 'm-10', name: 'Tanvi Desai', email: 'tanvi.d@example.com', phone: '+91 98450 11210', dob: '2001-08-08', membershipTier: 'Basic', joinDate: '2025-03-11', expiryDate: addDays(today, 35), status: 'Active', assignedTrainer: 'Anjali Rao', notes: '' },
  { id: 'm-11', name: 'Aditya Kapoor', email: 'aditya.k@example.com', phone: '+91 98450 11211', dob: '1993-10-02', membershipTier: 'Elite', joinDate: '2022-04-18', expiryDate: addDays(today, 200), status: 'Active', assignedTrainer: 'Rohan Mehta', notes: 'Long-term member' },
  { id: 'm-12', name: 'Nisha Menon', email: 'nisha.m@example.com', phone: '+91 98450 11212', dob: '1998-06-29', membershipTier: 'Pro', joinDate: '2024-12-01', expiryDate: addDays(today, 18), status: 'Active', assignedTrainer: 'Sanjay Kumar', notes: '' },
  { id: 'm-13', name: 'Rohan Bhat', email: 'rohan.b@example.com', phone: '+91 98450 11213', dob: '1995-04-04', membershipTier: 'Basic', joinDate: '2025-01-22', expiryDate: addDays(today, -30), status: 'Inactive', assignedTrainer: 'Vikas AP', notes: '' },
  { id: 'm-14', name: 'Kavya Rao', email: 'kavya.r@example.com', phone: '+91 98450 11214', dob: '2000-11-11', membershipTier: 'Pro', joinDate: '2024-09-05', expiryDate: addDays(today, 55), status: 'Active', assignedTrainer: 'Anjali Rao', notes: '' },
  { id: 'm-15', name: 'Suresh Babu', email: 'suresh.b@example.com', phone: '+91 98450 11215', dob: '1988-02-26', membershipTier: 'Elite', joinDate: '2023-01-10', expiryDate: addDays(today, 5), status: 'Expiring', assignedTrainer: 'Rohan Mehta', notes: 'VIP' },
  { id: 'm-16', name: 'Pooja Hegde', email: 'pooja.h@example.com', phone: '+91 98450 11216', dob: '1997-07-19', membershipTier: 'Basic', joinDate: '2025-02-05', expiryDate: addDays(today, 12), status: 'Active', assignedTrainer: 'Sanjay Kumar', notes: '' },
  { id: 'm-17', name: 'Manish Gupta', email: 'manish.g@example.com', phone: '+91 98450 11217', dob: '1991-09-23', membershipTier: 'Pro', joinDate: '2024-05-14', expiryDate: addDays(today, 70), status: 'Active', assignedTrainer: 'Vikas AP', notes: '' },
  { id: 'm-18', name: 'Divya Krishnan', email: 'divya.k@example.com', phone: '+91 98450 11218', dob: '1999-03-07', membershipTier: 'Elite', joinDate: '2023-11-28', expiryDate: addDays(today, 150), status: 'Active', assignedTrainer: 'Anjali Rao', notes: 'Athletic perf' },
  { id: 'm-19', name: 'Akash Pandey', email: 'akash.p@example.com', phone: '+91 98450 11219', dob: '1996-12-15', membershipTier: 'Basic', joinDate: '2025-03-25', expiryDate: addDays(today, 28), status: 'Active', assignedTrainer: 'Rohan Mehta', notes: '' },
  { id: 'm-20', name: 'Lakshmi Nambiar', email: 'lakshmi.n@example.com', phone: '+91 98450 11220', dob: '1994-08-04', membershipTier: 'Pro', joinDate: '2024-07-09', expiryDate: addDays(today, 1), status: 'Expiring', assignedTrainer: 'Vikas AP', notes: 'Renew urgent' },
];

export const MOCK_MEMBERS: Member[] = raw.map((m) => ({ ...m, avatarInitials: initialsOf(m.name) }));
