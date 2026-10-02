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
 * Grouped so a temple operator sees the two things they care about
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
      { to: '/admin/slogans', label: 'Slogans & Text', icon: MessageSquareQuote },
      { to: '/admin/branding', label: 'Branding & Motion', icon: Palette },
    ],
  },
  {
    group: 'Payments',
    items: [
      { to: '/admin/payments', label: 'Payments / UPI', icon: Wallet },
      { to: '/admin/darshan', label: 'Darshan', icon: CirclePlay },
    ],
  },
  {
    group: 'Insights',
    items: [{ to: '/admin/reports', label: 'Donations & Reports', icon: BarChart3 }],
  },
  {
    group: 'System',
    items: [{ to: '/admin/settings', label: 'Settings', icon: Settings }],
  },
];

export const findNavItem = (pathname) => {
  const clean = pathname.replace(/\/$/, '') || '/admin';
  return ADMIN_NAV.flatMap((g) => g.items).find((i) => i.to === clean);
};
