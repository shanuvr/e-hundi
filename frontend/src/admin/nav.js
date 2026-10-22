import {
  BarChart3,
  CirclePlay,
  Landmark,
  LayoutDashboard,
  MessageSquareQuote,
  Palette,
  Settings,
  Wallet,
} from 'lucide-react';

/**
 * Grouped so a a comment added to an existing comment temple operator sees the two things they care about
 * (customise + payments) grouped away from reporting and system chores.
 */
export const ADMIN_NAV = [
  {
    group: 'Overview',
    items: [{ to: '/admin', end: true, label: 'Dashboard', icon: LayoutDashboard }],
  },
  {
    group: 'Customise',
    items: [
      { to: '/admin/temple', label: 'Temple Profile', icon: Landmark },
      { to: '/admin/slogans', label: 'Slogans & Darshan', icon: MessageSquareQuote },
      { to: '/admin/branding', label: 'Branding & Motion', icon: Palette },
    ],
  },
  {
    group: 'Payments',
    items: [
      { to: '/admin/payments', label: 'Payments / UPI', icon: Wallet },
    ],
  },
];

export const findNavItem = (pathname) => {
  const clean = pathname.replace(/\/$/, '') || '/admin';
  return ADMIN_NAV.flatMap((g) => g.items).find((i) => i.to === clean);
};
