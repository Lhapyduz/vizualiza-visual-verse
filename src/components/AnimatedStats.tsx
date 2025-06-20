
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { AnimatedCounter, GlassmorphismCard } from './MicroInteractions';
import { Users, Award, Coffee, Heart } from 'lucide-react';

const stats = [
  {
    icon: Users,
    value: 150,
    suffix: '+',
    label: 'Clientes Satisfeitos',
    color: '#8B5CF6'
  },
  {
    icon: Award,
    value: 85,
    suffix: '+',
    label: 'Projetos Concluídos',
    color: '#06B6D4'
  },
  {
    icon: Coffee,
    value: 1200,
    suffix: '+',
    label: 'Xícaras de Café',
    color: '#F59E0B'
  },
  {
    icon: Heart,
    value: 100,
    suffix: '%',
    label: 'Dedicação',
    color: '#EF4444'
  }
];

const AnimatedStats = () => {
  const { ref, inView } = useInView({
    threshold: 0.3,
    triggerOnce: true
  });

  return (
    <section ref={ref} className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h3 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Números que <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Inspiram</span>
          </h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Nossa jornada em números reflete o compromisso com a excelência e a satisfação dos nossos clientes.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ 
                duration: 0.8, 
                delay: index * 0.2,
                ease: [0.22, 1, 0.36, 1]
              }}
            >
              <GlassmorphismCard 
                className="p-6 text-center group hover:scale-105 transition-transform duration-300"
                intensity="medium"
              >
                <motion.div
                  className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: `${stat.color}20` }}
                  whileHover={{ 
                    scale: 1.1,
                    backgroundColor: `${stat.color}30`
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <stat.icon 
                    className="w-8 h-8" 
                    style={{ color: stat.color }}
                  />
                </motion.div>
                
                <div className="mb-2">
                  {inView && (
                    <AnimatedCounter
                      from={0}
                      to={stat.value}
                      duration={2000}
                      suffix={stat.suffix}
                      className="text-3xl md:text-4xl font-bold text-white block"
                    />
                  )}
                </div>
                
                <p className="text-gray-300 text-sm font-medium group-hover:text-white transition-colors duration-300">
                  {stat.label}
                </p>
              </GlassmorphismCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnimatedStats;
