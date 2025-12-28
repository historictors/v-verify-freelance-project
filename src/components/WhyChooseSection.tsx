import { Shield, Lock, Eye, FileCheck, Users } from "lucide-react";

const features = [
  {
    icon: Lock,
    title: "100% Confidential",
    description: "Your inquiry remains completely private. No one will know you contacted us.",
  },
  {
    icon: Eye,
    title: "Private Investigation Standard",
    description: "We follow professional detective protocols for accurate, reliable information.",
  },
  {
    icon: Shield,
    title: "Zero Data Sharing",
    description: "Your data is never sold or shared. Complete privacy guaranteed.",
  },
  {
    icon: FileCheck,
    title: "Verified Official Sources",
    description: "All information verified from official records and trusted sources.",
  },
  {
    icon: Users,
    title: "Professional Field Team",
    description: "Experienced investigators conduct thorough on-ground verification.",
  },
];

export const WhyChooseSection = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/10 to-background" />
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[400px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-display uppercase tracking-[0.3em] text-sm">Trust & Integrity</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
            Why Choose <span className="text-primary text-glow">V Verify</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative text-center p-8 rounded-lg border border-border bg-card/50 hover:border-primary/50 transition-all duration-500 hover:shadow-[0_0_30px_hsl(210_100%_50%/0.1)]"
            >
              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="relative">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center mb-6 group-hover:shadow-[0_0_30px_hsl(210_100%_50%/0.3)] transition-all">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-display text-xl font-bold uppercase mb-3 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 bg-card/80 border border-border rounded-lg p-8">
          {[
            { value: "10,000+", label: "Cases Verified" },
            { value: "98%", label: "Accuracy Rate" },
            { value: "100%", label: "Confidential" },
            { value: "24/7", label: "Support" },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <p className="font-display text-3xl md:text-4xl font-bold text-primary text-glow">
                {stat.value}
              </p>
              <p className="text-muted-foreground text-sm uppercase tracking-wider mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
