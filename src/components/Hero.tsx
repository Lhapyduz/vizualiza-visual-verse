
import { useEffect, useState } from 'react';
import { ArrowDown, Palette, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import ParticleBackground from './ParticleBackground';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { ref, isIntersecting } = useIntersectionObserver();

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const scrollToPortfolio = () => {
    const element = document.querySelector('#portfolio');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section ref={ref} id="hero" className="relative h-screen flex items-center justify-center overflow-hidden">
      <ParticleBackground />
      
      {/* Enhanced Background with Parallax */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-vizualiza-bg-dark via-vizualiza-purple/20 to-vizualiza-bg-light"
        style={{
          transform: `translateY(${scrollY * 0.5}px)`,
        }}
      />
      
      {/* Interactive Gradient Overlay */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3), transparent 40%)`,
        }}
      />
      
      {/* Enhanced Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-${4 + (i % 3) * 4} h-${4 + (i % 3) * 4} rounded-full animate-float backdrop-blur-sm`}
            style={{
              left: `${10 + (i * 15)}%`,
              top: `${20 + (i % 3) * 20}%`,
              animationDelay: `${i * 0.5}s`,
              background: `linear-gradient(135deg, ${
                ['#8B5CF6', '#FF6B35', '#32D74B', '#FF2D92'][i % 4]
              }20, transparent)`,
              border: `1px solid ${
                ['#8B5CF6', '#FF6B35', '#32D74B', '#FF2D92'][i % 4]
              }40`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
        <div className={`transition-all duration-1000 ${isIntersecting ? 'animate-fade-in' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-6xl md:text-8xl font-bold mb-6 relative">
            <span className="bg-vizualiza-gradient bg-clip-text text-transparent animate-gradient bg-300% relative inline-block">
              Vizualiza
              <div className="absolute inset-0 bg-vizualiza-gradient bg-clip-text text-transparent blur-sm animate-pulse opacity-50" />
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-8 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            Comunicação Visual que <span className="text-vizualiza-purple font-semibold relative">
              Transforma
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vizualiza-purple animate-pulse" />
            </span> e <span className="text-vizualiza-orange font-semibold relative">
              Inspira
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vizualiza-orange animate-pulse" style={{ animationDelay: '0.5s' }} />
            </span>
          </p>
          
          <p className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.4s' }}>
            Criamos experiências visuais únicas que conectam sua marca ao seu público de forma autêntica e impactante.
          </p>
        </div>

        {/* Enhanced Features Icons */}
        <div className="flex justify-center space-x-8 mb-12 animate-fade-in" style={{ animationDelay: '0.6s' }}>
          {[
            { icon: Palette, label: 'Design', color: 'vizualiza-purple' },
            { icon: Camera, label: 'Fotografia', color: 'vizualiza-orange' },
            { icon: Sparkles, label: 'Identidade', color: 'vizualiza-green' }
          ].map((item, index) => (
            <div 
              key={item.label}
              className="flex flex-col items-center p-6 bg-white/5 rounded-xl backdrop-blur-md hover:bg-white/10 transition-all duration-500 group cursor-pointer border border-white/10 hover:border-white/20"
              style={{ animationDelay: `${0.8 + index * 0.1}s` }}
            >
              <div className="relative">
                <item.icon className={`w-8 h-8 text-${item.color} mb-3 group-hover:scale-125 transition-all duration-300 group-hover:drop-shadow-lg`} />
                <div className={`absolute inset-0 bg-${item.color} opacity-20 rounded-full scale-150 group-hover:animate-ping`} />
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">{item.label}</span>
            </div>
          ))}
        </div>

        <Button 
          onClick={scrollToPortfolio}
          size="lg"
          className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark text-white px-8 py-4 text-lg animate-fade-in hover:scale-110 transition-all duration-300 relative overflow-hidden group border-2 border-transparent hover:border-vizualiza-purple/50"
          style={{ animationDelay: '1s' }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-vizualiza-purple to-vizualiza-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
          <span className="relative z-10">Ver Portfólio</span>
          <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
        </Button>
      </div>

      {/* Enhanced Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-12 border-2 border-white/30 rounded-full flex justify-center relative overflow-hidden">
          <div className="w-1 h-4 bg-gradient-to-b from-white/60 to-transparent rounded-full mt-2 animate-pulse" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/10 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
