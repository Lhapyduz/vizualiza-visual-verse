
import React from 'react';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import ContactFormEnhanced from './ContactFormEnhanced';
import SocialShare from './SocialShare';

const Contact = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      content: 'contato@vizualiza.com.br',
      link: 'mailto:contato@vizualiza.com.br'
    },
    {
      icon: Phone,
      title: 'Telefone',
      content: '(11) 99999-9999',
      link: 'tel:+5511999999999'
    },
    {
      icon: MapPin,
      title: 'Localização',
      content: 'São Paulo, SP',
      link: 'https://maps.google.com/?q=São+Paulo,+SP'
    },
    {
      icon: Clock,
      title: 'Horário',
      content: 'Seg - Sex: 9h às 18h',
      link: null
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-vizualiza-bg-dark">
      <div className="max-w-7xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Entre em </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Contato</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Pronto para transformar sua marca? Vamos conversar sobre seu projeto 
              e criar algo extraordinário juntos.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-8">
            <ScrollAnimation direction="left">
              <div>
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Informações de Contato
                </h3>
                <div className="space-y-6">
                  {contactInfo.map((item, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-vizualiza-purple/20 rounded-lg flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-6 h-6 text-vizualiza-purple" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white mb-1">{item.title}</h4>
                        {item.link ? (
                          <a
                            href={item.link}
                            className="text-gray-400 hover:text-vizualiza-purple transition-colors duration-200"
                            target={item.link.startsWith('http') ? '_blank' : undefined}
                            rel={item.link.startsWith('http') ? 'noopener noreferrer' : undefined}
                          >
                            {item.content}
                          </a>
                        ) : (
                          <p className="text-gray-400">{item.content}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="left" delay={0.2}>
              <div>
                <h4 className="font-semibold text-white mb-4">Compartilhe</h4>
                <SocialShare
                  title="Vizualiza Visual Verse - Design & Identidade Visual"
                  description="Confira este estúdio de design incrível!"
                />
              </div>
            </ScrollAnimation>

            <ScrollAnimation direction="left" delay={0.3}>
              <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
                <h4 className="font-semibold text-white mb-3">Por que nos escolher?</h4>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vizualiza-purple rounded-full"></div>
                    Atendimento personalizado
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vizualiza-purple rounded-full"></div>
                    Projetos únicos e criativos
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vizualiza-purple rounded-full"></div>
                    Prazo de entrega respeitado
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-vizualiza-purple rounded-full"></div>
                    Suporte pós-projeto
                  </li>
                </ul>
              </div>
            </ScrollAnimation>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <ScrollAnimation direction="right">
              <div className="bg-white/5 rounded-lg p-8 backdrop-blur-sm border border-white/10">
                <h3 className="text-2xl font-semibold text-white mb-6">
                  Solicite um Orçamento
                </h3>
                <ContactFormEnhanced />
              </div>
            </ScrollAnimation>
          </div>
        </div>

        {/* Call to Action */}
        <ScrollAnimation direction="up" delay={0.4}>
          <div className="text-center mt-16 p-8 bg-vizualiza-gradient rounded-2xl">
            <h3 className="text-2xl font-bold text-white mb-4">
              Pronto para dar vida à sua marca?
            </h3>
            <p className="text-white/90 mb-6 max-w-2xl mx-auto">
              Entre em contato hoje mesmo e descubra como podemos transformar 
              sua visão em uma identidade visual impactante.
            </p>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white text-vizualiza-purple px-8 py-3 rounded-lg font-semibold hover:bg-white/90 transition-colors duration-200"
            >
              <Send className="w-5 h-5" />
              Começar Projeto
            </a>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Contact;
