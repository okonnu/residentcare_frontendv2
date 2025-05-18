import { NavItem } from './nav-item/nav-item';

export const navItems: NavItem[] = [
  {
    navCap: 'Main',
  },
  {
    displayName: 'Dashboard',
    iconName: 'home',
    bgcolor: 'primary',
    route: '/pages/dashboard',
  },
  {
    displayName: 'Starter',
    iconName: 'home',
    bgcolor: 'primary',
    route: '/pages/starter',
  },
  {
    navCap: 'Residents',
  },
  {
    displayName: 'Face Sheet',
    iconName: 'user',
    bgcolor: 'primary',
    route: '/pages/face-sheet',
  },
  {
    displayName: 'Vitals',
    iconName: 'activity',
    bgcolor: 'primary',
    route: '/pages/vitals',
  },
  {
    displayName: 'Orders',
    iconName: 'file-text',
    bgcolor: 'primary',
    route: '/pages/orders',
  },
  {
    displayName: 'ADLs',
    iconName: 'file-text',
    bgcolor: 'primary',
    route: '/pages/adls',
  },
  {
    navCap: 'Care & Medications',
  },
  {
    displayName: 'Charting',
    iconName: 'clipboard',
    bgcolor: 'primary',
    route: '/pages/charting',
  },
  {
    displayName: 'Medications',
    iconName: 'pill',
    bgcolor: 'primary',
    route: '/pages/medications',
  },
  {
    displayName: 'Pharmacy',
    iconName: 'shopping-cart',
    bgcolor: 'primary',
    route: '/pages/pharmacy',
  },
  {
    navCap: 'Operations',
  },
  {
    displayName: 'Shift Management',
    iconName: 'users',
    bgcolor: 'primary',
    route: '/pages/shift-management',
  },
  {
    displayName: 'Inventory',
    iconName: 'box',
    bgcolor: 'primary',
    route: '/pages/inventory',
  },
  {
    displayName: 'Billing',
    iconName: 'file-text',
    bgcolor: 'primary',
    route: '/pages/billing',
  },
  {
    navCap: 'Administration',
  },
  {
    displayName: 'Analytics & Reports',
    iconName: 'file-text',
    bgcolor: 'primary',
    route: '/pages/analytics',
  },
  {
    displayName: 'User Management',
    iconName: 'settings',
    bgcolor: 'primary',
    route: '/pages/admin',
  }
];
