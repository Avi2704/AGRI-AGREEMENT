import { Navigate, Route, Routes } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { RequireAuth } from './components/RequireAuth';
import { AdminPage } from './pages/AdminPage';
import { AgreementDetailPage } from './pages/AgreementDetailPage';
import { AgreementsPage } from './pages/AgreementsPage';
import { ConsentPage } from './pages/ConsentPage';
import { DashboardPage } from './pages/DashboardPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { DemoPage } from './pages/DemoPage';
import { DisputePage } from './pages/DisputePage';
import { EvidencePage } from './pages/EvidencePage';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { NewAgreementPage } from './pages/NewAgreementPage';
import { OnboardingPage } from './pages/OnboardingPage';
import { ProfilePage } from './pages/ProfilePage';
import { VerifyPage } from './pages/VerifyPage';

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/verify/:agreementId" element={<VerifyPage />} />
        <Route path="/demo" element={<DemoPage />} />

        <Route path="/dashboard" element={<RequireAuth><DashboardPage /></RequireAuth>} />
        <Route path="/agreements" element={<RequireAuth><AgreementsPage /></RequireAuth>} />
        <Route path="/agreements/new" element={<RequireAuth><NewAgreementPage /></RequireAuth>} />
        <Route path="/agreements/:id" element={<RequireAuth><AgreementDetailPage /></RequireAuth>} />
        <Route path="/agreements/:id/consent" element={<RequireAuth><ConsentPage /></RequireAuth>} />
        <Route path="/agreements/:id/delivery" element={<RequireAuth><DeliveryPage /></RequireAuth>} />
        <Route path="/agreements/:id/dispute" element={<RequireAuth><DisputePage /></RequireAuth>} />
        <Route path="/evidence/:id" element={<RequireAuth><EvidencePage /></RequireAuth>} />
        <Route path="/profile" element={<RequireAuth><ProfilePage /></RequireAuth>} />
        <Route path="/admin" element={<RequireAuth><AdminPage /></RequireAuth>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}
