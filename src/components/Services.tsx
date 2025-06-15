
import React from 'react';
import { Palette, Globe, Zap, Target, Users, Award } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import { Button } from '@/components/ui/button';

const Services = () => {
  const services = [
    {
      icon: Palette,
      title: 'Identidade Visual',
      description: 'Criação completa de logotipos, paleta de cores e manual da marca.',
      price: 'A partir de R$ 800',
      features: ['Logo + Variações', 'Paleta de Cores', 'Manual da Marca', 'Papelaria Básica'],
      popular: false
    },
    {
      icon: Globe,
      title: 'Design Web',
      description: 'Sites responsivos e modernos que convertem visitantes em clientes.',
      price: 'A partir de R$ 1.500',
      features: ['Design Responsivo', 'SEO Otimizado', 'Integração CMS', 'Suporte 30 dias'],
      popular: true
    },
    {
      icon: Zap,
      title: 'Branding Completo',
      description: 'Pacote completo para empresas que querem se destacar no mercado.',
      price: 'A partir de R$ 2.800',
      features: ['Identidade Visual', 'Site Profissional', 'Material Marketing', 'Consultoria'],
      popular: false
    },
    {
      icon: Target,
      title: 'Marketing Visual',
      description: 'Materiais para redes sociais, banners e campanhas publicitárias.',
      price: 'A partir de R$ 400',
      features: ['Posts para Redes Sociais', 'Banners', 'Flyers Digitais', 'Templates'],
      popular: false
    },
    {
      icon: Users,
      title: 'Consultoria Design',
      description: 'Orientação estratégica para melhorar sua comunicação visual.',
      price: 'R$ 200/hora',
      features: ['Análise de Marca', 'Estratégia Visual', 'Orientação', 'Relatório'],
      popular: false
    },
    {
      icon: Award,
      title: 'Redesign de Marca',
      description: 'Renovação completa da identidade visual existente.',
      price: 'A partir de R$ 1.200',
      features: ['Análise da Marca Atual', 'Nova Identidade', 'Migração', 'Guidelines'],
      popular: false
    }
  ];

  return (
    <section id="services" className="py-20 px-4 bg-gradient-to-br from-vizualiza-bg-dark to-vizualiza-bg-dark/80">
      <div className="max-w-7xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Nossos </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Serviços</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Soluções completas em design para transformar sua marca e fazer seu negócio se destacar no mercado.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
              <div className={`relative bg-white/5 backdrop-blur-sm border rounded-2xl p-8 h-full hover:bg-white/10 transition-all duration-300 ${
                service.popular ? 'border-vizualiza-purple shadow-lg shadow-vizualiza-purple/20' : 'border-white/10'
              }`}>
                {service.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-vizualiza-gradient px-4 py-2 rounded-full text-white text-sm font-semibold">
                      Mais Popular
                    </span>
                  </div>
                )}
                
                <div className="mb-6">
                  <div className="w-16 h-16 bg-vizualiza-purple/20 rounded-lg flex items-center justify-center mb-4">
                    <service.icon className="w-8 h-8 text-vizualiza-purple" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300 mb-4">{service.description}</p>
                  <p className="text-2xl font-bold text-vizualiza-purple">{service.price}</p>
                </div>

                <div className="mb-8">
                  <ul className="space-y-3">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3 text-gray-300">
                        <div className="w-2 h-2 bg-vizualiza-purple rounded-full flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <Button 
                  className={`w-full ${
                    service.popular 
                      ? 'bg-vizualiza-gradient hover:opacity-90' 
                      : 'bg-white/10 hover:bg-white/20 border border-white/20'
                  } transition-all duration-200`}
                  onClick={() => {
                    const contactSection = document.getElementById('contact');
                    contactSection?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  Solicitar Orçamento
                </Button>
              </div>
            </ScrollAnimation>
          ))}
        </div>

        <ScrollAnimation direction="up" delay={0.6}>
          <div className="text-center mt-16">
            <p className="text-gray-300 mb-6">
              Precisa de algo personalizado? Entre em contato para um orçamento sob medida.
            </p>
            <Button 
              size="lg"
              className="bg-vizualiza-gradient hover:opacity-90"
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Falar com Especialista
            </Button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Services;
