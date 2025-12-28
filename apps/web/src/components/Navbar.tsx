import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Shield, Menu, X } from "lucide-react";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Services", href: "#services" },
  { label: "Why Us", href: "#why-us" },
  { label: "Contact", href: "#contact" },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => Boolean(localStorage.getItem('vverify_token')));

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const onStorage = () => setIsLoggedIn(Boolean(localStorage.getItem('vverify_token')));
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const logout = () => {
    localStorage.removeItem('vverify_token');
    setIsLoggedIn(false);
    window.location.href = '/';
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    
    if (href.startsWith("#")) {
      // Section link
      if (location.pathname === "/") {
        // Already on home, just scroll to section
        const element = document.querySelector(href);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      } else {
        // Not on home, navigate to home with hash
        navigate("/" + href);
        // Scroll after navigation completes
        setTimeout(() => {
          const element = document.querySelector(href);
          if (element) {
            element.scrollIntoView({ behavior: "smooth" });
          }
        }, 100);
      }
    } else {
      // Regular link
      navigate(href);
    }
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-background/90 backdrop-blur-md border-b border-border shadow-lg"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <a href="/" className="flex items-center gap-3 group">
            <div className="p-2 rounded-lg bg-primary/10 border border-primary/30 group-hover:shadow-[0_0_15px_hsl(210_100%_50%/0.3)] transition-all">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-xl md:text-2xl font-bold uppercase tracking-wider">
              V <span className="text-primary">Verify</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleNavClick(link.href)}
                className="text-sm font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors relative group cursor-pointer"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
              </button>
            ))}
          </div>

          {/* CTA Button */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <>
                <Button variant="outline" size="default" onClick={() => navigate('/profile')}>
                  Profile
                </Button>
                <Button variant="neon" size="default" onClick={logout}>
                  Logout
                </Button>
              </>
            ) : (
              <Button variant="neon" size="default" onClick={() => navigate('/login')}>
                Login / Signup
              </Button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-card/95 backdrop-blur-md border-t border-border animate-fade-in">
            <div className="py-6 px-4 space-y-4">
              {navLinks.map((link) => (
                <button
                  key={link.label}
                  onClick={() => handleNavClick(link.href)}
                  className="block w-full text-left text-lg font-medium uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors py-2 cursor-pointer"
                >
                  {link.label}
                </button>
              ))}
              {isLoggedIn ? (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <Button variant="outline" size="lg" onClick={() => navigate('/profile')}>
                    Profile
                  </Button>
                  <Button variant="neon" size="lg" onClick={logout}>
                    Logout
                  </Button>
                </div>
              ) : (
                <Button variant="neon" size="lg" className="w-full mt-4" onClick={() => navigate('/login')}>
                  Login / Signup
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
