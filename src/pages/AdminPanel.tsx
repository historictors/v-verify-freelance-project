import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Navbar } from '@/components/Navbar';

const apiBase = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
const statusOptions = ['pending', 'in-progress', 'completed', 'rejected'];

const AdminPanel = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [checking, setChecking] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  const jwtToken = typeof window !== 'undefined' ? localStorage.getItem('vverify_token') : null;

  // Check if user is admin on mount
  useEffect(() => {
    const checkAdmin = async () => {
      if (!jwtToken) {
        navigate('/login');
        return;
      }

      try {
        const res = await fetch(`${apiBase}/api/auth/check-admin`, {
          headers: { Authorization: `Bearer ${jwtToken}` }
        });
        const data = await res.json();

        if (!res.ok || !data.isAdmin) {
          toast({ title: 'Access Denied', description: 'You do not have admin permissions.', variant: 'destructive' });
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (err) {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to verify admin status.', variant: 'destructive' });
        navigate('/');
      } finally {
        setChecking(false);
      }
    };

    checkAdmin();
  }, [jwtToken, navigate, toast]);

  const fetchUsers = async () => {
    if (!jwtToken) return;
    setLoadingUsers(true);
    try {
      const res = await fetch(`${apiBase}/api/submissions/admin/users`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch users');
      setUsers(data.users || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error fetching users', variant: 'destructive' });
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchSubmissions = async (limit?: number) => {
    if (!jwtToken) return;
    setLoadingSubs(true);
    try {
      const qs = limit ? `?limit=${limit}` : '';
      const res = await fetch(`${apiBase}/api/submissions/admin/submissions${qs}`, {
        headers: { Authorization: `Bearer ${jwtToken}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch submissions');
      setSubmissions(data.submissions || []);
    } catch (err) {
      console.error(err);
      toast({ title: 'Error fetching submissions', variant: 'destructive' });
    } finally {
      setLoadingSubs(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    if (!jwtToken) return;
    try {
      const res = await fetch(`${apiBase}/api/submissions/admin/submissions/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${jwtToken}` },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update');
      toast({ title: 'Status updated' });
      setSubmissions((prev) => prev.map((s) => (s._id === id ? { ...s, status } : s)));
    } catch (err) {
      console.error(err);
      toast({ title: 'Error updating status', variant: 'destructive' });
    }
  };

  const exportToCSV = () => {
    if (submissions.length === 0) {
      toast({ title: 'No data to export', variant: 'destructive' });
      return;
    }

    const headers = ['Full Name', 'Phone', 'Email', 'Verification Type', 'Relationship', 'Status', 'Created At'];
    const rows = submissions.map((s) => [
      s.fullName,
      s.phone,
      s.email || s.user?.email || '',
      s.verificationType,
      s.relationship,
      s.status || 'pending',
      new Date(s.createdAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `submissions_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast({ title: 'CSV exported successfully' });
  };

  const importFromCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        if (lines.length < 2) {
          toast({ title: 'Invalid CSV file', variant: 'destructive' });
          return;
        }

        const headers = lines[0].split(',').map((h) => h.trim());
        const statusIndex = headers.indexOf('Status');

        let updatedCount = 0;
        let errorCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const cells = line.split(',').map((c) => c.trim().replace(/^"|"$/g, ''));
          if (statusIndex === -1 || cells.length <= statusIndex) continue;

          const email = cells[headers.indexOf('Email')] || '';
          const status = cells[statusIndex];

          const submission = submissions.find((s) => s.email === email);
          if (submission && statusOptions.includes(status)) {
            updateStatus(submission._id, status);
            updatedCount++;
          } else {
            errorCount++;
          }
        }

        toast({
          title: 'CSV import completed',
          description: `Updated: ${updatedCount}, Errors: ${errorCount}`
        });
      } catch (err) {
        console.error(err);
        toast({ title: 'Error parsing CSV', variant: 'destructive' });
      }
    };
    reader.readAsText(file);
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verifying admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Redirecting...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="p-6 mt-20">
        <div className="max-w-6xl mx-auto bg-card p-6 rounded-lg space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <h2 className="text-2xl font-bold">Admin Dashboard</h2>
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" onClick={fetchUsers} disabled={loadingUsers}>Users</Button>
            <Button variant="outline" onClick={() => fetchSubmissions(10)} disabled={loadingSubs}>Recent</Button>
            <Button variant="default" onClick={() => fetchSubmissions()} disabled={loadingSubs}>All</Button>
            <Button variant="outline" onClick={exportToCSV} disabled={submissions.length === 0}>Export CSV</Button>
            <label className="cursor-pointer">
              <Button variant="outline" asChild>
                <span>Import CSV</span>
              </Button>
              <input
                type="file"
                accept=".csv"
                onChange={importFromCSV}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold">Users ({users.length})</h3>
            {users.length === 0 ? (
              <p className="text-sm text-muted-foreground">No users loaded.</p>
            ) : (
              <div className="space-y-2 max-h-[420px] overflow-auto pr-2">
                {users.map((u: any) => (
                  <div key={u._id} className="p-3 border border-border rounded">
                    <div className="font-medium">{u.email}</div>
                    <div className="text-sm text-muted-foreground">Verified: {u.isVerified ? 'Yes' : 'No'}</div>
                    <div className="text-xs text-muted-foreground">{new Date(u.createdAt).toLocaleString()}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Submissions ({submissions.length})</h3>
              <span className="text-xs text-muted-foreground">Click Recent/All to load</span>
            </div>
            {submissions.length === 0 ? (
              <p className="text-sm text-muted-foreground">No submissions loaded.</p>
            ) : (
              <div className="space-y-3 max-h-[520px] overflow-auto pr-2">
                {submissions.map((s: any) => (
                  <div key={s._id} className="p-3 border border-border rounded space-y-2">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <div className="font-medium">{s.fullName}</div>
                        <div className="text-sm text-muted-foreground">{s.verificationType} • {s.relationship}</div>
                        <div className="text-xs text-muted-foreground">{new Date(s.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-xs text-muted-foreground text-right">
                        <div>User: {s.user?.email || 'N/A'}</div>
                        <div>Phone: {s.phone}</div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm">Status:</span>
                      {statusOptions.map((opt) => (
                        <Button
                          key={opt}
                          size="sm"
                          variant={s.status === opt ? 'default' : 'outline'}
                          onClick={() => updateStatus(s._id, opt)}
                        >
                          {opt}
                        </Button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
