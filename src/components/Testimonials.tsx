
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import ScrollAnimation from './ScrollAnimation';
import { Button } from '@/components/ui/button';

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials = [
    {
      id: 1,
      name: 'Ana Silva',
      company: 'Boutique Elegance',
      role: 'Proprietária',
      content: 'O Gregory transformou completamente a identidade visual da minha boutique. As vendas aumentaram 40% após o rebranding. Profissional excepcional!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 2,
      name: 'Carlos Mendes',
      company: 'Tech Solutions',
      role: 'CEO',
      content: 'Site incrível! Design moderno, responsivo e com foco em conversão. Nossa taxa de conversão dobrou em 3 meses. Recomendo 100%!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 3,
      name: 'Marina Costa',
      company: 'Clínica Bem Estar',
      role: 'Diretora',
      content: 'Trabalho impecável! A nova identidade visual transmite exatamente a confiança que queremos passar aos nossos pacientes.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 4,
      name: 'Roberto Alves',
      company: 'Restaurante Sabor',
      role: 'Chef/Proprietário',
      content: 'Design criativo e estratégico. O cardápio e materiais visuais ficaram lindos. Os clientes sempre elogiam!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face'
    },
    {
      id: 5,
      name: 'Juliana Ferreira',
      company: 'Studio Pilates',
      role: 'Instrutora',
      content: 'Desde o novo site e identidade visual, consegui triplicar meu número de alunos. Design faz toda a diferença!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=80&h=80&fit=crop&crop=face'
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => 
        prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(timer);
  }, [testimonials.length]);

  const nextTestimonial = () => {
    setCurrentIndex(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1);
  };

  const prevTestimonial = () => {
    setCurrentIndex(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
        }`}
      />
    ));
  };

  return (
    <section className="py-20 px-4 bg-vizualiza-bg-dark">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">O que nossos </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Clientes</span>
              <span className="text-white"> dizem</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Confira os depoimentos de clientes que transformaram seus negócios com nosso design.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <div className="relative">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="flex-shrink-0">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-vizualiza-purple/20"
                  />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <Quote className="w-8 h-8 text-vizualiza-purple mb-4 mx-auto md:mx-0" />
                  
                  <blockquote className="text-xl md:text-2xl text-white mb-6 leading-relaxed">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                  
                  <div className="flex justify-center md:justify-start mb-4">
                    {renderStars(testimonials[currentIndex].rating)}
                  </div>
                  
                  <div>
                    <h4 className="text-lg font-semibold text-white">
                      {testimonials[currentIndex].name}
                    </h4>
                    <p className="text-vizualiza-purple font-medium">
                      {testimonials[currentIndex].role}
                    </p>
                    <p className="text-gray-400">
                      {testimonials[currentIndex].company}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Buttons */}
            <Button
              variant="outline"
              size="icon"
              onClick={prevTestimonial}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 border-white/20 hover:bg-white/20"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <Button
              variant="outline"
              size="icon"
              onClick={nextTestimonial}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 border-white/20 hover:bg-white/20"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        </ScrollAnimation>

        {/* Dots Indicator */}
        <ScrollAnimation direction="up" delay={0.4}>
          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? 'bg-vizualiza-purple' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </ScrollAnimation>

        {/* Stats */}
        <ScrollAnimation direction="up" delay={0.6}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-vizualiza-purple mb-2">50+</h3>
              <p className="text-gray-300">Projetos Entregues</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-vizualiza-purple mb-2">98%</h3>
              <p className="text-gray-300">Clientes Satisfeitos</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-vizualiza-purple mb-2">5★</h3>
              <p className="text-gray-300">Avaliação Média</p>
            </div>
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold text-vizualiza-purple mb-2">24h</h3>
              <p className="text-gray-300">Tempo de Resposta</p>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default Testimonials;
