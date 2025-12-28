import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submit = async () => {
    if (!email || !password) {
      toast({ title: 'Email and password are required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const endpoint = mode === 'login' ? '/api/auth/login' : '/api/auth/signup';
      const res = await fetch(`${apiBase}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        toast({ title: data.message || 'Request failed', variant: 'destructive' });
        return;
      }

      if (mode === 'login') {
        if (data.requiresVerification) {
          toast({ title: data.message || 'Please verify your email', variant: 'destructive' });
          navigate('/verify', { state: { email } });
          return;
        }

        if (data.token) {
          localStorage.setItem('vverify_token', data.token);
          toast({ title: 'Logged in', description: 'You are now signed in.' });
          navigate('/');
        } else {
          toast({ title: 'Login failed', variant: 'destructive' });
        }
      } else {
        toast({ title: 'Signup successful', description: 'Check your email for the OTP to verify your account.' });
        navigate('/verify', { state: { email } });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const sendVerificationOtp = async () => {
    if (!email) {
      toast({ title: 'Enter your email first', variant: 'destructive' });
      return;
    }

    try {
      const res = await fetch(`${apiBase}/api/auth/request-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.message || 'Unable to send OTP', variant: 'destructive' });
        return;
      }
      toast({ title: 'OTP sent', description: 'Check your inbox for the verification code.' });
      navigate('/verify', { state: { email } });
    } catch (err) {
      console.error(err);
      toast({ title: 'Unable to send OTP', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card p-6 rounded-lg space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{mode === 'login' ? 'Login' : 'Create an account'}</h2>
          <Button variant="ghost" size="sm" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Need an account?' : 'Have an account?'}
          </Button>
        </div>

        <div className="space-y-4">
          <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Input type="password" placeholder="Your password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <Button onClick={submit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </div>

        <div className="space-y-3 text-sm text-muted-foreground">
          <p>
            Need to verify your email? Use the same email below and request a new OTP.
          </p>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="w-full" onClick={sendVerificationOtp}>
              Send verification OTP
            </Button>
            <Link className="text-primary hover:underline" to="/verify">
              Enter OTP
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
