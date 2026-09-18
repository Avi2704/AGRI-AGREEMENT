import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useI18n } from '../contexts/I18nContext';
import { LanguageSelector } from './LanguageSelector';
import { Button } from './ui/Button';

export function Header() {
  const { t } = useI18n();
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 border-b bg-white/95 px-4 py-3 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2">
        <Link to="/" className="text-lg font-extrabold text-green-800">
          {t('app.name')}
        </Link>
        <div className="flex items-center gap-2">
          <LanguageSelector />
          {user && (
            <Button className="bg-slate-800 px-3 py-2 text-sm" onClick={logout}>
              {t('action.logout')}
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
