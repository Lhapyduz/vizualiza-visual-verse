
import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const VoiceCommands = () => {
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificar se o navegador suporta Web Speech API
    const SpeechRecognitionConstructor = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognitionConstructor) {
      setIsSupported(true);
      const recognitionInstance = new SpeechRecognitionConstructor();
      
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'pt-BR';

      recognitionInstance.onstart = () => {
        setIsListening(true);
        toast({
          title: "Escutando...",
          description: "Diga um comando de voz",
        });
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      recognitionInstance.onresult = (event: SpeechRecognitionEvent) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
      };

      recognitionInstance.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsListening(false);
        toast({
          title: "Erro no reconhecimento",
          description: "Não foi possível processar o comando de voz",
          variant: "destructive"
        });
      };

      setRecognition(recognitionInstance);
    }
  }, []);

  const handleVoiceCommand = (command: string) => {
    console.log('Comando de voz:', command);

    // Comandos de navegação
    if (command.includes('início') || command.includes('home')) {
      document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para o início');
    } else if (command.includes('sobre')) {
      document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para a seção sobre');
    } else if (command.includes('portfólio') || command.includes('portfolio')) {
      document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para o portfólio');
    } else if (command.includes('blog')) {
      document.getElementById('blog')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para o blog');
    } else if (command.includes('contato')) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      speak('Navegando para a seção de contato');
    } else if (command.includes('help') || command.includes('ajuda')) {
      speak('Comandos disponíveis: início, sobre, portfólio, blog, contato');
    } else {
      speak('Comando não reconhecido. Diga "ajuda" para ver os comandos disponíveis');
    }

    toast({
      title: "Comando processado",
      description: `"${command}"`,
    });
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.9;
      speechSynthesis.speak(utterance);
    }
  };

  const startListening = () => {
    if (recognition) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition) {
      recognition.stop();
    }
  };

  if (!isSupported) {
    return null; // Não exibir se não há suporte
  }

  return (
    <div className="fixed bottom-6 left-6 z-50">
      <Button
        onClick={isListening ? stopListening : startListening}
        className={`w-14 h-14 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-red-500 hover:bg-red-600 animate-pulse'
            : 'bg-vizualiza-orange hover:bg-vizualiza-orange/80'
        }`}
        title={isListening ? 'Parar reconhecimento de voz' : 'Iniciar comando de voz'}
      >
        {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
      </Button>
      
      {/* Indicador visual quando está escutando */}
      {isListening && (
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
      )}
    </div>
  );
};

export default VoiceCommands;
