
import React from 'react';
import { Clock, Calendar, User, ArrowRight } from 'lucide-react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface RelatedPost {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
}

interface RelatedPostsProps {
  currentPostId: string;
  currentCategory?: string;
  onPostClick: (post: RelatedPost) => void;
}

const RelatedPosts = ({ currentPostId, currentCategory, onPostClick }: RelatedPostsProps) => {
  const mockRelatedPosts: RelatedPost[] = [
    {
      id: '2',
      title: 'Como Escolher as Cores Certas para sua Marca',
      excerpt: 'A psicologia das cores no branding e como aplicá-la estrategicamente.',
      image: 'https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=400&h=300&fit=crop',
      category: 'Design',
      date: '2024-01-10',
      author: 'Gregory Vizualiza',
      readTime: '7 min'
    },
    {
      id: '3',
      title: 'Tendências de Web Design para 2024',
      excerpt: 'As principais tendências que estão moldando o design digital este ano.',
      image: 'https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=400&h=300&fit=crop',
      category: 'Web Design',
      date: '2024-01-08',
      author: 'Gregory Vizualiza',
      readTime: '6 min'
    },
    {
      id: '4',
      title: 'O Poder do Storytelling Visual',
      excerpt: 'Como contar histórias através do design e criar conexão emocional.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop',
      category: 'Branding',
      date: '2024-01-05',
      author: 'Gregory Vizualiza',
      readTime: '8 min'
    }
  ];

  // Filter out current post and prioritize same category
  const relatedPosts = mockRelatedPosts
    .filter(post => post.id !== currentPostId)
    .sort((a, b) => {
      if (currentCategory) {
        if (a.category === currentCategory && b.category !== currentCategory) return -1;
        if (b.category === currentCategory && a.category !== currentCategory) return 1;
      }
      return 0;
    })
    .slice(0, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <div className="mt-12 pt-8 border-t border-white/10">
      <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
        <ArrowRight className="w-6 h-6 text-vizualiza-purple mr-2" />
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
            onClick={() => onPostClick(post)}
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
            </div>
            
            <div className="p-4">
              <div className="flex items-center text-xs text-gray-400 mb-2 space-x-3">
                <div className="flex items-center">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(post.date).toLocaleDateString('pt-BR')}
                </div>
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {post.readTime}
                </div>
              </div>
              
              <h4 className="text-white font-semibold mb-2 group-hover:text-vizualiza-purple transition-colors line-clamp-2">
                {post.title}
              </h4>
              
              <p className="text-gray-400 text-sm line-clamp-2 mb-3">
                {post.excerpt}
              </p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center text-xs text-gray-400">
                  <User className="w-3 h-3 mr-1" />
                  {post.author}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-vizualiza-purple hover:text-white hover:bg-vizualiza-purple p-1 h-auto"
                >
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
