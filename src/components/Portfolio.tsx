
import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import ProjectModal from './ProjectModal';
import ProjectCard from './ProjectCard';
import AdvancedSearch from './AdvancedSearch';
import ScrollAnimation from './ScrollAnimation';
import { motion } from 'framer-motion';
import { useProjects, Project } from '@/hooks/useProjects';
import { useCategories } from '@/hooks/useCategories';

interface PortfolioProps {
  isAdmin?: boolean;
  onEditProject?: (project: Project) => void;
}

interface SearchFilters {
  searchTerm: string;
  category: string;
  dateRange: 'all' | 'recent' | 'lastYear';
  tags: string[];
}

const Portfolio = ({ isAdmin = false, onEditProject }: PortfolioProps) => {
  const { projects, isLoading } = useProjects();
  const { categories } = useCategories('project');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchTerm: '',
    category: '',
    dateRange: 'all',
    tags: []
  });

  const categoryOptions = ['Todos', ...categories.map(cat => cat.name)];

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  // Get all available tags
  const availableTags = useMemo(() => {
    const allTags = projects.flatMap(project => project.tags || []);
    return [...new Set(allTags.filter(tag => typeof tag === 'string' && tag.trim() !== ''))];
  }, [projects]);

  // Filter projects based on search and filters
  const filteredProjects = useMemo(() => {
    let filtered = projects;

    // Apply category filter (legacy and new)
    if (selectedCategory !== 'Todos') {
      filtered = filtered.filter(project => project.category === selectedCategory);
    }
    if (searchFilters.category) {
      filtered = filtered.filter(project => project.category === searchFilters.category);
    }

    // Apply search term filter
    if (searchFilters.searchTerm) {
      const term = searchFilters.searchTerm.toLowerCase();
      filtered = filtered.filter(project => 
        project.title.toLowerCase().includes(term) ||
        project.description.toLowerCase().includes(term) ||
        (project.tags || []).some(tag => String(tag).toLowerCase().includes(term))
      );
    }

    // Apply date range filter
    if (searchFilters.dateRange !== 'all') {
      const now = new Date();
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 3, now.getDate());
      const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

      filtered = filtered.filter(project => {
        const projectDate = new Date(project.date);
        if (searchFilters.dateRange === 'recent') {
          return projectDate >= threeMonthsAgo;
        } else if (searchFilters.dateRange === 'lastYear') {
          return projectDate >= oneYearAgo;
        }
        return true;
      });
    }

    // Apply tags filter
    if (searchFilters.tags.length > 0) {
      filtered = filtered.filter(project =>
        searchFilters.tags.some(tag => (project.tags || []).includes(tag))
      );
    }

    return filtered;
  }, [projects, selectedCategory, searchFilters]);

  if (isLoading) {
    return (
      <section id="portfolio" className="py-20 px-4 bg-vizualiza-bg-dark">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-vizualiza-purple mx-auto"></div>
            <p className="text-white mt-4">Carregando projetos...</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="portfolio" className="py-20 px-4 bg-vizualiza-bg-dark">
      <div className="max-w-7xl mx-auto">
        <ScrollAnimation direction="up">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-white">Nosso </span>
              <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Portfólio</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
              Explore nossos projetos mais recentes e descubra como transformamos 
              ideias em soluções visuais impactantes.
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

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <ProjectCard
              key={project.id}
              project={project}
              index={index}
              onClick={() => openProjectModal(project)}
            />
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <ScrollAnimation direction="up">
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">
                Nenhum projeto encontrado com os filtros aplicados.
              </p>
            </div>
          </ScrollAnimation>
        )}
      </div>

      {/* Project Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          isOpen={isModalOpen}
          onClose={closeProjectModal}
          isAdmin={isAdmin}
          onEdit={onEditProject}
        />
      )}
    </section>
  );
};

export default Portfolio;
