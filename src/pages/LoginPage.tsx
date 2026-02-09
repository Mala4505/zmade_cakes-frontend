// import { useState } from 'react';
// import { Cake, ArrowRight } from 'lucide-react';
// import { Input } from '../components/ui/Input';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { useToast } from '../components/ui/Toast';
// import { loginAdmin } from '../api/endpoints';

// interface LoginPageProps {
//   onLogin: () => void;
// }

// export function LoginPage({ onLogin }: LoginPageProps) {
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [loading, setLoading] = useState(false);
//   const { showToast } = useToast();

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     setError('');

//     try {
//       const response = await loginAdmin(password);

//       if (response?.success) {
//         localStorage.setItem('adminPassword', password);
//         showToast('Login successful! Welcome back.', 'success');
//         onLogin();
//       } else {
//         const errorMsg = response?.detail || 'Incorrect password. Please try again.';
//         setError(errorMsg);
//         showToast(errorMsg, 'error');
//       }
//     } catch (err: any) {
//       const errorMsg = 'Login failed. Please check your connection or password.';
//       setError(errorMsg);
//       showToast(errorMsg, 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex items-center justify-center bg-zm-mintCream/30 p-4">
//       <div className="w-full max-w-md">
//         <div className="text-center mb-8">
//           <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-zm-deepTeal text-white mb-4 shadow-lg shadow-zm-deepTeal/20">
//             <Cake size={32} />
//           </div>
//           <h1 className="font-heading text-4xl text-zm-stoneBrown mb-2">
//             ZMade Cakes
//           </h1>
//           <p className="text-zm-greyOlive">Admin Dashboard Login</p>
//         </div>

//         <Card className="shadow-xl border-zm-greyOlive/10">
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div className="space-y-2">
//               <Input
//                 type="password"
//                 placeholder="Enter admin password"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 error={error}
//                 className="text-center text-lg tracking-widest"
//                 autoFocus
//               />
//             </div>

//             <Button
//               type="submit"
//               className="w-full h-12 text-lg"
//               isLoading={loading}
//             >
//               Login to Dashboard <ArrowRight size={18} className="ml-2" />
//             </Button>
//           </form>
//         </Card>

//         <p className="text-center mt-8 text-xs text-zm-greyOlive/40">
//           © 2026 ZMade Cakes Kuwait • Secure System
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { Cake, ArrowRight } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useToast } from '../components/ui/Toast';
import { loginAdmin } from '../api/endpoints';
import { useNavigate } from 'react-router-dom';

export function LoginPage() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await loginAdmin(password);

      if (response?.success) {
        // Persist token or password in localStorage
        localStorage.setItem('authToken', response.token || password);

        showToast('Login successful! Welcome back.', 'success');
        navigate('/orders'); // redirect to orders page
      } else {
        const errorMsg = response?.detail || 'Incorrect password. Please try again.';
        setError(errorMsg);
        showToast(errorMsg, 'error');
      }
    } catch {
      const errorMsg = 'Login failed. Please check your connection or password.';
      setError(errorMsg);
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
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
                autoFocus
              />
            </div>

            <Button
              type="submit"
              className="w-full h-12 text-lg"
              isLoading={loading}
            >
              Login to Dashboard <ArrowRight size={18} className="ml-2" />
            </Button>
          </form>
        </Card>

        <p className="text-center mt-8 text-xs text-zm-greyOlive/40">
          © 2026 ZMade Cakes Kuwait • Secure System
        </p>
      </div>
    </div>
  );
}
