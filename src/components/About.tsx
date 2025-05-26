
import { Eye, Target, Lightbulb, Users } from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Eye,
      title: 'Visão',
      description: 'Transformamos ideias em experiências visuais memoráveis que conectam marcas e pessoas.'
    },
    {
      icon: Target,
      title: 'Precisão',
      description: 'Cada projeto é desenvolvido com foco nos objetivos específicos do cliente e seu público-alvo.'
    },
    {
      icon: Lightbulb,
      title: 'Criatividade',
      description: 'Inovação e originalidade são o coração de tudo que criamos, sempre com propósito.'
    },
    {
      icon: Users,
      title: 'Colaboração',
      description: 'Trabalhamos em parceria próxima com nossos clientes para alcançar resultados excepcionais.'
    }
  ];

  return (
    <section id="about" className="py-20 px-4 bg-vizualiza-bg-light relative">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Sobre a </span>
            <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Vizualiza</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Somos especialistas em comunicação visual, dedicados a criar soluções criativas 
            que elevam marcas e geram conexões autênticas com o público.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {values.map((value, index) => (
            <div 
              key={value.title}
              className="bg-white/5 p-6 rounded-lg backdrop-blur-sm hover:bg-white/10 transition-all duration-300 group hover:scale-105"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <value.icon className="w-12 h-12 text-vizualiza-purple mb-4 group-hover:text-vizualiza-orange transition-colors duration-300" />
              <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
              <p className="text-gray-400 leading-relaxed">{value.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-vizualiza-purple/20 to-vizualiza-orange/20 p-8 rounded-lg backdrop-blur-sm">
          <div className="text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Nossa Missão</h3>
            <p className="text-lg text-gray-300 max-w-4xl mx-auto">
              Desenvolver soluções visuais inovadoras que não apenas chamam a atenção, 
              mas também comunicam efetivamente a essência de cada marca, criando 
              experiências que inspiram, engajam e geram resultados tangíveis.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
