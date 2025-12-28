import { Shield, Eye, Lock, FileSearch, Users, AlertTriangle } from "lucide-react";

export const StorytellingSection = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="relative max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-display uppercase tracking-[0.3em] text-sm">The Unseen Truth</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
            Why Families <span className="text-primary text-glow">Suffer</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>

        {/* Story Content */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          {/* Left - Emotional Story */}
          <div className="space-y-6">
            <div className="border-l-2 border-primary pl-6 space-y-4">
              <p className="text-xl text-foreground leading-relaxed">
                Every year, thousands of marriages crumble within months. 
                <span className="text-primary font-semibold"> Hidden addictions</span>, 
                <span className="text-primary font-semibold"> secret affairs</span>, 
                <span className="text-primary font-semibold"> mounting debts</span>, and 
                <span className="text-primary font-semibold"> criminal histories</span> — 
                all buried until it's too late.
              </p>
              <p className="text-muted-foreground text-lg leading-relaxed">
                Parents trust photographs, relatives' words, and social appearances. But in today's 
                digital age, deception wears a perfect mask. A charming smile can hide a 
                dangerous past.
              </p>
            </div>

            <blockquote className="bg-card/50 border border-primary/20 rounded-lg p-6 italic text-muted-foreground">
              <p className="text-lg">
                "We trusted them completely. If only we had verified before the wedding, 
                our daughter would still be alive today."
              </p>
              <footer className="mt-3 text-sm text-primary">— A grieving parent's testimony</footer>
            </blockquote>
          </div>

          {/* Right - Warning Icons */}
          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: AlertTriangle, label: "Hidden Criminal Records", color: "text-destructive" },
              { icon: Eye, label: "Secret Relationships", color: "text-primary" },
              { icon: Lock, label: "Financial Fraud", color: "text-primary" },
              { icon: FileSearch, label: "Fake Identities", color: "text-destructive" },
              { icon: Users, label: "Family Disputes", color: "text-primary" },
              { icon: Shield, label: "Behavioral Issues", color: "text-primary" },
            ].map((item, index) => (
              <div
                key={index}
                className="group bg-card/50 border border-border hover:border-primary/50 rounded-lg p-6 text-center transition-all duration-300 hover:shadow-[0_0_20px_hsl(210_100%_50%/0.1)]"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <item.icon className={`h-8 w-8 mx-auto mb-3 ${item.color} group-hover:scale-110 transition-transform`} />
                <p className="text-sm font-medium text-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action Statement */}
        <div className="text-center bg-gradient-to-r from-transparent via-card to-transparent py-12 px-8 rounded-lg border border-primary/10">
          <p className="font-display text-2xl md:text-3xl uppercase tracking-wide">
            Before marrying your child into a new home,
          </p>
          <p className="font-display text-3xl md:text-4xl uppercase tracking-wide text-primary text-glow mt-2">
            Verify Everything.
          </p>
        </div>
      </div>
    </section>
  );
};
