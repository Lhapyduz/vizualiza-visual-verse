
import { motion } from 'framer-motion';
import { Eye, Target, Lightbulb, Users } from 'lucide-react';
import { useState } from 'react';

const About = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  const values = [
    {
      icon: Eye,
      title: 'Visão',
      description: 'Transformamos ideias em experiências visuais memoráveis que conectam marcas e pessoas.',
      color: 'vizualiza-purple',
      gradient: 'from-purple-500/20 to-purple-600/20'
    },
    {
      icon: Target,
      title: 'Precisão',
      description: 'Cada projeto é desenvolvido com foco nos objetivos específicos do cliente e seu público-alvo.',
      color: 'vizualiza-orange',
      gradient: 'from-orange-500/20 to-orange-600/20'
    },
    {
      icon: Lightbulb,
      title: 'Criatividade',
      description: 'Inovação e originalidade são o coração de tudo que criamos, sempre com propósito.',
      color: 'vizualiza-green',
      gradient: 'from-green-500/20 to-green-600/20'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Trabalhamos em parceria próxima com nossos clientes para alcançar resultados excepcionais.',
      color: 'vizualiza-pink',
      gradient: 'from-pink-500/20 to-pink-600/20'
    }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.section
      id="about"
      className="py-20 px-4 bg-vizualiza-bg-light relative overflow-hidden"
      initial="initial"
      whileInView="animate"
      viewport={{ once: true }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <motion.div
        className="max-w-6xl mx-auto relative z-10"
        initial="initial"
        whileInView="animate"
        viewport={{ once: true }}
      >
        <motion.div
          className="text-center mb-16"
          variants={fadeInUp}
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Sobre a </span>
            <span className="bg-vizualiza-gradient bg-clip-text text-transparent relative">
              Vizualiza
              <div className="absolute -bottom-2 left-0 w-full h-1 bg-vizualiza-gradient rounded-full animate-pulse" />
            </span>
          </h2>
          <motion.p
            className="text-xl text-gray-300 max-w-3xl mx-auto"
            variants={{ ...fadeInUp, animate: { ...fadeInUp.animate, transition: { ...fadeInUp.animate.transition, delay: 0.2 }}}}
          >
            Somos especialistas em comunicação visual, dedicados a criar soluções criativas 
            que elevam marcas e geram conexões autênticas com o público.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              className="relative group cursor-pointer"
              variants={{ ...fadeInUp, animate: { ...fadeInUp.animate, transition: { ...fadeInUp.animate.transition, delay: 0.4 + index * 0.1 }}}}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`bg-gradient-to-br ${value.gradient} p-6 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group-hover:scale-105 border border-white/5 hover:border-white/20 relative overflow-hidden`}>
                {/* Hover Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-30 transition-opacity duration-500 blur-xl`} />
                
                {/* Icon with Enhanced Animation */}
                <div className="relative z-10 mb-4">
                  <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${value.gradient} flex items-center justify-center group-hover:scale-110 transition-all duration-300 relative`}>
                    <value.icon className={`w-8 h-8 text-${value.color} group-hover:text-white transition-colors duration-300 drop-shadow-lg`} />
                    {hoveredCard === index && (
                      <div className={`absolute inset-0 bg-${value.color} rounded-full animate-ping opacity-30`} />
                    )}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300 transition-all duration-300">
                  {value.title}
                </h3>
                <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                  {value.description}
                </p>

                {/* Card Number */}
                <div className="absolute top-4 right-4 text-6xl font-bold text-white/5 group-hover:text-white/10 transition-colors duration-300">
                  {index + 1}
                </div>
              </div>
            </div>
          ))}
        </div>

        <motion.div
          className="bg-gradient-to-r from-vizualiza-purple/20 to-vizualiza-orange/20 p-8 rounded-xl backdrop-blur-sm border border-white/10 relative overflow-hidden"
          variants={{ ...fadeIn, animate: { ...fadeIn.animate, transition: { ...fadeIn.animate.transition, delay: 0.8 }}}}
        >
          {/* Enhanced Background Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-vizualiza-purple/10 to-vizualiza-orange/10 animate-gradient bg-300%" />
          
          <div className="text-center relative z-10">
            <h3 className="text-2xl font-bold text-white mb-4 relative">
              Nossa Missão
              <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-16 h-0.5 bg-vizualiza-gradient animate-pulse" />
            </h3>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Desenvolver soluções visuais inovadoras que não apenas chamam a atenção, 
              mas também comunicam efetivamente a essência de cada marca, criando 
              experiências que inspiram, engajam e geram resultados tangíveis.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default About;
