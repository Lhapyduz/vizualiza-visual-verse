
import React from 'react';
import { motion } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  readTime: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  currentCategory: string;
  currentTags?: string[];
  onPostClick?: (post: RelatedPost) => void;
}

const RelatedPosts = ({ currentPostId, currentCategory, currentTags = [], onPostClick }: RelatedPostsProps) => {
  // Mock data - em produção, isso viria de uma API ou hook
  const allPosts: RelatedPost[] = [
    {
      id: '1',
      title: 'Tendências de Design para 2024',
      excerpt: 'Descubra as principais tendências que moldarão o design visual em 2024.',
      image: 'https://images.unsplash.com/photo-1586953209889-5ce391d8cd9b?w=400&h=250&fit=crop',
      category: 'Design',
      date: '2024-01-10',
      readTime: '6 min'
    },
    {
      id: '2',
      title: 'Como Criar uma Identidade Visual Marcante',
      excerpt: 'Guia completo para desenvolver uma identidade visual que se destaque no mercado.',
      image: 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=250&fit=crop',
      category: 'Branding',
      date: '2024-01-08',
      readTime: '8 min'
    },
    {
      id: '3',
      title: 'UX/UI: Princípios Fundamentais',
      excerpt: 'Os princípios essenciais para criar interfaces intuitivas e atrativas.',
      image: 'https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?w=400&h=250&fit=crop',
      category: 'UX/UI',
      date: '2024-01-05',
      readTime: '7 min'
    },
    {
      id: '4',
      title: 'Psicologia das Cores no Design',
      excerpt: 'Como as cores influenciam o comportamento e as emoções dos usuários.',
      image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?w=400&h=250&fit=crop',
      category: 'Design',
      date: '2024-01-03',
      readTime: '5 min'
    }
  ];

  // Filtrar posts relacionados
  const getRelatedPosts = (): RelatedPost[] => {
    return allPosts
      .filter(post => post.id !== currentPostId)
      .sort((a, b) => {
        // Priorizar posts da mesma categoria
        const aScore = a.category === currentCategory ? 2 : 0;
        const bScore = b.category === currentCategory ? 2 : 0;
        
        // Adicionar pontos por tags compartilhadas (simulado)
        const aTagScore = Math.random() > 0.5 ? 1 : 0;
        const bTagScore = Math.random() > 0.5 ? 1 : 0;
        
        return (bScore + bTagScore) - (aScore + aTagScore);
      })
      .slice(0, 3);
  };

  const relatedPosts = getRelatedPosts();

  const handlePostClick = (post: RelatedPost) => {
    if (onPostClick) {
      onPostClick(post);
    } else {
      // Fallback: scroll to top and log
      window.scrollTo({ top: 0, behavior: 'smooth' });
      console.log('Navigate to post:', post.id);
    }
  };

  if (relatedPosts.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 border-t border-white/10 pt-8">
      <h3 className="text-2xl font-bold text-white mb-6">
        Posts Relacionados
      </h3>
      
      <div className="grid md:grid-cols-3 gap-6">
        {relatedPosts.map((post, index) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer"
            onClick={() => handlePostClick(post)}
          >
            <div className="relative overflow-hidden">
              <LazyLoadImage
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                effect="blur"
              />
              <div className="absolute top-3 left-3">
                <span className="bg-vizualiza-orange text-white text-xs font-medium px-2 py-1 rounded-full">
                  {post.category}
                </span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-4 mb-3 text-xs text-gray-400">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
              
              <h4 className="text-white font-semibold mb-2 group-hover:text-vizualiza-purple transition-colors duration-300 line-clamp-2">
                {post.title}
              </h4>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                {post.excerpt}
              </p>
              
              <Button
                variant="ghost"
                size="sm"
                className="text-vizualiza-purple hover:text-white hover:bg-vizualiza-purple/20 p-0 h-auto font-medium group"
              >
                Ler mais
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
