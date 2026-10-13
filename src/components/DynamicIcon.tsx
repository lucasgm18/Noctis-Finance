import React from 'react';
import * as Icons from 'lucide-react';

interface DynamicIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const AVAILABLE_ICON_NAMES = [
  'Home', 'Zap', 'Droplets', 'Wifi', 'Cloud', 'HeartPulse',
  'CreditCard', 'Banknote', 'Layers', 'CalendarClock', 'Handshake',
  'ShoppingCart', 'Car', 'PawPrint', 'Wrench', 'Sparkles',
  'UtensilsCrossed', 'ShoppingBag', 'Gamepad2', 'BookOpen',
  'Wallet', 'ShieldCheck', 'Target', 'TrendingUp', 'Briefcase',
  'Laptop', 'LineChart', 'Coins', 'Coffee', 'Tv', 'Flame', 'Fuel', 'Tag'
];

export const DynamicIcon: React.FC<DynamicIconProps> = ({ name, className = 'w-5 h-5', size }) => {
  // @ts-expect-error Lucide icons indexed dynamically
  const IconComponent = Icons[name] || Icons.Tag;
  return <IconComponent className={className} size={size} />;
};

export default DynamicIcon;
