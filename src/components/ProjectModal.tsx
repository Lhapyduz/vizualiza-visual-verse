
import { useState } from 'react';
import { X, Calendar, Tag, ExternalLink, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageZoom from './ImageZoom';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  tags: string[];
}

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (project: Project) => void;
}

const ProjectModal = ({ project, isOpen, onClose, isAdmin = false, onEdit }: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Para demonstração, vou usar algumas imagens relacionadas ao projeto
  const projectImages = [
    project.image,
    'https://images.unsplash.com/photo-1558655146-d09347e92766?w=800&h=600&fit=crop',
    'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=800&h=600&fit=crop'
  ];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-vizualiza-bg-dark border border-white/10 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 className="text-2xl font-bold text-white mb-2">{project.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-400">
              <span className="inline-flex items-center px-3 py-1 bg-vizualiza-purple/20 text-vizualiza-purple rounded-full">
                {project.category}
              </span>
              <div className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {new Date(project.date).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="icon"
                className="border-vizualiza-orange text-vizualiza-orange hover:bg-vizualiza-orange hover:text-white"
              >
                <Edit className="w-5 h-5" />
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="border-white/20 hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-6 p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative group">
              <ImageZoom
                src={projectImages[currentImageIndex]}
                alt={`${project.title} - ${currentImageIndex + 1}`}
                className="w-full h-80 rounded-lg overflow-hidden"
              />
              
              {projectImages.length > 1 && (
                <>
                  <Button
                    onClick={prevImage}
                    variant="outline"
                    size="icon"
                    className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 border-white/20 hover:bg-black/70"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={nextImage}
                    variant="outline"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/50 border-white/20 hover:bg-black/70"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>

            {/* Image Thumbnails */}
            {projectImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {projectImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all overflow-hidden ${
                      currentImageIndex === index
                        ? 'border-vizualiza-purple'
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    <ImageZoom
                      src={img}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Project Details */}
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-white mb-3">Sobre o Projeto</h3>
              <p className="text-gray-300 leading-relaxed mb-4">
                {project.description}
              </p>
              <p className="text-gray-300 leading-relaxed">
                Este projeto foi desenvolvido com foco na criação de uma identidade visual única e impactante. 
                Utilizamos as melhores práticas de design para garantir que a marca se destaque no mercado 
                e comunique efetivamente os valores da empresa.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Tecnologias e Ferramentas</h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 bg-vizualiza-orange/20 text-vizualiza-orange text-sm rounded-full"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </span>
                ))}
                <span className="inline-flex items-center px-3 py-1 bg-vizualiza-orange/20 text-vizualiza-orange text-sm rounded-full">
                  <Tag className="w-3 h-3 mr-1" />
                  Adobe Illustrator
                </span>
                <span className="inline-flex items-center px-3 py-1 bg-vizualiza-orange/20 text-vizualiza-orange text-sm rounded-full">
                  <Tag className="w-3 h-3 mr-1" />
                  Photoshop
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold text-white mb-3">Resultados</h4>
              <ul className="text-gray-300 space-y-2">
                <li>• Aumento de 40% no reconhecimento da marca</li>
                <li>• Melhoria na percepção visual da empresa</li>
                <li>• Maior engajamento nas redes sociais</li>
                <li>• Identidade visual coesa em todos os pontos de contato</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <Button className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark text-white">
                <ExternalLink className="w-4 h-4 mr-2" />
                Ver Projeto Completo
              </Button>
              <Button variant="outline" className="border-vizualiza-orange text-vizualiza-orange hover:bg-vizualiza-orange hover:text-white">
                Solicitar Orçamento
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
