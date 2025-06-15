
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Instagram, Linkedin, Heart, MessageCircle, Share2, ExternalLink, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrollAnimation from './ScrollAnimation';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'linkedin';
  content: string;
  image?: string;
  likes: number;
  comments: number;
  shares?: number;
  date: string;
  url: string;
  author: {
    name: string;
    avatar: string;
    handle: string;
  };
}

const SocialFeed = () => {
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Mock data - em produção, isso viria de APIs das redes sociais
  const mockPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'instagram',
      content: 'Novo projeto de identidade visual para startup de tecnologia! 🚀 O desafio era criar algo moderno, confiável e que transmitisse inovação. #design #identidadevisual #branding',
      image: 'https://images.unsplash.com/photo-1586953209889-5ce391d8cd9b?w=500&h=500&fit=crop',
      likes: 127,
      comments: 23,
      date: '2024-01-15T10:30:00Z',
      url: 'https://instagram.com/p/example1',
      author: {
        name: 'Vizualiza Visual Verse',
        avatar: 'https://images.unsplash.com/photo-1586953209889-5ce391d8cd9b?w=100&h=100&fit=crop',
        handle: '@vizualiza'
      }
    },
    {
      id: '2',
      platform: 'linkedin',
      content: 'Como a psicologia das cores pode transformar a percepção da sua marca? Compartilho alguns insights sobre a importância estratégica das cores no branding.',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=500&h=300&fit=crop',
      likes: 89,
      comments: 12,
      shares: 34,
      date: '2024-01-14T16:45:00Z',
      url: 'https://linkedin.com/post/example2',
      author: {
        name: 'Gregory Vizualiza',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        handle: 'gregory-vizualiza'
      }
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'Process design em ação! Do sketches iniciais até o resultado final. Cada etapa tem sua importância na criação de uma identidade marcante. ✨',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=500&fit=crop',
      likes: 203,
      comments: 41,
      date: '2024-01-13T14:20:00Z',
      url: 'https://instagram.com/p/example3',
      author: {
        name: 'Vizualiza Visual Verse',
        avatar: 'https://images.unsplash.com/photo-1586953209889-5ce391d8cd9b?w=100&h=100&fit=crop',
        handle: '@vizualiza'
      }
    },
    {
      id: '4',
      platform: 'linkedin',
      content: 'Tendências de UX/UI para 2024: Minimalismo funcional, micro-interações inteligentes e design inclusivo estão moldando o futuro das interfaces digitais.',
      likes: 156,
      comments: 28,
      shares: 67,
      date: '2024-01-12T09:15:00Z',
      url: 'https://linkedin.com/post/example4',
      author: {
        name: 'Gregory Vizualiza',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop',
        handle: 'gregory-vizualiza'
      }
    }
  ];

  useEffect(() => {
    // Simular carregamento
    const timer = setTimeout(() => {
      setPosts(mockPosts);
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const filteredPosts = activeTab === 'all' 
    ? posts 
    : posts.filter(post => post.platform === activeTab);

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return <Instagram className="w-5 h-5" />;
      case 'linkedin':
        return <Linkedin className="w-5 h-5" />;
      default:
        return <Share2 className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    switch (platform) {
      case 'instagram':
        return 'from-purple-600 to-pink-600';
      case 'linkedin':
        return 'from-blue-600 to-blue-800';
      default:
        return 'from-gray-600 to-gray-800';
    }
  };

  const SocialPostCard = ({ post }: { post: SocialPost }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <LazyLoadImage
              src={post.author.avatar}
              alt={post.author.name}
              className="w-10 h-10 rounded-full object-cover"
              effect="blur"
            />
            <div>
              <h4 className="text-white font-medium">{post.author.name}</h4>
              <p className="text-gray-400 text-sm">{post.author.handle}</p>
            </div>
          </div>
          <div className={`p-2 rounded-full bg-gradient-to-r ${getPlatformColor(post.platform)}`}>
            {getPlatformIcon(post.platform)}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <p className="text-gray-300 mb-4 leading-relaxed">{post.content}</p>
        
        {post.image && (
          <div className="mb-4 rounded-lg overflow-hidden">
            <LazyLoadImage
              src={post.image}
              alt="Post content"
              className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
              effect="blur"
            />
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Heart className="w-4 h-4 mr-1" />
              {post.likes}
            </div>
            <div className="flex items-center">
              <MessageCircle className="w-4 h-4 mr-1" />
              {post.comments}
            </div>
            {post.shares && (
              <div className="flex items-center">
                <Share2 className="w-4 h-4 mr-1" />
                {post.shares}
              </div>
            )}
          </div>
          <div className="flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            {new Date(post.date).toLocaleDateString('pt-BR')}
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-red-400"
          >
            <Heart className="w-4 h-4 mr-1" />
            Curtir
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-blue-400"
          >
            <MessageCircle className="w-4 h-4 mr-1" />
            Comentar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-400 hover:text-vizualiza-purple"
            onClick={() => window.open(post.url, '_blank')}
          >
            <ExternalLink className="w-4 h-4 mr-1" />
            Ver original
          </Button>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <section className="py-20 px-4 bg-vizualiza-bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-vizualiza-purple mx-auto mb-4"></div>
            <p className="text-gray-400">Carregando feed social...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 px-4 bg-vizualiza-bg-dark">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-white">Nossas </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Redes Sociais</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Acompanhe nossos projetos e insights nas redes sociais. 
              Fique por dentro das últimas tendências e bastidores do nosso trabalho.
            </p>
          </div>
        </ScrollAnimation>

        <ScrollAnimation direction="up" delay={0.2}>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-white/5">
              <TabsTrigger value="all" className="data-[state=active]:bg-vizualiza-purple">
                Todos
              </TabsTrigger>
              <TabsTrigger value="instagram" className="data-[state=active]:bg-vizualiza-purple">
                Instagram
              </TabsTrigger>
              <TabsTrigger value="linkedin" className="data-[state=active]:bg-vizualiza-purple">
                LinkedIn
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </ScrollAnimation>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredPosts.map((post, index) => (
              <ScrollAnimation key={post.id} direction="up" delay={index * 0.1}>
                <SocialPostCard post={post} />
              </ScrollAnimation>
            ))}
          </AnimatePresence>
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Nenhum post encontrado para esta rede social.
            </p>
          </div>
        )}

        {/* Social Links */}
        <ScrollAnimation direction="up" delay={0.4}>
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Siga-nos</h3>
            <div className="flex justify-center gap-6">
              <Button
                onClick={() => window.open('https://instagram.com/vizualiza', '_blank')}
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Instagram className="w-5 h-5 mr-2" />
                Instagram
              </Button>
              <Button
                onClick={() => window.open('https://linkedin.com/company/vizualiza', '_blank')}
                className="bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
              >
                <Linkedin className="w-5 h-5 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default SocialFeed;
