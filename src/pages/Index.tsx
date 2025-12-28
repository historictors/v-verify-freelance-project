import { Navbar } from "@/components/Navbar";
import { HeroSlider } from "@/components/HeroSlider";
import { StorytellingSection } from "@/components/StorytellingSection";
import { ServicesSection } from "@/components/ServicesSection";
import { WhyChooseSection } from "@/components/WhyChooseSection";
import { ContactForm } from "@/components/ContactForm";
import { Footer } from "@/components/Footer";
const Index = () => {
  return (
    <main className="min-h-screen bg-background">
      {/* Navigation */}
      <Navbar />
      
      {/* Hero Section with Video Slider */}
      <HeroSlider />
      
      {/* Storytelling Section */}
      <StorytellingSection />
      
      {/* Services Section */}
      <ServicesSection />
      
      {/* Why Choose Us Section */}
      <div id="why-us">
        <WhyChooseSection />
      </div>
      
      {/* Contact Form Section */}
      <ContactForm />
      
      {/* Footer */}
      <Footer />
    </main>
  );
};

export default Index;
