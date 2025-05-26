
import { useEffect, useState } from 'react';
import { ArrowDown, Palette, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToPortfolio = () => {
    const element = document.querySelector('#portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background with Parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-vizualiza-bg-dark via-vizualiza-purple/20 to-vizualiza-bg-light"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-20 left-10 w-20 h-20 bg-vizualiza-orange/20 rounded-full animate-float"
          style={{ animationDelay: '0s' }}
        />
        <div 
          className="absolute top-40 right-20 w-16 h-16 bg-vizualiza-green/20 rounded-full animate-float"
          style={{ animationDelay: '1s' }}
        />
        <div 
          className="absolute bottom-40 left-20 w-24 h-24 bg-vizualiza-pink/20 rounded-full animate-float"
          style={{ animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-20 right-10 w-12 h-12 bg-vizualiza-purple/30 rounded-full animate-float"
          style={{ animationDelay: '0.5s' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6">
            <span className="bg-vizualiza-gradient bg-clip-text text-transparent animate-gradient bg-300%">
              Vizualiza
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up">
            Comunicação Visual que <span className="text-vizualiza-purple font-semibold">Transforma</span> e <span className="text-vizualiza-orange font-semibold">Inspira</span>
          </p>
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up">
            Criamos experiências visuais únicas que conectam sua marca ao seu público de forma autêntica e impactante.
          </p>
        </div>

        {/* Features Icons */}
        <div className="flex justify-center space-x-8 mb-12 animate-fade-in">
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
            <Palette className="w-8 h-8 text-vizualiza-purple mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-gray-300">Design</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
            <Camera className="w-8 h-8 text-vizualiza-orange mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-gray-300">Fotografia</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-white/5 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group">
            <Sparkles className="w-8 h-8 text-vizualiza-green mb-2 group-hover:scale-110 transition-transform" />
            <span className="text-sm text-gray-300">Identidade</span>
          </div>
        </div>

        <Button 
          onClick={scrollToPortfolio}
          size="lg"
          className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark text-white px-8 py-4 text-lg animate-fade-in hover:scale-105 transition-all duration-300"
        >
          Ver Portfólio
          <ArrowDown className="ml-2 w-5 h-5" />
        </Button>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
