import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

const VerifyOtp = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    const presetEmail = (location.state as { email?: string } | undefined)?.email;
    if (presetEmail) setEmail(presetEmail);
  }, [location.state]);

  const verify = async () => {
    if (!email || !otp) {
      toast({ title: 'Email and OTP required', variant: 'destructive' });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/verify-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast({ title: data.message || 'Verification failed', variant: 'destructive' });
        return;
      }

      if (data.token) {
        localStorage.setItem('vverify_token', data.token);
        toast({ title: 'Verified', description: 'You are now logged in' });
        navigate('/');
      } else {
        toast({ title: 'Verification failed', variant: 'destructive' });
      }
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resendOtp = async () => {
    if (!email) {
      toast({ title: 'Enter your email first', variant: 'destructive' });
      return;
    }

    setIsResending(true);
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
      toast({ title: 'OTP sent', description: 'Check your inbox for the new code.' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Unable to send OTP', variant: 'destructive' });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-card p-6 rounded-lg space-y-4">
        <h2 className="text-2xl font-bold">Verify OTP</h2>
        <Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
        <Input type="text" placeholder="6-digit OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />

        <Button onClick={verify} disabled={isSubmitting} className="w-full">
          {isSubmitting ? 'Verifying...' : 'Verify & Login'}
        </Button>

        <Button variant="outline" onClick={resendOtp} disabled={isResending} className="w-full">
          {isResending ? 'Sending...' : 'Resend OTP'}
        </Button>
      </div>
    </div>
  );
};

export default VerifyOtp;
