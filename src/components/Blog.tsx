
import React, { useState, useMemo } from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Calendar, Tag, Clock, User, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import BlogModal from './BlogModal';
import AdvancedSearch from './AdvancedSearch';
import ScrollAnimation from './ScrollAnimation';
import { motion } from 'framer-motion';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import { useCategories } from '@/hooks/useCategories';

interface BlogProps {
  isAdmin?: boolean;
  onEditPost?: (post: BlogPost) => void;
}

interface SearchFilters {
  searchTerm: string;
  category: string;
  dateRange: 'all' | 'recent' | 'lastYear';
  tags: string[];
}

const Blog = ({ isAdmin = false, onEditPost }: BlogProps) => {
  const { posts, isLoading } = useBlogPosts();
  const { categories } = useCategories('blog');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    dateRange: 'all',
    tags: []
  });

  const categoryOptions = ['Todos', ...categories.map(cat => cat.name)];

  const openPostModal = (post: BlogPost) => {
    setSelectedPost(post);
    setIsModalOpen(true);
  };

  const closePostModal = () => {
    setIsModalOpen(false);
    setSelectedPost(null);
  };

  const handleCreatePost = () => {
    const newPost: BlogPost = {
      id: Date.now().toString(),
      title: 'Novo Post',
      excerpt: 'Descrição do novo post...',
      content: 'Conteúdo detalhado do post...',
      featured_image: 'https://images.unsplash.com/photo-1586953209889-5ce391d8cd9b?w=600&h=400&fit=crop',
      category: 'Design',
      date: new Date().toISOString().split('T')[0],
      author: 'Gregory Vizualiza',
      read_time: '5 min',
      tags: ['Novo', 'Post']
    };
    
    if (onEditPost) {
      onEditPost(newPost);
    }
  };

  // Get all available tags
  const availableTags = useMemo(() => {
    const allTags = posts.flatMap(post => post.tags);
    return [...new Set(allTags)];
  }, [posts]);

  // Filter posts based on search and filters
  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Apply category filter (legacy and new)
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }
    if (searchFilters.category) {
      filtered = filtered.filter(post => post.category === searchFilters.category);
    }

    // Apply search term filter
    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(term) ||
        post.excerpt.toLowerCase().includes(term) ||
        post.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    // Apply date range filter
    if (searchFilters.dateRange !== 'all') {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

      filtered = filtered.filter(post => {
        const postDate = new Date(post.date);
        if (searchFilters.dateRange === 'recent') {
          return postDate >= threeMonthsAgo;
        } else if (searchFilters.dateRange === 'lastYear') {
          return postDate >= oneYearAgo;
        }
        return true;
      });
    }

    // Apply tags filter
    if (searchFilters.tags.length > 0) {
      filtered = filtered.filter(post =>
        searchFilters.tags.some(tag => post.tags.includes(tag))
      );
    }

    return filtered;
  }, [posts, selectedCategory, searchFilters]);

  if (isLoading) {
    return (
      <section id="blog" className="py-20 px-4 bg-vizualiza-bg-light">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vizualiza-purple mx-auto"></div>
            <p className="text-white mt-4">Carregando posts...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="blog" className="py-20 px-4 bg-vizualiza-bg-light">
      <div className="max-w-7xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <h2 className="text-4xl md:text-5xl font-bold">
                <span className="text-white">Nosso </span>
                <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Blog</span>
              </h2>
              {isAdmin && (
                <Button
                  onClick={handleCreatePost}
                  className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo Post
                </Button>
              )}
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Descubra insights, tendências e dicas do mundo do design através 
              dos nossos artigos especializados.
            </p>
          </div>
        </ScrollAnimation>

        {/* Advanced Search */}
        <ScrollAnimation direction="up" delay={0.2}>
          <AdvancedSearch
            onSearch={setSearchFilters}
            availableTags={availableTags}
            categories={categoryOptions.slice(1)} // Remove "Todos" from search categories
          />
        </ScrollAnimation>

        {/* Legacy Category Filter */}
        <ScrollAnimation direction="up" delay={0.4}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categoryOptions.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`px-6 py-2 transition-all duration-300 hover:scale-105 ${
                  selectedCategory === category
                    ? 'bg-vizualiza-purple hover:bg-vizualiza-purple-dark text-white'
                    : 'border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollAnimation>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post, index) => (
            <ScrollAnimation key={post.id} direction="up" delay={index * 0.1}>
              <motion.article 
                className="group bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all duration-300 cursor-pointer"
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openPostModal(post)}
              >
                <div className="relative overflow-hidden">
                  <LazyLoadImage 
                    src={post.featured_image || 'https://images.unsplash.com/photo-1560472355-536de3962603?w=600&h=400&fit=crop'} 
                    alt={post.title}
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                    effect="blur"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-vizualiza-orange text-white text-sm font-medium px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3 text-sm text-gray-400">
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-1" />
                      {post.author}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {post.read_time}
                    </div>
                  </div>

                  <div className="flex items-center text-gray-400 text-sm mb-3">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(post.date).toLocaleDateString('pt-BR')}
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-vizualiza-purple transition-colors duration-300">
                    {post.title}
                  </h3>
                  
                  <p className="text-gray-400 mb-4 leading-relaxed">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span 
                        key={tag}
                        className="inline-flex items-center px-3 py-1 bg-vizualiza-purple/20 text-vizualiza-purple text-xs rounded-full hover:bg-vizualiza-purple/30 transition-colors duration-200"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.article>
            </ScrollAnimation>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <ScrollAnimation direction="up">
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Nenhum post encontrado com os filtros aplicados.
              </p>
            </div>
          </ScrollAnimation>
        )}
      </div>

      {/* Blog Modal */}
      {selectedPost && (
        <BlogModal
          post={selectedPost}
          isOpen={isModalOpen}
          onClose={closePostModal}
          isAdmin={isAdmin}
          onEdit={onEditPost}
        />
      )}
    </section>
  );
};

export default Blog;
