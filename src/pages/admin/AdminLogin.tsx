import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../store/authStore';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { motion } from 'framer-motion';
export function AdminLogin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/admin';
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!username || !password) {
      setError('Please enter both username and password.');
      return;
    }
    try {
      await login(username, password);
      navigate(from, {
        replace: true
      });
    } catch (err: any) {
      setError(err.message || 'Failed to login');
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-zm-warm/30 p-4">
      <motion.div
        initial={{
          opacity: 0,
          y: 20
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.4
        }}
        className="w-full max-w-md">

        <div className="text-center mb-8">
          <h1 className="font-heading text-5xl text-zm-teal mb-2">ZMade</h1>
          <p className="text-muted-foreground font-medium tracking-wide uppercase text-sm">
            Admin Portal
          </p>
        </div>

        <Card className="p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error &&
            <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive text-center">
                {error}
              </div>
            }

            <Input
              label="Username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete="username" />


            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password" />


            <Button type="submit" className="w-full py-6 text-lg">
              Sign In
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Mock credentials: admin / password</p>
          </div>
        </Card>
      </motion.div>
    </div>);

}