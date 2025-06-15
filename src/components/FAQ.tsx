
import React from 'react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import ScrollAnimation from './ScrollAnimation';

const FAQ = () => {
  const faqs = [
    {
      question: 'Quanto tempo leva para criar uma identidade visual?',
      answer: 'O prazo varia conforme a complexidade do projeto. Uma identidade visual básica leva de 7 a 15 dias úteis, enquanto projetos mais complexos podem levar de 20 a 30 dias. Sempre definimos prazos claros no início do projeto.'
    },
    {
      question: 'Vocês fazem revisões no projeto?',
      answer: 'Sim! Incluímos até 3 rodadas de revisões no valor do projeto. Nosso processo é colaborativo e queremos garantir que você fique 100% satisfeito com o resultado final.'
    },
    {
      question: 'Como funciona o processo de criação?',
      answer: 'Nosso processo tem 5 etapas: 1) Briefing e pesquisa, 2) Conceituação e rascunhos, 3) Desenvolvimento das propostas, 4) Refinamento e ajustes, 5) Entrega dos arquivos finais. Você acompanha cada etapa.'
    },
    {
      question: 'Quais formatos de arquivo são entregues?',
      answer: 'Entregamos todos os formatos necessários: AI, EPS, PDF, PNG, JPG e SVG. Para web, incluímos também versões otimizadas. Você recebe um manual da marca com orientações de uso.'
    },
    {
      question: 'Vocês criam sites responsivos?',
      answer: 'Absolutamente! Todos os nossos sites são desenvolvidos com design responsivo, garantindo perfeita visualização em desktops, tablets e smartphones. Também otimizamos para SEO.'
    },
    {
      question: 'Oferecem suporte após a entrega?',
      answer: 'Sim! Oferecemos 30 dias de suporte gratuito após a entrega para esclarecimentos e pequenos ajustes. Para sites, incluímos também tutoriais de uso do sistema.'
    },
    {
      question: 'Como funciona o pagamento?',
      answer: 'Trabalhamos com 50% no início do projeto e 50% na entrega final. Aceitamos PIX, transferência bancária e cartão de crédito (parcelado em até 12x). Emitimos nota fiscal.'
    },
    {
      question: 'Fazem projetos para qualquer segmento?',
      answer: 'Sim! Temos experiência em diversos segmentos: saúde, alimentação, moda, tecnologia, educação, beleza e muitos outros. Cada projeto é único e personalizado.'
    },
    {
      question: 'Posso ver exemplos de trabalhos anteriores?',
      answer: 'Claro! Temos um portfólio completo com projetos de diferentes segmentos. Você pode ver nossos trabalhos na seção Portfolio deste site ou solicitar cases específicos do seu setor.'
    },
    {
      question: 'Vocês fazem apenas o design ou também desenvolvem sites?',
      answer: 'Fazemos tanto o design quanto o desenvolvimento! Oferecemos desde a criação visual até a programação completa, hospedagem e manutenção do site.'
    }
  ];

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-vizualiza-bg-dark/50 to-vizualiza-bg-dark">
      <div className="max-w-4xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-vizualiza-purple/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <HelpCircle className="w-8 h-8 text-vizualiza-purple" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Perguntas </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Frequentes</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Tire suas dúvidas sobre nossos serviços, processos e formas de trabalho.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-8">
            <Accordion type="single" collapsible className="w-full space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border border-white/10 rounded-lg px-6 bg-white/5 data-[state=open]:bg-white/10 transition-all duration-200"
                >
                  <AccordionTrigger className="text-left text-white hover:text-vizualiza-purple transition-colors duration-200 py-6">
                    <span className="text-lg font-medium">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-300 leading-relaxed pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.4}>
          <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">
              Não encontrou sua pergunta? Entre em contato conosco!
            </p>
            <button
              onClick={() => {
                const contactSection = document.getElementById('contact');
                contactSection?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="bg-vizualiza-gradient px-8 py-3 rounded-lg font-semibold text-white hover:opacity-90 transition-opacity duration-200"
            >
              Fazer uma Pergunta
            </button>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default FAQ;
