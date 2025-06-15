
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
    // Convert related post to BlogPost format and show it
    console.log('Opening related post:', relatedPost);
    // This would normally update the current post in the parent component
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <SEOHead
            title={`${post.title} | Vizualiza Blog`}
            description={post.excerpt}
            keywords={`${post.tags.join(', ')}, design, branding, identidade visual`}
            image={post.image}
            url={`${window.location.origin}/blog/${post.id}`}
            type="article"
            publishedTime={post.date}
            author={post.author}
            tags={post.tags}
            category={post.category}
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
              className="relative bg-vizualiza-bg-dark rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="sticky top-0 bg-vizualiza-bg-dark/95 backdrop-blur-sm border-b border-white/10 p-6 flex justify-between items-center">
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
                  <p className="text-gray-300 leading-relaxed">
                    {post.content}
                  </p>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-8">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-vizualiza-purple/20 text-vizualiza-purple text-sm rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Social Share */}
                <div className="border-t border-white/10 pt-6 mb-8">
                  <SocialShare
                    url={`${window.location.origin}/blog/${post.id}`}
                    title={post.title}
                    description={post.excerpt}
                  />
                </div>

                {/* Comments Section */}
                <BlogComments postId={post.id} />

                {/* Related Posts */}
                <RelatedPosts
                  currentPostId={post.id}
                  currentCategory={post.category}
                  onPostClick={handleRelatedPostClick}
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
