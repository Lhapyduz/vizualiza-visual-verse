
import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { ArrowDown, Palette, Camera, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from './ParticleBackground';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

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

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const headlineText = "Vizualiza";
  const headlineContainerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.07, // Adjust timing
      },
    },
  };
  const headlineCharVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } }, // Shorter duration for individual chars
  };

  const taglineText = "Comunicação Visual que Transforma e Inspira";
  const taglineWordVariants = {
    initial: { opacity: 0, y: 15 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };


  // Mouse-reactive tilt
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    if (typeof window !== 'undefined') {
      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    }
  }, [mouseX, mouseY]);

  const rotateX = useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 0], [5, -5], {
    clamp: false,
  });
  const rotateY = useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 0], [-5, 5], {
    clamp: false,
  });


  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
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
      <motion.div
        className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        {/* Headline with character stagger */}
        <motion.h1
          className="text-6xl md:text-8xl font-bold mb-6 relative bg-vizualiza-gradient bg-clip-text text-transparent animate-gradient bg-300%"
          variants={headlineContainerVariants}
          // Removed fadeInUp from here, apply to characters
        >
          {headlineText.split("").map((char, index) => (
            <motion.span key={`${char}-${index}`} variants={headlineCharVariants} className="inline-block relative">
              {char}
              {/* Pulse effect can be tricky with individual spans. Consider applying to parent or simplifying. */}
              {/* For simplicity, the global pulse div is kept, it might not align perfectly per character. */}
            </motion.span>
          ))}
           <div className="absolute inset-0 bg-vizualiza-gradient bg-clip-text text-transparent blur-sm animate-pulse opacity-50" />
        </motion.h1>

        {/* Tagline with word stagger */}
        <motion.p
          className="text-xl md:text-2xl text-gray-300 mb-8"
          variants={headlineContainerVariants} // Re-use container for stagger logic, adjust delay if needed
          // The individual word spans will have their own animation variants triggered by this parent
        >
          {taglineText.split(" ").map((word, index, arr) => (
            <motion.span key={`${word}-${index}`} variants={taglineWordVariants} className="inline-block mr-1.5">
              {word === "Transforma" ? (
                <span className="text-vizualiza-purple font-semibold relative">
                  {word}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vizualiza-purple animate-pulse" />
                </span>
              ) : word === "Inspira" ? (
                <span className="text-vizualiza-orange font-semibold relative">
                  {word}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-vizualiza-orange animate-pulse" style={{ animationDelay: '0.5s' }} />
                </span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </motion.p>
          
        <motion.div variants={fadeInUp}> {/* This div wraps the second paragraph and icons, keeping its original animation */}
          <motion.p
            className="text-lg text-gray-400 mb-12 max-w-2xl mx-auto"
            // Delay adjusted because parent fadeInUp has its own timing. Or make this a separate motion.div.
            variants={{ ...fadeInUp, animate: { ...fadeInUp.animate, transition: { ...fadeInUp.animate.transition, delay: 0.6 }}}} // Increased delay
          >
            Criamos experiências visuais únicas que conectam sua marca ao seu público de forma autêntica e impactante.
          </motion.p>
        </motion.div>

        {/* Enhanced Features Icons */}
        <motion.div
          className="flex justify-center space-x-8 mb-12"
          variants={{ ...fadeIn, animate: { ...fadeIn.animate, transition: { ...fadeIn.animate.transition, delay: 0.6 }}}}
        >
          {[
            { icon: Palette, label: 'Design', color: 'vizualiza-purple' },
            { icon: Camera, label: 'Fotografia', color: 'vizualiza-orange' },
            { icon: Sparkles, label: 'Identidade', color: 'vizualiza-green' }
          ].map((item, index) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center p-6 bg-white/5 rounded-xl backdrop-blur-md hover:bg-white/10 transition-all duration-500 group cursor-pointer border border-white/10 hover:border-white/20"
              variants={{ ...fadeInUp, animate: { ...fadeInUp.animate, transition: { ...fadeInUp.animate.transition, delay: 0.8 + index * 0.1 }}}}
            >
              <div className="relative">
                <item.icon className={`w-8 h-8 text-${item.color} mb-3 group-hover:scale-125 transition-all duration-300 group-hover:drop-shadow-lg`} />
                <div className={`absolute inset-0 bg-${item.color} opacity-20 rounded-full scale-150 group-hover:animate-ping`} />
              </div>
              <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-300">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>

        <motion.div variants={{ ...fadeIn, animate: { ...fadeIn.animate, transition: { ...fadeIn.animate.transition, delay: 1 }}}}>
          <Button
            onClick={scrollToPortfolio}
            size="lg"
            className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark text-white px-8 py-4 text-lg hover:scale-110 transition-all duration-300 relative overflow-hidden group border-2 border-transparent hover:border-vizualiza-purple/50"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-vizualiza-purple to-vizualiza-orange opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
            <span className="relative z-10">Ver Portfólio</span>
            <ArrowDown className="ml-2 w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
          </Button>
        </motion.div>
      </motion.div>

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
