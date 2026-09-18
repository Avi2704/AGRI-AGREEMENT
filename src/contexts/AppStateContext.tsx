import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { evidenceService } from '../services/evidenceService';

interface AppStateContextValue {
  revision: number;
  refresh: () => void;
}

const AppStateContext = createContext<AppStateContextValue | null>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    const sync = () => evidenceService.retryOfflineUploads().finally(() => setRevision((value) => value + 1));
    window.addEventListener('online', sync);
    return () => window.removeEventListener('online', sync);
  }, []);

  const value = useMemo(
    () => ({
      revision,
      refresh: () => setRevision((value) => value + 1),
    }),
    [revision],
  );

  return <AppStateContext.Provider value={value}>{children}</AppStateContext.Provider>;
}

export function useAppState() {
  const context = useContext(AppStateContext);
  if (!context) throw new Error('useAppState must be used within AppStateProvider');
  return context;
}
