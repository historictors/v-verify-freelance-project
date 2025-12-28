import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  User, 
  Users, 
  Home, 
  Globe, 
  Scale, 
  CheckCircle,
  Search,
  Briefcase,
  Heart,
  CreditCard,
  FileText,
  UserCheck
} from "lucide-react";

const services = [
  {
    icon: User,
    title: "Boy Verification",
    description: "Comprehensive background check for prospective grooms",
    features: [
      { icon: Home, text: "Background & family check" },
      { icon: Search, text: "Address verification" },
      { icon: CreditCard, text: "Loan, debt & property check" },
      { icon: Scale, text: "Criminal & civil court records" },
      { icon: Globe, text: "Social media behavior profiling" },
      { icon: Users, text: "Neighborhood investigation" },
    ],
  },
  {
    icon: Heart,
    title: "Girl Verification",
    description: "Detailed background verification for prospective brides",
    features: [
      { icon: Home, text: "Family & lifestyle check" },
      { icon: Heart, text: "Relationship history hints" },
      { icon: Search, text: "Addiction or influence issues" },
      { icon: Globe, text: "Social circle profiling" },
      { icon: Briefcase, text: "Work ethics & activities" },
      { icon: UserCheck, text: "Character verification" },
    ],
  },
  {
    icon: Users,
    title: "Family Background Check",
    description: "Complete family reputation and stability assessment",
    features: [
      { icon: CreditCard, text: "Financial stability" },
      { icon: Briefcase, text: "Business reputation" },
      { icon: FileText, text: "Public records check" },
      { icon: Scale, text: "Past disputes" },
    ],
  },
  {
    icon: Globe,
    title: "Deep Social Media Profiling",
    description: "Advanced digital footprint analysis",
    features: [
      { icon: Search, text: "Follows, likes, patterns" },
      { icon: UserCheck, text: "Secret profiles detection" },
      { icon: Globe, text: "Online behavior analysis" },
      { icon: Heart, text: "Hidden connections" },
    ],
  },
  {
    icon: Scale,
    title: "Criminal & Court Record Search",
    description: "Official legal record verification",
    features: [
      { icon: FileText, text: "FIR & chargesheet check" },
      { icon: Scale, text: "Pending case search" },
      { icon: CreditCard, text: "Fraud case investigation" },
      { icon: Search, text: "Civil dispute records" },
    ],
  },
];

export const ServicesSection = () => {
  return (
    <section className="relative py-24 px-4" id="services">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/30 to-background" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <p className="text-primary font-display uppercase tracking-[0.3em] text-sm">Our Services</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold uppercase">
            Verification <span className="text-primary text-glow">Services</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Professional investigation services to uncover the truth before it's too late
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto" />
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <Card
              key={index}
              variant="neon"
              className="group hover:scale-[1.02] transition-all duration-500"
            >
              <CardHeader className="pb-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 border border-primary/20 group-hover:bg-primary/20 group-hover:shadow-[0_0_20px_hsl(210_100%_50%/0.3)] transition-all">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{service.description}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <feature.icon className="h-4 w-4 text-primary/70 flex-shrink-0" />
                      <span>{feature.text}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
