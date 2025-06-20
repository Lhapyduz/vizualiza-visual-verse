import { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { ArrowDown, Palette, Camera, Sparkles, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ParticleBackground from './ParticleBackground';
import ScrollAnimation from './ScrollAnimation';

const Hero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

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

  // Enhanced animations
  const fadeInUp = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] } }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  // Mouse-reactive effects
  const mouseX = useMotionValue(typeof window !== 'undefined' ? window.innerWidth / 2 : 0);
  const mouseY = useMotionValue(typeof window !== 'undefined' ? window.innerHeight / 2 : 0);

  const springConfig = { stiffness: 150, damping: 15, mass: 0.1 };
  const rotateX = useSpring(useTransform(mouseY, [0, typeof window !== 'undefined' ? window.innerHeight : 0], [5, -5]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [0, typeof window !== 'undefined' ? window.innerWidth : 0], [-5, 5]), springConfig);

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

  const headlineText = "Vizualiza";
  const taglineText = "Comunicação Visual que Transforma e Inspira";

  return (
    <section id="hero" className="relative h-screen flex items-center justify-center overflow-hidden" style={{ perspective: '1000px' }}>
      <ParticleBackground />
      
      {/* Enhanced Background with Multiple Layers */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 bg-gradient-to-br from-vizualiza-bg-dark via-vizualiza-purple/20 to-vizualiza-bg-light"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        />
        <div 
          className="absolute inset-0 bg-gradient-to-t from-vizualiza-bg-dark/50 to-transparent"
          style={{ transform: `translateY(${scrollY * 0.3}px)` }}
        />
      </div>
      
      {/* Interactive Gradient Overlay with Enhanced Effect */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-1000"
        style={{
          background: `radial-gradient(800px circle at ${mousePosition.x}px ${mousePosition.y}px, 
            rgba(139, 92, 246, 0.4) 0%, 
            rgba(255, 107, 53, 0.2) 30%, 
            transparent 70%)`,
        }}
      />
      
      {/* Floating Elements with Enhanced Animation */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full backdrop-blur-sm border"
            style={{
              width: `${20 + (i % 4) * 15}px`,
              height: `${20 + (i % 4) * 15}px`,
              left: `${5 + (i * 8)}%`,
              top: `${10 + (i % 4) * 20}%`,
              background: `linear-gradient(135deg, ${
                ['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4'][i % 4]
              }20, transparent)`,
              borderColor: `${['#8B5CF6', '#6366F1', '#3B82F6', '#06B6D4'][i % 4]}40`,
            }}
            animate={{
              y: [-20, 20, -20],
              x: [-10, 10, -10],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1]
            }}
            transition={{
              duration: 8 + i * 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.5
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        initial="initial"
        animate="animate"
        variants={staggerContainer}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      >
        {/* Enhanced Headline */}
        <motion.div className="mb-8" variants={fadeInUp}>
          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-bold relative"
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {headlineText.split("").map((char, index) => (
              <motion.span
                key={`${char}-${index}`}
                className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-vizualiza-purple via-vizualiza-orange to-vizualiza-purple bg-300% animate-gradient"
                initial={{ opacity: 0, y: 50, rotateX: -90 }}
                animate={{ 
                  opacity: 1, 
                  y: 0, 
                  rotateX: 0,
                  color: isHovered ? '#FF6B35' : 'transparent'
                }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  transition: { duration: 0.2 }
                }}
              >
                {char}
              </motion.span>
            ))}
            
            {/* Animated Background Effect */}
            <motion.div 
              className="absolute inset-0 bg-clip-text text-transparent bg-gradient-to-r from-vizualiza-purple to-vizualiza-orange blur-sm opacity-30"
              animate={{ 
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
                scale: [1, 1.02, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {headlineText}
            </motion.div>
          </motion.h1>
        </motion.div>

        {/* Enhanced Tagline */}
        <ScrollAnimation direction="up" delay={0.3}>
          <motion.p
            className="text-xl md:text-3xl text-gray-300 mb-12 leading-relaxed"
            variants={fadeInUp}
          >
            {taglineText.split(" ").map((word, index) => (
              <motion.span
                key={`${word}-${index}`}
                className="inline-block mr-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.6, 
                  delay: 0.5 + index * 0.1,
                  ease: [0.22, 1, 0.36, 1]
                }}
                whileHover={{ 
                  scale: 1.05,
                  color: word === "Transforma" ? "#8B5CF6" : word === "Inspira" ? "#FF6B35" : undefined
                }}
              >
                {word === "Transforma" ? (
                  <span className="relative">
                    <span className="text-vizualiza-purple font-semibold">{word}</span>
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-vizualiza-purple"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 1.5 }}
                    />
                  </span>
                ) : word === "Inspira" ? (
                  <span className="relative">
                    <span className="text-vizualiza-orange font-semibold">{word}</span>
                    <motion.div 
                      className="absolute bottom-0 left-0 h-0.5 bg-vizualiza-orange"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.8, delay: 1.8 }}
                    />
                  </span>
                ) : (
                  word
                )}
              </motion.span>
            ))}
          </motion.p>
        </ScrollAnimation>

        <ScrollAnimation direction="fade" delay={0.6}>
          <motion.p
            className="text-lg text-gray-400 mb-16 max-w-3xl mx-auto leading-relaxed"
            variants={fadeInUp}
          >
            Criamos experiências visuais únicas que conectam sua marca ao seu público de forma autêntica e impactante.
          </motion.p>
        </ScrollAnimation>

        {/* Enhanced Features Icons */}
        <ScrollAnimation direction="up" delay={0.8}>
          <motion.div
            className="flex flex-wrap justify-center gap-6 mb-16"
            variants={staggerContainer}
          >
            {[
              { icon: Palette, label: 'Design', color: 'purple-500', bgColor: 'bg-purple-500/20' },
              { icon: Camera, label: 'Fotografia', color: 'blue-500', bgColor: 'bg-blue-500/20' },
              { icon: Sparkles, label: 'Identidade', color: 'cyan-500', bgColor: 'bg-cyan-500/20' }
            ].map((item, index) => (
              <motion.div
                key={item.label}
                className="group relative"
                variants={fadeInUp}
                whileHover={{ 
                  scale: 1.1, 
                  y: -10,
                  transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
                }}
              >
                <div className={`flex flex-col items-center p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 hover:border-white/30 transition-all duration-500 cursor-pointer ${item.bgColor} hover:bg-opacity-30 min-w-[140px]`}>
                  <div className="relative mb-4">
                    <item.icon className={`w-10 h-10 text-${item.color} transition-all duration-300 group-hover:scale-125 group-hover:drop-shadow-lg`} />
                    <motion.div 
                      className={`absolute inset-0 bg-${item.color} opacity-0 group-hover:opacity-20 rounded-full scale-150 blur-xl`}
                      whileHover={{ opacity: 0.3, scale: 2 }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">
                    {item.label}
                  </span>
                </div>
                
                {/* Floating indicator */}
                <motion.div
                  className="absolute -top-2 -right-2 w-4 h-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full opacity-0 group-hover:opacity-100"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
              </motion.div>
            ))}
          </motion.div>
        </ScrollAnimation>

        {/* Enhanced CTA Button with New Color */}
        <ScrollAnimation direction="up" delay={1}>
          <motion.div
            variants={fadeInUp}
            className="relative"
            whileHover={{ 
              scale: 1.05,
              boxShadow: "0 20px 40px rgba(139, 92, 246, 0.4)"
            }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              onClick={scrollToPortfolio}
              size="lg"
              className="group relative bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-10 py-6 text-lg font-semibold rounded-2xl shadow-2xl hover:shadow-purple-600/25 transition-all duration-500 border-2 border-purple-500/30 hover:border-purple-500/60 overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0"
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10 flex items-center gap-3">
                Ver Portfólio
                <motion.div
                  animate={{ y: [0, -3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowDown className="w-5 h-5 group-hover:translate-y-1 transition-transform duration-300" />
                </motion.div>
              </span>
            </Button>
            
            {/* Button glow effect with new color */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"
              animate={{ 
                scale: [1, 1.1, 1],
                opacity: [0.2, 0.4, 0.2]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </ScrollAnimation>
      </motion.div>

      {/* Enhanced Scroll Indicator */}
      <motion.div 
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        <motion.div 
          className="flex flex-col items-center gap-2 text-white/60 hover:text-white/80 transition-colors duration-300 cursor-pointer group"
          onClick={scrollToPortfolio}
          whileHover={{ scale: 1.1 }}
        >
          <MousePointer2 className="w-4 h-4 group-hover:animate-bounce" />
          <div className="w-6 h-12 border-2 border-white/40 rounded-full flex justify-center relative overflow-hidden group-hover:border-white/60 transition-colors duration-300">
            <motion.div 
              className="w-1 h-3 bg-white/60 rounded-full mt-2"
              animate={{ y: [0, 16, 0], opacity: [1, 0, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
          <span className="text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            Role para baixo
          </span>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
