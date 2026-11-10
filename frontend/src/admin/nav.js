import {
  Landmark,
  LayoutDashboard,
  MessageSquareQuote,
} from 'lucide-react';

/**
 * Navigation configuration for admin console.
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
    ],
  },
];

export const findNavItem = (pathname) => {
  const clean = pathname.replace(/\/$/, '') || '/admin';
  return ADMIN_NAV.flatMap((g) => g.items).find((i) => i.to === clean);
};
