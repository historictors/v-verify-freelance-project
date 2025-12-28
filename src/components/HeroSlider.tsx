import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroCrime1 from "@/assets/hero-crime-1.jpg";
import heroCrime2 from "@/assets/hero-crime-2.jpg";
import heroCrime3 from "@/assets/hero-crime-3.jpg";

const slides = [
  {
    image: heroCrime1,
    headline: "Case File #001",
    subtext: "Husband's body found concealed in industrial container. Investigation revealed hidden marriage secrets.",
  },
  {
    image: heroCrime2,
    headline: "Case File #002",
    subtext: "Honeymoon tragedy. Wife and secret lover plotted murder. Trust was never verified.",
  },
  {
    image: heroCrime3,
    headline: "Case File #003",
    subtext: "Double life exposed too late. Hidden debts, criminal past, family destroyed.",
  },
];

export const HeroSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Slides */}
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? "opacity-100" : "opacity-0"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.headline}
            className="h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
          
          {/* Scanline effect */}
          <div className="absolute inset-0 scanline pointer-events-none" />
        </div>
      ))}

      {/* Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
        <div className="animate-fade-in space-y-6 max-w-4xl">
          {/* Breaking News Badge */}
          <div className="inline-flex items-center gap-2 bg-destructive/20 border border-destructive/50 px-4 py-2 rounded animate-flicker">
            <span className="h-2 w-2 rounded-full bg-destructive animate-pulse" />
            <span className="text-destructive font-display uppercase tracking-widest text-sm">Crime Investigation Unit</span>
          </div>

          {/* Case File */}
          <p className="text-primary font-display text-xl tracking-[0.3em] uppercase text-glow">
            {slides[currentSlide].headline}
          </p>

          {/* Main Headline */}
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold uppercase leading-tight">
            <span className="text-foreground">Real Cases.</span>
            <br />
            <span className="text-primary text-glow">Real Danger.</span>
          </h1>

          {/* Subtext */}
          <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto">
            {slides[currentSlide].subtext}
          </p>

          {/* CTA */}
          <div className="pt-4">
            <p className="text-2xl md:text-3xl font-display uppercase tracking-wider text-foreground">
              Verify <span className="text-primary text-glow">Before</span> Marriage.
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 p-2 border border-primary/30 bg-background/50 backdrop-blur-sm rounded-full hover:bg-primary/20 hover:border-primary transition-all"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 p-2 border border-primary/30 bg-background/50 backdrop-blur-sm rounded-full hover:bg-primary/20 hover:border-primary transition-all"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`h-1 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "w-8 bg-primary shadow-[0_0_10px_hsl(210_100%_50%/0.5)]"
                : "w-4 bg-muted-foreground/50 hover:bg-muted-foreground"
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};
