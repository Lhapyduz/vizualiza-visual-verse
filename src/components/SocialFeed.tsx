
import React, { useState } from 'react';
import { Instagram, Linkedin, ExternalLink, Heart, MessageCircle } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import ScrollAnimation from './ScrollAnimation';

interface SocialPost {
  id: string;
  platform: 'instagram' | 'linkedin';
  content: string;
  image?: string;
  date: string;
  likes: number;
  comments: number;
  link: string;
}

const SocialFeed = () => {
  const [selectedPlatform, setSelectedPlatform] = useState<'all' | 'instagram' | 'linkedin'>('all');

  const mockSocialPosts: SocialPost[] = [
    {
      id: '1',
      platform: 'instagram',
      content: 'Novo projeto de identidade visual para uma cafeteria artesanal! ☕️ Que cores vocês acham que combinam mais com café? #design #identidadevisual #branding',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop',
      date: '2024-01-15',
      likes: 127,
      comments: 23,
      link: 'https://instagram.com/vizualiza'
    },
    {
      id: '2',
      platform: 'linkedin',
      content: 'A importância da consistência visual no branding: como pequenos detalhes fazem toda a diferença na percepção da marca.',
      date: '2024-01-14',
      likes: 89,
      comments: 12,
      link: 'https://linkedin.com/company/vizualiza'
    },
    {
      id: '3',
      platform: 'instagram',
      content: 'Behind the scenes: processo criativo para desenvolvimento de logo. Cada traço tem um propósito! 🎨 #designprocess #logo #criatividade',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=400&fit=crop',
      date: '2024-01-12',
      likes: 203,
      comments: 34,
      link: 'https://instagram.com/vizualiza'
    },
    {
      id: '4',
      platform: 'linkedin',
      content: 'Dica profissional: Como apresentar propostas de design que vendem? A comunicação é tão importante quanto a criação.',
      date: '2024-01-10',
      likes: 156,
      comments: 28,
      link: 'https://linkedin.com/company/vizualiza'
    }
  ];

  const filteredPosts = selectedPlatform === 'all' 
    ? mockSocialPosts 
    : mockSocialPosts.filter(post => post.platform === selectedPlatform);

  const PlatformIcon = ({ platform }: { platform: 'instagram' | 'linkedin' }) => {
    return platform === 'instagram' ? (
      <Instagram className="w-5 h-5" />
    ) : (
      <Linkedin className="w-5 h-5" />
    );
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-br from-vizualiza-bg-light to-vizualiza-bg-dark">
      <div className="max-w-6xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Redes </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Sociais</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Acompanhe nosso trabalho e dicas de design nas redes sociais.
            </p>
          </div>
        </ScrollAnimation>

        {/* Platform Filter */}
        <ScrollAnimation direction="up" delay={0.2}>
          <div className="flex justify-center mb-8">
            <div className="bg-white/5 p-1 rounded-lg backdrop-blur-sm border border-white/10">
              <Button
                onClick={() => setSelectedPlatform('all')}
                variant={selectedPlatform === 'all' ? 'default' : 'ghost'}
                className={`mr-1 ${
                  selectedPlatform === 'all'
                    ? 'bg-vizualiza-purple text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Todos
              </Button>
              <Button
                onClick={() => setSelectedPlatform('instagram')}
                variant={selectedPlatform === 'instagram' ? 'default' : 'ghost'}
                className={`mr-1 ${
                  selectedPlatform === 'instagram'
                    ? 'bg-vizualiza-purple text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Instagram className="w-4 h-4 mr-2" />
                Instagram
              </Button>
              <Button
                onClick={() => setSelectedPlatform('linkedin')}
                variant={selectedPlatform === 'linkedin' ? 'default' : 'ghost'}
                className={`${
                  selectedPlatform === 'linkedin'
                    ? 'bg-vizualiza-purple text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Linkedin className="w-4 h-4 mr-2" />
                LinkedIn
              </Button>
            </div>
          </div>
        </ScrollAnimation>

        {/* Social Posts Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredPosts.map((post, index) => (
            <ScrollAnimation key={post.id} direction="up" delay={index * 0.1}>
              <motion.article
                className="bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                whileHover={{ scale: 1.02 }}
              >
                {post.image && (
                  <div className="relative">
                    <LazyLoadImage
                      src={post.image}
                      alt="Social media post"
                      className="w-full h-64 object-cover"
                      effect="blur"
                    />
                    <div className="absolute top-4 left-4">
                      <div className={`p-2 rounded-full ${
                        post.platform === 'instagram' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'bg-blue-600'
                      }`}>
                        <PlatformIcon platform={post.platform} />
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="p-6">
                  {!post.image && (
                    <div className="flex items-center mb-4">
                      <div className={`p-2 rounded-full mr-3 ${
                        post.platform === 'instagram' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                          : 'bg-blue-600'
                      }`}>
                        <PlatformIcon platform={post.platform} />
                      </div>
                      <span className="text-gray-300 font-medium capitalize">
                        {post.platform}
                      </span>
                    </div>
                  )}
                  
                  <p className="text-gray-300 mb-4 leading-relaxed">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                    <span>{new Date(post.date).toLocaleDateString('pt-BR')}</span>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Heart className="w-4 h-4 mr-1" />
                        {post.likes}
                      </div>
                      <div className="flex items-center">
                        <MessageCircle className="w-4 h-4 mr-1" />
                        {post.comments}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    asChild
                    variant="outline"
                    className="w-full border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
                  >
                    <a 
                      href={post.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex items-center justify-center"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Ver no {post.platform === 'instagram' ? 'Instagram' : 'LinkedIn'}
                    </a>
                  </Button>
                </div>
              </motion.article>
            </ScrollAnimation>
          ))}
        </div>

        {/* Call to Action */}
        <ScrollAnimation direction="up" delay={0.4}>
          <div className="text-center mt-12">
            <p className="text-gray-300 mb-6">
              Siga-nos nas redes sociais para mais conteúdo sobre design!
            </p>
            <div className="flex justify-center space-x-4">
              <Button
                asChild
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <a href="https://instagram.com/vizualiza" target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-5 h-5 mr-2" />
                  Instagram
                </a>
              </Button>
              <Button
                asChild
                className="bg-blue-600 hover:bg-blue-700"
              >
                <a href="https://linkedin.com/company/vizualiza" target="_blank" rel="noopener noreferrer">
                  <Linkedin className="w-5 h-5 mr-2" />
                  LinkedIn
                </a>
              </Button>
            </div>
          </div>
        </ScrollAnimation>
      </div>
    </section>
  );
};

export default SocialFeed;
