import {CogIcon, CollectionIcon, HomeIcon, PhotographIcon, UserGroupIcon, ViewGridIcon} from '@heroicons/react/outline';
import {CreditCardIcon, OfficeBuildingIcon, UserIcon, UsersIcon} from '@heroicons/react/solid';

export const SIDEBAR_NAVIGATION = [
  {name: 'Home', href: '/', icon: HomeIcon},
  {name: 'Properties', href: '/properties', icon: ViewGridIcon},
  {name: 'Settings', href: '/settings/account', icon: CogIcon},
];

export const SETTINGS_TABS = [
  {name: 'My Account', link: 'account', icon: UserIcon},
  {name: 'Company', link: 'company', icon: OfficeBuildingIcon},
  {name: 'Team Members', link: 'team', icon: UsersIcon},
  {name: 'Billing', link: '#', icon: CreditCardIcon},
];
