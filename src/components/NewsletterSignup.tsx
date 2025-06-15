
import React, { useState } from 'react';
import { Mail, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const NewsletterSignup = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);

    // Simular chamada de API
    setTimeout(() => {
      // Salvar no localStorage para demonstração
      const subscribers = JSON.parse(localStorage.getItem('newsletter-subscribers') || '[]');
      
      if (!subscribers.includes(email)) {
        subscribers.push(email);
        localStorage.setItem('newsletter-subscribers', JSON.stringify(subscribers));
        
        setIsSubscribed(true);
        toast({
          title: "Inscrição realizada!",
          description: "Você receberá nossas novidades em breve.",
        });
      } else {
        toast({
          title: "Email já cadastrado",
          description: "Este email já está inscrito na nossa newsletter.",
          variant: "destructive"
        });
      }
      
      setIsLoading(false);
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 text-center"
      >
        <Check className="w-12 h-12 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">Obrigado!</h3>
        <p className="text-gray-300">
          Você foi inscrito com sucesso na nossa newsletter.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-vizualiza-purple/10 border border-vizualiza-purple/20 rounded-lg p-6"
    >
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-vizualiza-purple mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-white mb-2">
          Receba Nossas Novidades
        </h3>
        <p className="text-gray-300">
          Inscreva-se na nossa newsletter e fique por dentro dos nossos projetos mais recentes, 
          dicas de design e tendências do mercado.
        </p>
      </div>

      <form onSubmit={handleSubscribe} className="space-y-4">
        <Input
          type="email"
          placeholder="Seu melhor email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
          required
        />
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Inscrevendo...
            </div>
          ) : (
            <>
              <Mail className="w-4 h-4 mr-2" />
              Inscrever-se
            </>
          )}
        </Button>
      </form>

      <p className="text-xs text-gray-400 text-center mt-4">
        Prometemos não enviar spam. Você pode cancelar a inscrição a qualquer momento.
      </p>
    </motion.div>
  );
};

export default NewsletterSignup;
