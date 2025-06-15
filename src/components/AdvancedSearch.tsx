
import React, { useState } from 'react';
import { Search, Filter, X, Calendar, Tag as TagIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilters {
  searchTerm: string;
  category: string;
  dateRange: 'all' | 'recent' | 'lastYear';
  tags: string[];
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  availableTags: string[];
  categories: string[];
}

const AdvancedSearch = ({ onSearch, availableTags, categories }: AdvancedSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    dateRange: 'all',
    tags: []
  });

  const handleSearch = () => {
    onSearch(filters);
  };

  const clearFilters = () => {
    const emptyFilters = {
      searchTerm: '',
      category: '',
      dateRange: 'all' as const,
      tags: []
    };
    setFilters(emptyFilters);
    onSearch(emptyFilters);
  };

  const toggleTag = (tag: string) => {
    setFilters(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  return (
    <motion.div 
      className="w-full max-w-4xl mx-auto mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative">
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar projetos..."
              value={filters.searchTerm}
              onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:border-vizualiza-purple"
            />
          </div>
          <Button
            onClick={() => setIsExpanded(!isExpanded)}
            variant="outline"
            className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </Button>
          <Button
            onClick={handleSearch}
            className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
          >
            Buscar
          </Button>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-4 p-4 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10"
            >
              <div className="grid md:grid-cols-3 gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <TagIcon className="w-4 h-4 inline mr-1" />
                    Categoria
                  </label>
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full bg-white/10 border-white/20 text-white rounded-md px-3 py-2 focus:border-vizualiza-purple"
                  >
                    <option value="">Todas as categorias</option>
                    {categories.map(category => (
                      <option key={category} value={category} className="bg-vizualiza-bg-dark">
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Período
                  </label>
                  <select
                    value={filters.dateRange}
                    onChange={(e) => setFilters(prev => ({ ...prev, dateRange: e.target.value as any }))}
                    className="w-full bg-white/10 border-white/20 text-white rounded-md px-3 py-2 focus:border-vizualiza-purple"
                  >
                    <option value="all" className="bg-vizualiza-bg-dark">Todos os períodos</option>
                    <option value="recent" className="bg-vizualiza-bg-dark">Últimos 3 meses</option>
                    <option value="lastYear" className="bg-vizualiza-bg-dark">Último ano</option>
                  </select>
                </div>

                {/* Clear Filters */}
                <div className="flex items-end">
                  <Button
                    onClick={clearFilters}
                    variant="outline"
                    className="w-full border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Limpar
                  </Button>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-300 mb-2">Tags</label>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map(tag => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-xs transition-all duration-200 ${
                        filters.tags.includes(tag)
                          ? 'bg-vizualiza-purple text-white'
                          : 'bg-white/10 text-gray-300 hover:bg-white/20'
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default AdvancedSearch;
