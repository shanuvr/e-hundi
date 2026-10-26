import {
  Landmark,
  LayoutDashboard,
  MessageSquareQuote,
  Palette,
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
      { to: '/admin/branding', label: 'Branding & Motion', icon: Palette },
    ],
  },
];

export const findNavItem = (pathname) => {
  const clean = pathname.replace(/\/$/, '') || '/admin';
  return ADMIN_NAV.flatMap((g) => g.items).find((i) => i.to === clean);
};
