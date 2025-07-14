
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { supabase } from '@/integrations/supabase/client';
import { Instagram, Heart, MessageCircle, Share2, ExternalLink, Calendar, Music, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrollAnimation from './ScrollAnimation';
import { GlassmorphismCard, FloatingCard } from './MicroInteractions';
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
  const [error, setError] = useState<string | null>(null);

  const activeSocialMedias = getActiveSocialMedias();

  useEffect(() => {
    const instagramIsActive = activeSocialMedias.some(sm => sm.platform.toLowerCase() === 'instagram');

    if (instagramIsActive) {
      const fetchInstagramPosts = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const { data: fetchedPosts, error: functionError } = await supabase.functions.invoke('fetch-instagram-feed');

          if (functionError) {
            throw functionError;
          }

          if (fetchedPosts) {
            const instagramPosts: SocialPost[] = fetchedPosts.map((post: any) => ({
              id: post.id,
              platform: 'instagram',
              content: post.caption || 'Visite nosso Instagram para ver mais!',
              image: post.media_url,
              likes: 0,
              comments: 0,
              date: post.timestamp,
              url: post.permalink,
              author: {
                name: 'Vizualiza',
                avatar: '/icon-192x192.png',
                handle: '@vizualizaoficial'
              }
            }));
            setPosts(instagramPosts);
          }
        } catch (err: any) {
          console.error("Error fetching Instagram posts:", err);
          setError(err.message || "Falha ao carregar posts do Instagram.");
          setPosts([]);
        } finally {
          setIsLoading(false);
        }
      };
      
      // Fetch inicial
      fetchInstagramPosts();
      
      // Atualizar feed a cada 5 minutos para posts em tempo real
      const interval = setInterval(fetchInstagramPosts, 5 * 60 * 1000);
      
      return () => clearInterval(interval);
    } else {
      setPosts([]);
      setIsLoading(false);
    }
  }, [activeSocialMedias]);

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
    <FloatingCard className="h-full">
      <GlassmorphismCard 
        intensity="medium" 
        className="h-full flex flex-col overflow-hidden hover:border-white/30 transition-all duration-300"
      >
        {/* Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LazyLoadImage
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
                effect="blur"
              />
              <div>
                <h4 className="text-white font-medium">{post.author.name}</h4>
                <p className="text-gray-400 text-sm">{post.author.handle}</p>
              </div>
            </div>
            <motion.div 
              className={`p-2 rounded-full bg-gradient-to-r ${getPlatformColor(post.platform)}`}
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              {getPlatformIcon(post.platform)}
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 flex flex-col">
          <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3 flex-shrink-0">
            {post.content}
          </p>
          
          {post.image && (
            <div className="mb-4 rounded-lg overflow-hidden relative group flex-1">
              <motion.a 
                href={post.url} 
                target="_blank" 
                rel="noopener noreferrer"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <LazyLoadImage
                  src={post.image}
                  alt="Post content"
                  className="w-full h-full min-h-[200px] object-cover transition-transform duration-500 group-hover:scale-110"
                  effect="blur"
                />
                {post.platform === 'instagram' && (
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  >
                    <motion.div
                      initial={{ scale: 0.8, y: 20 }}
                      whileHover={{ scale: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Instagram className="w-12 h-12 text-white mb-3" />
                      <p className="text-white text-sm font-medium">Ver no Instagram</p>
                    </motion.div>
                  </motion.div>
                )}
              </motion.a>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between text-sm text-gray-400 mb-4 flex-shrink-0">
            <div className="flex items-center gap-4">
              {post.platform !== 'instagram' ? (
                <>
                  <motion.div 
                    className="flex items-center hover:text-red-400 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </motion.div>
                  <motion.div 
                    className="flex items-center hover:text-blue-400 transition-colors duration-200"
                    whileHover={{ scale: 1.05 }}
                  >
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.comments}
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <Instagram className="w-4 h-4 mr-1 text-pink-500" />
                  <span className="text-xs">Ver no Instagram</span>
                </motion.div>
              )}
            </div>
            <div className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {new Date(post.date).toLocaleDateString('pt-BR')}
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-red-400 hover:bg-red-400/10"
            >
              <Heart className="w-4 h-4 mr-1" />
              Curtir
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-blue-400 hover:bg-blue-400/10"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Comentar
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-gray-400 hover:text-vizualiza-purple hover:bg-vizualiza-purple/10"
              onClick={() => window.open(post.url, '_blank')}
            >
              <ExternalLink className="w-4 h-4 mr-1" />
              Ver original
            </Button>
          </div>
        </div>
      </GlassmorphismCard>
    </FloatingCard>
  );

  if (isLoading || socialLoading) {
    return (
      <section className="py-20 px-4 bg-vizualiza-bg-dark">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <motion.div
              className="animate-spin rounded-full h-16 w-16 border-b-2 border-vizualiza-purple mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
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
            <TabsList className="grid w-full max-w-md mx-auto bg-white/5 backdrop-blur-md border border-white/10" style={{ gridTemplateColumns: `repeat(${Math.min(activeSocialMedias.length + 1, 4)}, 1fr)` }}>
              <TabsTrigger value="all" className="data-[state=active]:bg-vizualiza-purple data-[state=active]:text-white">
                Todos
              </TabsTrigger>
              {activeSocialMedias.slice(0, 3).map((social) => (
                <TabsTrigger 
                  key={social.id} 
                  value={social.platform.toLowerCase()} 
                  className="data-[state=active]:bg-vizualiza-purple data-[state=active]:text-white"
                >
                  {social.platform}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </ScrollAnimation>

        {error && (
          <motion.div 
            className="text-center py-16 text-red-400"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>Erro ao carregar o feed: {error}</p>
          </motion.div>
        )}

        {!isLoading && !error && filteredPosts.length === 0 && (
          <motion.div 
            className="text-center py-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-gray-400 text-lg">
              Nenhum post encontrado para esta rede social.
            </p>
          </motion.div>
        )}

        {!error && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence>
              {filteredPosts.map((post, index) => (
                <ScrollAnimation key={post.id} direction="up" delay={index * 0.1}>
                  <SocialPostCard post={post} />
                </ScrollAnimation>
              ))}
            </AnimatePresence>
          </div>
        )}

        {/* Social Links */}
        <ScrollAnimation direction="up" delay={0.4}>
          <div className="mt-16 text-center">
            <h3 className="text-2xl font-bold text-white mb-6">Siga-nos</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {activeSocialMedias.map((social) => (
                <motion.div key={social.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button
                    onClick={() => window.open(social.url, '_blank')}
                    className={`bg-gradient-to-r ${social.color} hover:opacity-80 border border-white/20 backdrop-blur-sm`}
                  >
                    {getPlatformIcon(social.platform.toLowerCase())}
                    <span className="ml-2">{social.platform}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default SocialFeed;
