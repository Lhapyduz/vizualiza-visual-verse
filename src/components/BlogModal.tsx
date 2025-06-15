
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, User, Clock, Tag, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import SocialShare from './SocialShare';
import BlogComments from './BlogComments';
import RelatedPosts from './RelatedPosts';
import SEOHead from './SEOHead';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

interface BlogModalProps {
  post: BlogPost;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (post: BlogPost) => void;
}

const BlogModal: React.FC<BlogModalProps> = ({ 
  post, 
  isOpen, 
  onClose, 
  isAdmin = false, 
  onEdit 
}) => {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(post);
      onClose();
    }
  };

  const handleRelatedPostClick = (relatedPost: any) => {
    // Em uma implementação real, isso abriria o post relacionado
    console.log('Navigate to related post:', relatedPost.id);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* SEO específico para o post */}
          <SEOHead
            title={`${post.title} | Vizualiza Visual Verse`}
            description={post.excerpt}
            type="article"
            author={post.author}
            publishedTime={post.date}
            section={post.category}
            tags={post.tags}
            image={post.image}
            url={`${window.location.origin}/blog/${post.id}`}
          />
          
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative bg-vizualiza-bg-dark rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-vizualiza-bg-dark/95 backdrop-blur-sm border-b border-white/10 p-6 flex justify-between items-center z-10">
                <div className="flex items-center gap-4">
                  <span className="bg-vizualiza-orange text-white text-sm font-medium px-3 py-1 rounded-full">
                    {post.category}
                  </span>
                  {isAdmin && (
                    <Button
                      onClick={handleEditClick}
                      size="sm"
                      className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Editar
                    </Button>
                  )}
                </div>
                <Button
                  onClick={onClose}
                  variant="ghost"
                  size="sm"
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-6 h-6" />
                </Button>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Image */}
                <div className="relative mb-8 rounded-lg overflow-hidden">
                  <LazyLoadImage
                    src={post.image}
                    alt={post.title}
                    className="w-full h-80 object-cover"
                    effect="blur"
                  />
                </div>

                {/* Meta Information */}
                <div className="flex flex-wrap items-center gap-6 mb-6 text-sm text-gray-400">
                  <div className="flex items-center">
                    <User className="w-4 h-4 mr-2" />
                    {post.author}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {post.readTime} de leitura
                  </div>
                </div>

                {/* Title */}
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  {post.title}
                </h1>

                {/* Excerpt */}
                <p className="text-xl text-gray-300 mb-8 leading-relaxed">
                  {post.excerpt}
                </p>

                {/* Content */}
                <div className="prose prose-invert prose-lg max-w-none mb-8">
                  <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                    {post.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-vizualiza-purple/20 text-vizualiza-purple text-sm rounded-full hover:bg-vizualiza-purple/30 transition-colors duration-200"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Social Share */}
                <div className="border-t border-white/10 pt-6 mb-8">
                  <h3 className="text-lg font-semibold text-white mb-4">Compartilhe este post</h3>
                  <SocialShare
                    url={`${window.location.origin}/blog/${post.id}`}
                    title={post.title}
                    description={post.excerpt}
                  />
                </div>

                {/* Related Posts */}
                <RelatedPosts
                  currentPostId={post.id}
                  currentCategory={post.category}
                  currentTags={post.tags}
                  onPostClick={handleRelatedPostClick}
                />

                {/* Comments */}
                <BlogComments
                  postId={post.id}
                />
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BlogModal;
