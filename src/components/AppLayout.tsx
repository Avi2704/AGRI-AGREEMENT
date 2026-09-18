import { Outlet } from 'react-router-dom';
import { BottomNavigation } from './BottomNavigation';
import { Header } from './Header';

export function AppLayout() {
  return (
    <div className="min-h-screen bg-stone-50 pb-20 md:pb-0">
      <Header />
      <main className="mx-auto w-full max-w-5xl p-4">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  );
}
