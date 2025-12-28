import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

type Submission = {
  _id: string;
  fullName: string;
  phone: string;
  verificationType: string;
  relationship: string;
  email?: string;
  status: string;
  createdAt: string;
};

const Profile = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('vverify_token') : null;

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [userRes, submissionsRes] = await Promise.all([
          fetch(`${apiBase}/api/auth/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${apiBase}/api/submissions/me`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        const userData = await userRes.json();
        const subsData = await submissionsRes.json();

        if (userRes.status === 401 || submissionsRes.status === 401) {
          localStorage.removeItem('vverify_token');
          navigate('/login');
          return;
        }

        if (!userRes.ok) throw new Error(userData.message || 'Failed to load profile');
        if (!submissionsRes.ok) throw new Error(subsData.message || 'Failed to load submissions');

        setEmail(userData.user?.email || '');
        setName(userData.user?.name || '');
        setPhone(userData.user?.phone || '');
        setSubmissions(subsData.submissions || []);
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, navigate, toast]);

  const saveProfile = async () => {
    if (!token) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/api/auth/me`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update profile');
      toast({ title: 'Profile updated' });
    } catch (err) {
      console.error(err);
      toast({ title: 'Error', description: (err as Error).message, variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="p-6 mt-20">
        <div className="max-w-4xl mx-auto space-y-8">
        <div className="bg-card border border-border rounded-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Profile</h2>
            <span className="text-sm text-muted-foreground">Email is read-only</span>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Email</label>
              <Input value={email} disabled />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
            </div>
            <div className="space-y-1">
              <label className="text-sm text-muted-foreground">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone number" />
            </div>
          </div>
          <Button onClick={saveProfile} disabled={saving} className="w-full md:w-auto">
            {saving ? 'Saving...' : 'Save profile'}
          </Button>
        </div>

        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Your verification requests</h2>
            <span className="text-sm text-muted-foreground">Latest first</span>
          </div>

          {submissions.length === 0 ? (
            <p className="text-muted-foreground">No submissions yet.</p>
          ) : (
            <div className="space-y-3">
              {submissions.map((s) => (
                <div key={s._id} className="border border-border rounded-lg p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                  <div>
                    <p className="font-semibold">{s.fullName}</p>
                    <p className="text-sm text-muted-foreground">{s.verificationType} • {s.relationship}</p>
                    <p className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium capitalize">Status: {s.status || 'pending'}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;