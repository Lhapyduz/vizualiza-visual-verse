import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { supabase } from '@/integrations/supabase/client'; // Import Supabase client
import { Instagram, Heart, MessageCircle, Share2, ExternalLink, Calendar, Music, Palette } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ScrollAnimation from './ScrollAnimation';
import { useSocialMedia } from '@/hooks/useSocialMedia';

// Fetches and displays an Instagram feed.
// This component relies on the `fetch-instagram-feed` Supabase Edge Function.
// Ensure that the Edge Function is deployed and configured with the necessary
// INSTAGRAM_ACCESS_TOKEN environment variable in your Supabase project settings
// for the Instagram feed to work correctly.

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
  const [error, setError] = useState<string | null>(null); // Added error state

  const activeSocialMedias = getActiveSocialMedias();

  // Mock data for other platforms can be kept if needed, or removed entirely
  // const mockPosts: SocialPost[] = [
    // Example for other platforms if you want to mix
    // {
    //   id: 'tiktok1',
    //   platform: 'tiktok',
    //   content: 'Check out this cool TikTok dance!',
    //   image: 'https://via.placeholder.com/300x500.png?text=TikTok+Video',
    //   likes: 1000,
    //   comments: 50,
    //   date: '2024-03-10T12:00:00Z',
    //   url: 'https://tiktok.com/@example',
    //   author: { name: 'TikTok Star', avatar: '/placeholder.svg', handle: '@tiktokstar' }
    // }
  // ];

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
              likes: 0, // Likes/comments not available from basic media endpoint
              comments: 0,
              date: post.timestamp,
              url: post.permalink,
              author: {
                name: 'Vizualiza', // Or your Instagram account name
                avatar: '/icon-192x192.png', // A placeholder or your actual profile pic URL
                handle: '@vizualizaoficial' // Your Instagram handle
              }
            }));
            // If you had other mock posts and want to merge:
            // setPosts(prevPosts => [...instagramPosts, ...prevPosts.filter(p => p.platform !== 'instagram')]);
            // For now, just set Instagram posts
            setPosts(instagramPosts);
          }
        } catch (err: any) {
          console.error("Error fetching Instagram posts:", err);
          setError(err.message || "Falha ao carregar posts do Instagram.");
          setPosts([]); // Clear posts on error
        } finally {
          setIsLoading(false);
        }
      };
      fetchInstagramPosts();
    } else {
      // Handle case where Instagram is not active - e.g., load other mock data or set empty
      // setPosts(mockPosts.filter(p => p.platform !== 'instagram')); // Example if using other mocks
      setPosts([]);
      setIsLoading(false);
    }
  }, [activeSocialMedias]); // Re-run if activeSocialMedias changes

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
        <p className="text-gray-300 mb-4 leading-relaxed line-clamp-3">{post.content}</p> {/* Added line-clamp */}
        
        {post.image && (
          <div className="mb-4 rounded-lg overflow-hidden relative group"> {/* Added relative group */}
            <a href={post.url} target="_blank" rel="noopener noreferrer">
              <LazyLoadImage
                src={post.image}
                alt="Post content"
                className="w-full h-64 object-cover hover:scale-105 transition-transform duration-500"
                effect="blur"
              />
              {post.platform === 'instagram' && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center p-4 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Instagram className="w-10 h-10 text-white mb-2" />
                  {post.content !== 'Visite nosso Instagram para ver mais!' && (
                     <p className="text-white text-sm line-clamp-2">{post.content}</p>
                  )}
                </div>
              )}
            </a>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
          <div className="flex items-center gap-4">
            {post.platform !== 'instagram' ? (
              <>
                <div className="flex items-center">
                  <Heart className="w-4 h-4 mr-1" />
                  {post.likes}
                </div>
                <div className="flex items-center">
                  <MessageCircle className="w-4 h-4 mr-1" />
                  {post.comments}
                </div>
              </>
            ) : (
              <div className="flex items-center"> {/* Placeholder or different stat for IG */}
                 <Instagram className="w-4 h-4 mr-1 text-pink-500" />
                 <span className="text-xs">Ver no Instagram</span>
              </div>
            )}
            {post.platform !== 'instagram' && post.shares && (
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

        {error && (
          <div className="text-center py-16 text-red-500">
            <p>Erro ao carregar o feed: {error}</p>
          </div>
        )}

        {!isLoading && !error && filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Nenhum post encontrado para esta rede social.
            </p>
          </div>
        )}

        {!error && ( // Only render grid if no error
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
