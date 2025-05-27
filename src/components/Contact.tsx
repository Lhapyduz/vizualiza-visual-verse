
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simular envio do formulário
    console.log('Formulário enviado:', formData);
    
    toast({
      title: "Mensagem enviada!",
      description: "Obrigado pelo contato. Retornaremos em breve!",
    });

    // Limpar formulário
    setFormData({ name: '', email: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email',
      info: 'gregory@vizualiza.com',
      link: 'mailto:contato@vizualiza.com'
    },
    {
      icon: Phone,
      title: 'Telefone',
      info: '(41) 99561-8116',
      link: 'tel:+5541995618116'
    },
    {
      icon: MapPin,
      title: 'Localização',
      info: 'Guaratuba, PR - Brasil',
      link: 'https://www.google.com/maps/place/Vizualiza+-+Comunica%C3%A7%C3%A3o+Visual/@-25.8800052,-48.6130187,18.75z/data=!4m6!3m5!1s0x94dbf100140036e5:0xef76dad73bac1ea3!8m2!3d-25.8800493!4d-48.6131598!16s%2Fg%2F11wqr_44zf?authuser=0&entry=ttu&g_ep=EgoyMDI1MDUyMS4wIKXMDSoASAFQAw%3D%3D'
    }
  ];

  return (
    <section id="contact" className="py-20 px-4 bg-vizualiza-bg-light">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Entre em </span>
            <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Contato</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Vamos conversar sobre seu próximo projeto e criar algo incrível juntos.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Informações de Contato</h3>
            
            <div className="space-y-6 mb-8">
              {contactInfo.map((item, index) => (
                <div key={item.title} className="flex items-center space-x-4 group">
                  <div className="w-12 h-12 bg-vizualiza-purple/20 rounded-lg flex items-center justify-center group-hover:bg-vizualiza-purple/30 transition-colors duration-300">
                    <item.icon className="w-6 h-6 text-vizualiza-purple" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">{item.title}</h4>
                    <a 
                      href={item.link}
                      className="text-gray-400 hover:text-vizualiza-purple transition-colors duration-300"
                    >
                      {item.info}
                    </a>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gradient-to-r from-vizualiza-purple/20 to-vizualiza-orange/20 p-6 rounded-lg backdrop-blur-sm">
              <h4 className="text-white font-semibold mb-3">Horário de Atendimento</h4>
              <p className="text-gray-300">
                Todos os dias
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-8">Envie uma Mensagem</h3>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Input
                  type="text"
                  name="name"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-vizualiza-purple"
                />
              </div>
              
              <div>
                <Input
                  type="email"
                  name="email"
                  placeholder="Seu email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-vizualiza-purple"
                />
              </div>
              
              <div>
                <Textarea
                  name="message"
                  placeholder="Conte-nos sobre seu projeto..."
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-vizualiza-purple resize-none"
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-vizualiza-purple hover:bg-vizualiza-purple-dark text-white py-3 text-lg hover:scale-105 transition-all duration-300"
              >
                <Send className="w-5 h-5 mr-2" />
                Enviar Mensagem
              </Button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
