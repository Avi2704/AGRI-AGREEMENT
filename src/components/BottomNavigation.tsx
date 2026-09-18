import { Home, FileText, ShieldCheck, User } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { useI18n } from '../contexts/I18nContext';

const links = [
  { to: '/dashboard', key: 'nav.home', icon: Home },
  { to: '/agreements', key: 'nav.agreements', icon: FileText },
  { to: '/verify/AG-2026-000123', key: 'nav.evidence', icon: ShieldCheck },
  { to: '/profile', key: 'nav.profile', icon: User },
];

export function BottomNavigation() {
  const { t } = useI18n();
  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t bg-white md:hidden">
      <div className="grid grid-cols-4">
        {links.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex min-h-12 flex-col items-center justify-center gap-1 text-xs ${isActive ? 'text-green-700' : 'text-slate-500'}`
            }
          >
            <item.icon size={18} />
            <span>{t(item.key)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
