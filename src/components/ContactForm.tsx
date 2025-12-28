import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, Shield } from "lucide-react";

const verificationTypes = [
  "Boy Verification",
  "Girl Verification",
  "Family Background",
  "Criminal Record Search",
  "Social Media Profiling",
];

const relationships = ["Self", "Parent", "Guardian", "Relative", "Friend"];

export const ContactForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    verificationType: "",
    relationship: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.fullName || !formData.phone || !formData.verificationType || !formData.relationship || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    const token = localStorage.getItem('vverify_token');
    if (!token) {
      toast({ title: 'Login required', description: 'Please log in before submitting a verification request.', variant: 'destructive' });
      window.location.href = '/login';
      return;
    }
    // submit to backend
    fetch((import.meta.env.VITE_API_BASE || 'http://localhost:4000') + '/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(formData),
    })
      .then(async (r) => {
        if (r.status === 401) {
          toast({ title: 'Please log in', description: 'Your session expired. Log in again.', variant: 'destructive' });
          localStorage.removeItem('vverify_token');
          window.location.href = '/login';
          return Promise.reject(new Error('Unauthorized'));
        }
        return r.json();
      })
      .then((data) => {
        toast({ title: 'Request Submitted', description: data.message || 'Saved' });
        setFormData({ fullName: '', phone: '', email: '', verificationType: '', relationship: '' });
      })
      .catch((err) => {
        console.error(err);
        toast({ title: 'Error', description: 'Failed to submit. Try again later.', variant: 'destructive' });
      });
  };

  return (
    <section className="relative py-24 px-4" id="contact">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background" />
      
      <div className="relative max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <p className="text-primary font-display uppercase tracking-[0.3em] text-sm">Start Verification</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
            Request <span className="text-primary text-glow">Verification</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            Submit your inquiry. 100% confidential. Our team will contact you within 24 hours.
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>

        {/* Form Card */}
        <div className="bg-card/80 border border-primary/20 rounded-lg p-8 md:p-12 shadow-[0_0_50px_hsl(210_100%_50%/0.1)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground uppercase tracking-wider">
                Full Name *
              </label>
              <Input
                variant="neon"
                inputSize="lg"
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
              />
            </div>

            {/* Verification Type */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground uppercase tracking-wider">
                Verification Type *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {verificationTypes.map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, verificationType: type })}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      formData.verificationType === type
                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_hsl(210_100%_50%/0.3)]"
                        : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Relationship */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground uppercase tracking-wider">
                Your Relationship *
              </label>
              <div className="flex flex-wrap gap-3">
                {relationships.map((rel) => (
                  <button
                    key={rel}
                    type="button"
                    onClick={() => setFormData({ ...formData, relationship: rel })}
                    className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                      formData.relationship === rel
                        ? "bg-primary/20 border-primary text-primary shadow-[0_0_15px_hsl(210_100%_50%/0.3)]"
                        : "bg-secondary/50 border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"
                    }`}
                  >
                    {rel}
                  </button>
                ))}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground uppercase tracking-wider">
                Phone Number *
              </label>
              <Input
                variant="neon"
                inputSize="lg"
                type="tel"
                placeholder="+91 XXXXX XXXXX"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground uppercase tracking-wider">
                Email *
              </label>
              <Input
                variant="neon"
                inputSize="lg"
                type="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            {/* Confidential Notice */}
            <div className="flex items-center gap-3 bg-secondary/30 rounded-lg p-4 border border-border">
              <Shield className="h-5 w-5 text-primary flex-shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your information is encrypted and 100% confidential. We never share your data.
              </p>
            </div>

            {/* Submit Button */}
            <Button type="submit" variant="hero" size="xl" className="w-full">
              <Send className="h-5 w-5" />
              Request Verification
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
