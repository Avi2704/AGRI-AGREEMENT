import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { ensureDemoData } from '../services/demoService';

export function DemoPage() {
  const navigate = useNavigate();
  return (
    <Card className="space-y-3">
      <h1 className="text-2xl font-bold">DEMO DATA</h1>
      <p>Ramesh Patil · Soybean · 50 quintals · ₹5,200/quintal · Shree Agro Traders</p>
      <Button onClick={() => {
        ensureDemoData();
        localStorage.setItem('agri.currentUserId', 'demo-farmer-1');
        navigate('/dashboard');
      }}>Load Demo</Button>
      <Button className="bg-slate-700" onClick={() => navigate('/verify/AG-2026-000123')}>Open Demo Verification</Button>
    </Card>
  );
}
