
import React, { useState, useEffect } from 'react';
import { Calculator, Check, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ScrollAnimation from './ScrollAnimation';

const BudgetCalculator = () => {
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [projectSize, setProjectSize] = useState<string>('');
  const [timeline, setTimeline] = useState<string>('');
  const [totalPrice, setTotalPrice] = useState(0);

  const services = [
    { id: 'logo', name: 'Criação de Logo', price: 600, category: 'Identidade' },
    { id: 'brand-identity', name: 'Identidade Visual Completa', price: 1200, category: 'Identidade' },
    { id: 'website-basic', name: 'Site Básico (até 5 páginas)', price: 1500, category: 'Web' },
    { id: 'website-advanced', name: 'Site Avançado (+ funcionalidades)', price: 3000, category: 'Web' },
    { id: 'ecommerce', name: 'E-commerce', price: 4500, category: 'Web' },
    { id: 'social-media', name: 'Templates Redes Sociais', price: 400, category: 'Marketing' },
    { id: 'print-materials', name: 'Materiais Impressos', price: 300, category: 'Marketing' },
    { id: 'packaging', name: 'Design de Embalagem', price: 800, category: 'Produto' },
    { id: 'branding-complete', name: 'Branding Completo', price: 3500, category: 'Pacote' },
  ];

  const projectSizeMultipliers = {
    'small': { label: 'Pequeno/Startup', multiplier: 0.8 },
    'medium': { label: 'Médio Porte', multiplier: 1 },
    'large': { label: 'Grande Empresa', multiplier: 1.3 }
  };

  const timelineMultipliers = {
    'urgent': { label: 'Urgente (até 1 semana)', multiplier: 1.5 },
    'normal': { label: 'Normal (2-4 semanas)', multiplier: 1 },
    'flexible': { label: 'Flexível (+ de 1 mês)', multiplier: 0.9 }
  };

  useEffect(() => {
    let basePrice = selectedServices.reduce((total, serviceId) => {
      const service = services.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);

    let multiplier = 1;
    
    if (projectSize && projectSizeMultipliers[projectSize as keyof typeof projectSizeMultipliers]) {
      multiplier *= projectSizeMultipliers[projectSize as keyof typeof projectSizeMultipliers].multiplier;
    }
    
    if (timeline && timelineMultipliers[timeline as keyof typeof timelineMultipliers]) {
      multiplier *= timelineMultipliers[timeline as keyof typeof timelineMultipliers].multiplier;
    }

    setTotalPrice(Math.round(basePrice * multiplier));
  }, [selectedServices, projectSize, timeline]);

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleRequestQuote = () => {
    const selectedServiceNames = selectedServices.map(id => 
      services.find(s => s.id === id)?.name
    ).join(', ');

    const message = `Olá! Gostaria de solicitar um orçamento com base na calculadora:

Serviços selecionados: ${selectedServiceNames}
Porte do projeto: ${projectSize ? projectSizeMultipliers[projectSize as keyof typeof projectSizeMultipliers].label : 'Não informado'}
Prazo: ${timeline ? timelineMultipliers[timeline as keyof typeof timelineMultipliers].label : 'Não informado'}
Valor estimado: R$ ${totalPrice.toLocaleString('pt-BR')}

Podemos conversar sobre os detalhes?`;

    const whatsappUrl = `https://wa.me/5541995618116?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const categorizedServices = services.reduce((acc, service) => {
    if (!acc[service.category]) {
      acc[service.category] = [];
    }
    acc[service.category].push(service);
    return acc;
  }, {} as Record<string, typeof services>);

  return (
    <section className="py-20 px-4 bg-vizualiza-bg-dark">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <div className="w-16 h-16 bg-vizualiza-purple/20 rounded-lg flex items-center justify-center mx-auto mb-6">
              <Calculator className="w-8 h-8 text-vizualiza-purple" />
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Calculadora de </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Orçamento</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Descubra quanto custará seu projeto de design de forma rápida e transparente.
            </p>
          </div>
        </ScrollAnimation>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Services Selection */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(categorizedServices).map(([category, categoryServices]) => (
              <ScrollAnimation key={category} direction="left">
                <Card className="bg-white/5 border-white/10">
                  <CardHeader>
                    <CardTitle className="text-white">{category}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {categoryServices.map(service => (
                      <div key={service.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-colors">
                        <div className="flex items-center space-x-3">
                          <Checkbox
                            id={service.id}
                            checked={selectedServices.includes(service.id)}
                            onCheckedChange={() => handleServiceToggle(service.id)}
                            className="border-white/20 data-[state=checked]:bg-vizualiza-purple"
                          />
                          <label htmlFor={service.id} className="text-white cursor-pointer">
                            {service.name}
                          </label>
                        </div>
                        <span className="text-vizualiza-purple font-semibold">
                          R$ {service.price.toLocaleString('pt-BR')}
                        </span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </ScrollAnimation>
            ))}

            {/* Project Details */}
            <ScrollAnimation direction="left" delay={0.2}>
              <Card className="bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-white">Detalhes do Projeto</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <label className="block text-white mb-3">Porte do Projeto</label>
                    <Select value={projectSize} onValueChange={setProjectSize}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Selecione o porte" />
                      </SelectTrigger>
                      <SelectContent className="bg-vizualiza-bg-dark border-white/20">
                        {Object.entries(projectSizeMultipliers).map(([key, value]) => (
                          <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-white mb-3">Prazo Desejado</label>
                    <Select value={timeline} onValueChange={setTimeline}>
                      <SelectTrigger className="bg-white/5 border-white/20 text-white">
                        <SelectValue placeholder="Selecione o prazo" />
                      </SelectTrigger>
                      <SelectContent className="bg-vizualiza-bg-dark border-white/20">
                        {Object.entries(timelineMultipliers).map(([key, value]) => (
                          <SelectItem key={key} value={key} className="text-white hover:bg-white/10">
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>

          {/* Price Summary */}
          <div className="lg:col-span-1">
            <ScrollAnimation direction="right">
              <Card className="bg-vizualiza-gradient border-0 sticky top-8">
                <CardHeader>
                  <CardTitle className="text-white text-center">Resumo do Orçamento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {selectedServices.length > 0 && (
                    <div className="space-y-3">
                      <h4 className="text-white font-semibold">Serviços Selecionados:</h4>
                      {selectedServices.map(serviceId => {
                        const service = services.find(s => s.id === serviceId);
                        return (
                          <div key={serviceId} className="flex items-center gap-2 text-white/90">
                            <Check className="w-4 h-4" />
                            <span className="text-sm">{service?.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="border-t border-white/20 pt-6">
                    <div className="text-center">
                      <p className="text-white/80 text-sm mb-2">Valor Estimado</p>
                      <p className="text-4xl font-bold text-white mb-6">
                        R$ {totalPrice.toLocaleString('pt-BR')}
                      </p>
                      
                      {selectedServices.length > 0 && (
                        <Button 
                          onClick={handleRequestQuote}
                          className="w-full bg-white text-vizualiza-purple hover:bg-white/90 font-semibold"
                        >
                          Solicitar Orçamento
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-white/70 text-xs">
                      * Valores estimados. Orçamento final pode variar conforme complexidade.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </ScrollAnimation>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BudgetCalculator;
