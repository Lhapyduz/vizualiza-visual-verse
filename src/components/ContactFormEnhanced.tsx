
import React, { useState } from 'react';
import { Send, Upload, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface FormData {
  name: string;
  email: string;
  phone: string;
  service: string;
  budget: string;
  message: string;
  files: File[];
}

const ContactFormEnhanced = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    message: '',
    files: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const maxSize = 10 * 1024 * 1024; // 10MB
    const allowedTypes = ['image/', 'application/pdf', '.doc', '.docx'];

    const validFiles = files.filter(file => {
      if (file.size > maxSize) {
        toast({
          title: "Arquivo muito grande",
          description: `${file.name} excede o limite de 10MB`,
          variant: "destructive"
        });
        return false;
      }
      
      const isValidType = allowedTypes.some(type => 
        file.type.startsWith(type) || file.name.toLowerCase().includes(type)
      );
      
      if (!isValidType) {
        toast({
          title: "Tipo de arquivo não suportado",
          description: `${file.name} não é um tipo de arquivo válido`,
          variant: "destructive"
        });
        return false;
      }
      
      return true;
    });

    setFormData(prev => ({ ...prev, files: [...prev.files, ...validFiles] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simular envio
    setTimeout(() => {
      // Salvar no localStorage para demonstração
      const submissions = JSON.parse(localStorage.getItem('contact-submissions') || '[]');
      submissions.push({
        ...formData,
        files: formData.files.map(f => f.name), // Apenas nomes dos arquivos
        timestamp: new Date().toISOString()
      });
      localStorage.setItem('contact-submissions', JSON.stringify(submissions));

      setIsSubmitting(false);
      setIsSubmitted(true);
      
      toast({
        title: "Mensagem enviada!",
        description: "Entraremos em contato em breve.",
      });
    }, 2000);
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/20 rounded-lg p-8 text-center"
      >
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-2xl font-semibold text-white mb-4">Mensagem Enviada!</h3>
        <p className="text-gray-300 mb-6">
          Obrigado pelo seu interesse! Nossa equipe analisará sua solicitação e 
          entrará em contato em até 24 horas.
        </p>
        <Button
          onClick={() => {
            setIsSubmitted(false);
            setFormData({
              name: '', email: '', phone: '', service: '', budget: '', message: '', files: []
            });
          }}
          variant="outline"
          className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
        >
          Enviar Nova Mensagem
        </Button>
      </motion.div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Nome Completo *
          </label>
          <Input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="Seu nome"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Email *
          </label>
          <Input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="seu@email.com"
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Telefone
          </label>
          <Input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            placeholder="(11) 99999-9999"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Serviço de Interesse
          </label>
          <select
            name="service"
            value={formData.service}
            onChange={handleInputChange}
            className="w-full bg-white/10 border-white/20 text-white rounded-md px-3 py-2 focus:border-vizualiza-purple"
          >
            <option value="" className="bg-vizualiza-bg-dark">Selecione um serviço</option>
            <option value="identidade-visual" className="bg-vizualiza-bg-dark">Identidade Visual</option>
            <option value="design-grafico" className="bg-vizualiza-bg-dark">Design Gráfico</option>
            <option value="web-design" className="bg-vizualiza-bg-dark">Web Design</option>
            <option value="fotografia" className="bg-vizualiza-bg-dark">Fotografia</option>
            <option value="consultoria" className="bg-vizualiza-bg-dark">Consultoria</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Orçamento Previsto
        </label>
        <select
          name="budget"
          value={formData.budget}
          onChange={handleInputChange}
          className="w-full bg-white/10 border-white/20 text-white rounded-md px-3 py-2 focus:border-vizualiza-purple"
        >
          <option value="" className="bg-vizualiza-bg-dark">Selecione uma faixa</option>
          <option value="até-5k" className="bg-vizualiza-bg-dark">Até R$ 5.000</option>
          <option value="5k-15k" className="bg-vizualiza-bg-dark">R$ 5.000 - R$ 15.000</option>
          <option value="15k-30k" className="bg-vizualiza-bg-dark">R$ 15.000 - R$ 30.000</option>
          <option value="30k-plus" className="bg-vizualiza-bg-dark">Acima de R$ 30.000</option>
          <option value="conversar" className="bg-vizualiza-bg-dark">Prefiro conversar</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Mensagem *
        </label>
        <Textarea
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
          placeholder="Conte-nos sobre seu projeto, objetivos e expectativas..."
          required
        />
      </div>

      {/* File Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Anexos (Opcional)
        </label>
        <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center hover:border-vizualiza-purple/50 transition-colors">
          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-400 mb-2">
            Arraste arquivos aqui ou clique para selecionar
          </p>
          <p className="text-xs text-gray-500">
            Formatos: JPG, PNG, PDF, DOC (máx. 10MB cada)
          </p>
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
            accept="image/*,.pdf,.doc,.docx"
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="mt-2 border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
            onClick={() => document.getElementById('file-upload')?.click()}
          >
            Selecionar Arquivos
          </Button>
        </div>

        {/* File List */}
        {formData.files.length > 0 && (
          <div className="mt-4 space-y-2">
            {formData.files.map((file, index) => (
              <div key={index} className="flex items-center justify-between bg-white/5 rounded p-3">
                <span className="text-white text-sm">{file.name}</span>
                <Button
                  type="button"
                  onClick={() => removeFile(index)}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-vizualiza-purple hover:bg-vizualiza-purple-dark text-white py-3"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            Enviando...
          </div>
        ) : (
          <>
            <Send className="w-4 h-4 mr-2" />
            Enviar Mensagem
          </>
        )}
      </Button>
    </motion.form>
  );
};

export default ContactFormEnhanced;
