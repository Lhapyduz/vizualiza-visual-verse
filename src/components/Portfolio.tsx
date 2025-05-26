import { useState, useEffect } from 'react';
import { ExternalLink, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectModal from './ProjectModal';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  tags: string[];
}

interface PortfolioProps {
  isAdmin?: boolean;
  onEditProject?: (project: Project) => void;
}

const Portfolio = ({ isAdmin = false, onEditProject }: PortfolioProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categories = ['Todos', 'Identidade Visual', 'Design Gráfico', 'Fotografia', 'Web Design'];

  const openProjectModal = (project: Project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  const closeProjectModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
  };

  useEffect(() => {
    // Projetos de exemplo
    const sampleProjects: Project[] = [
      {
        id: '1',
        title: 'Identidade Visual Café Aurora',
        description: 'Desenvolvimento completo da identidade visual para cafeteria artesanal, incluindo logotipo, paleta de cores e aplicações.',
        image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop',
        category: 'Identidade Visual',
        date: '2024-01-15',
        tags: ['Branding', 'Logo', 'Café']
      },
      {
        id: '2',
        title: 'Campanha Digital TechStart',
        description: 'Criação de peças digitais para startup de tecnologia, focando em comunicação jovem e inovadora.',
        image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop',
        category: 'Design Gráfico',
        date: '2024-02-10',
        tags: ['Digital', 'Tech', 'Startup']
      },
      {
        id: '3',
        title: 'Ensaio Fotográfico Corporativo',
        description: 'Produção fotográfica para empresa de consultoria, retratando profissionalismo e modernidade.',
        image: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        category: 'Fotografia',
        date: '2024-03-05',
        tags: ['Corporativo', 'Retrato', 'Profissional']
      },
      {
        id: '4',
        title: 'Website Arquitetônico',
        description: 'Design e desenvolvimento de website para escritório de arquitetura, com foco na experiência do usuário.',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=400&fit=crop',
        category: 'Web Design',
        date: '2024-03-20',
        tags: ['Website', 'Arquitetura', 'UX/UI']
      }
    ];

    // Carregar projetos do localStorage ou usar exemplos
    const savedProjects = localStorage.getItem('vizualiza-projects');
    if (savedProjects) {
      setProjects([...JSON.parse(savedProjects), ...sampleProjects]);
    } else {
      setProjects(sampleProjects);
    }
  }, []);

  const filteredProjects = selectedCategory === 'Todos' 
    ? projects 
    : projects.filter(project => project.category === selectedCategory);

  return (
    <section id="portfolio" className="py-20 px-4 bg-vizualiza-bg-dark">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            <span className="text-white">Nosso </span>
            <span className="bg-vizualiza-gradient bg-clip-text text-transparent">Portfólio</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
            Explore nossos projetos mais recentes e descubra como transformamos 
            ideias em soluções visuais impactantes.
          </p>

          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
              <Button
                key={category}
                onClick={() => setSelectedCategory(category)}
                variant={selectedCategory === category ? "default" : "outline"}
                className={`px-6 py-2 transition-all duration-300 ${
                  selectedCategory === category
                    ? 'bg-vizualiza-purple hover:bg-vizualiza-purple-dark text-white'
                    : 'border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white'
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project, index) => (
            <div 
              key={project.id}
              className="group bg-white/5 rounded-lg overflow-hidden backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:scale-105 cursor-pointer"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openProjectModal(project)}
            >
              <div className="relative overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-vizualiza-purple/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <ExternalLink className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-vizualiza-orange text-sm font-medium">{project.category}</span>
                  <div className="flex items-center text-gray-400 text-sm">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-vizualiza-purple transition-colors duration-300">
                  {project.title}
                </h3>
                
                <p className="text-gray-400 mb-4 leading-relaxed">
                  {project.description}
                </p>
                
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="inline-flex items-center px-3 py-1 bg-vizualiza-purple/20 text-vizualiza-purple text-xs rounded-full"
                    >
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">
              Nenhum projeto encontrado para a categoria "{selectedCategory}".
            </p>
          </div>
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
