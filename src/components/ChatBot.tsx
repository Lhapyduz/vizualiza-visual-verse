
import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Olá! Sou o assistente virtual da Vizualiza. Como posso te ajudar hoje?',
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const botResponses = {
    greeting: ['olá', 'oi', 'bom dia', 'boa tarde', 'boa noite'],
    services: ['serviços', 'serviço', 'trabalho', 'fazem', 'oferecem'],
    portfolio: ['portfólio', 'portfolio', 'projetos', 'trabalhos'],
    contact: ['contato', 'telefone', 'email', 'whatsapp'],
    price: ['preço', 'valor', 'orçamento', 'custo', 'quanto custa']
  };

  const getResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (botResponses.greeting.some(word => lowerInput.includes(word))) {
      return 'Olá! É um prazer falar com você. Estou aqui para esclarecer suas dúvidas sobre nossos serviços de design. O que gostaria de saber?';
    }
    
    if (botResponses.services.some(word => lowerInput.includes(word))) {
      return 'Oferecemos serviços de Identidade Visual, Design Gráfico, Web Design e Fotografia. Criamos soluções completas para sua marca se destacar no mercado. Gostaria de saber mais sobre algum serviço específico?';
    }
    
    if (botResponses.portfolio.some(word => lowerInput.includes(word))) {
      return 'Você pode conferir nosso portfólio na seção "Portfólio" do site. Lá você encontra projetos de identidade visual, design gráfico, web design e fotografia. Cada projeto mostra nossa experiência e qualidade!';
    }
    
    if (botResponses.contact.some(word => lowerInput.includes(word))) {
      return 'Para entrar em contato conosco, você pode usar o formulário na seção "Contato" do site, ou nos seguir nas redes sociais. Respondemos rapidamente a todas as mensagens!';
    }
    
    if (botResponses.price.some(word => lowerInput.includes(word))) {
      return 'Nossos preços variam conforme o escopo do projeto. Oferecemos orçamentos personalizados para cada cliente. Entre em contato conosco através da seção "Contato" para receber um orçamento gratuito!';
    }
    
    return 'Interessante! Para informações mais específicas, recomendo entrar em contato através do formulário no site. Nossa equipe pode te ajudar com detalhes sobre projetos, prazos e orçamentos. Há algo mais em que posso te ajudar?';
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simular delay de digitação
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getResponse(inputValue),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-vizualiza-purple hover:bg-vizualiza-purple-dark shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.8 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-40 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-vizualiza-purple text-white p-4 flex items-center gap-3">
              <Bot className="w-6 h-6" />
              <div>
                <h3 className="font-semibold">Assistente Vizualiza</h3>
                <p className="text-xs opacity-90">Online agora</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex items-start gap-2 max-w-[80%] ${
                    message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
                  }`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.sender === 'user' 
                        ? 'bg-vizualiza-purple text-white' 
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`rounded-lg p-3 ${
                      message.sender === 'user'
                        ? 'bg-vizualiza-purple text-white'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                      <Bot className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite sua mensagem..."
                  className="flex-1"
                />
                <Button
                  onClick={sendMessage}
                  disabled={!inputValue.trim()}
                  size="icon"
                  className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;
