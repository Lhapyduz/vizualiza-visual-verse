import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Instagram, Heart, MessageCircle, Share2, ExternalLink, Calendar, Music, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrollAnimation from './ScrollAnimation';
import { useSocialMedia } from '@/hooks/useSocialMedia';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'facebook' | 'twitter' | 'youtube' | 'tiktok' | 'behance' | 'dribbble';
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
  const { getActiveSocialMedias, isLoading: socialLoading } = useSocialMedia();
  const [posts, setPosts] = useState<SocialPost[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  const activeSocialMedias = getActiveSocialMedias();

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
      url: 'https://instagram.com/vizualizaoficial',
      author: {
        name: 'Vizualiza Visual Verse',
        avatar: 'https://images.unsplash.com/photo-1586953209889-5ce391d8cd9b?w=100&h=100&fit=crop',
        handle: '@vizualizaoficial'
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
      case 'tiktok':
        return <Music className="w-5 h-5" />;
      case 'behance':
        return <Palette className="w-5 h-5" />;
      default:
        return <Share2 className="w-5 h-5" />;
    }
  };

  const getPlatformColor = (platform: string) => {
    const socialMedia = activeSocialMedias.find(sm => sm.platform.toLowerCase() === platform);
    if (socialMedia) {
      return socialMedia.color;
    }
    
    switch (platform) {
      case 'instagram':
        return 'from-purple-600 to-pink-600';
      case 'tiktok':
        return 'from-black to-gray-800';
      case 'behance':
        return 'from-blue-500 to-blue-600';
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

  if (isLoading || socialLoading) {
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

  if (activeSocialMedias.length === 0) {
    return (
      <section className="py-20 px-4 bg-vizualiza-bg-dark">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="text-white">Nossas </span>
            <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Redes Sociais</span>
          </h2>
          <p className="text-xl text-gray-300">
            Nenhuma rede social configurada ainda.
          </p>
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
            <TabsList className="grid w-full max-w-md mx-auto bg-white/5" style={{ gridTemplateColumns: `repeat(${Math.min(activeSocialMedias.length + 1, 4)}, 1fr)` }}>
              <TabsTrigger value="all" className="data-[state=active]:bg-vizualiza-purple">
                Todos
              </TabsTrigger>
              {activeSocialMedias.slice(0, 3).map((social) => (
                <TabsTrigger 
                  key={social.id} 
                  value={social.platform.toLowerCase()} 
                  className="data-[state=active]:bg-vizualiza-purple"
                >
                  {social.platform}
                </TabsTrigger>
              ))}
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
            <div className="flex flex-wrap justify-center gap-4">
              {activeSocialMedias.map((social) => (
                <Button
                  key={social.id}
                  onClick={() => window.open(social.url, '_blank')}
                  className={`bg-gradient-to-r ${social.color} hover:opacity-80`}
                >
                  {getPlatformIcon(social.platform.toLowerCase())}
                  <span className="ml-2">{social.platform}</span>
                </Button>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default SocialFeed;
