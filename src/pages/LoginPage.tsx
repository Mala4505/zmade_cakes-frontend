import { useState } from 'react';
import { Cake, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
interface LoginPageProps {
  onLogin: () => void;
}
export function LoginPage({ onLogin }: LoginPageProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate API call
    setTimeout(() => {
      if (password === 'ZESH1043') {
        showToast('Login successful! Welcome back.', 'success');
        onLogin();
      } else {
        const errorMsg = 'Incorrect password. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
        setLoading(false);
      }
    }, 800);
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-zm-mintCream/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zm-deepTeal text-white mb-4 shadow-lg shadow-zm-deepTeal/20">
            <Cake size={32} />
          </div>
          <h1 className="font-heading text-4xl text-zm-stoneBrown mb-2">
            ZMade Cakes
          </h1>
          <p className="text-zm-greyOlive">Admin Dashboard Login</p>
        </div>

        <Card className="shadow-xl border-zm-greyOlive/10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={error}
                className="text-center text-lg tracking-widest"
                autoFocus />

            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              isLoading={loading}>

              Login to Dashboard <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-xs text-zm-greyOlive/40">
          © 2023 ZMade Cakes Kuwait • Secure System
        </p>
      </div>
    </div>);

}