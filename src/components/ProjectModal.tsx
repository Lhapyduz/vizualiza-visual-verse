
import { useState } from 'react';
import { X, Calendar, Tag, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ImageZoom from './ImageZoom';
import { Project } from '@/hooks/useProjects';

interface ProjectModalProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onEdit?: (project: Project) => void;
}

const ProjectModal = ({ project, isOpen, onClose, isAdmin = false, onEdit }: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // Only use actual project images, no placeholder images
  const projectImages = [
    project.featured_image,
    ...(project.images?.map(img => img.image_url) || [])
  ].filter(Boolean);

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
    <div
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-vizualiza-bg-dark border border-white/10 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-8 pb-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
            <div className="flex items-center gap-6">
              <span className="inline-flex items-center px-4 py-2 bg-vizualiza-purple/20 text-vizualiza-purple rounded-full text-sm font-medium border border-vizualiza-purple/30">
                {project.category}
              </span>
              <div className="flex items-center text-gray-400 text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                {new Date(project.date).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isAdmin && (
              <Button
                onClick={handleEdit}
                variant="outline"
                size="icon"
                className="border-vizualiza-orange text-vizualiza-orange hover:bg-vizualiza-orange hover:text-white transition-all duration-300"
              >
                <Edit className="w-5 h-5" />
              </Button>
            )}
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="border-white/20 text-white hover:bg-white/10 transition-all duration-300"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-8 px-8 pb-8 max-h-[calc(95vh-140px)] overflow-y-auto">
          {/* Image Gallery Section - Only show if there are images */}
          {projectImages.length > 0 && (
            <div className="space-y-6">
              <div className="relative group">
                <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900">
                  <ImageZoom
                    src={projectImages[currentImageIndex]}
                    alt={`${project.title} - ${currentImageIndex + 1}`}
                    className="w-full h-full"
                  />
                </div>
                
                {projectImages.length > 1 && (
                  <>
                    <Button
                      onClick={prevImage}
                      variant="outline"
                      size="icon"
                      className="absolute left-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 border-white/20 hover:bg-black/80 backdrop-blur-sm"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </Button>
                    <Button
                      onClick={nextImage}
                      variant="outline"
                      size="icon"
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/60 border-white/20 hover:bg-black/80 backdrop-blur-sm"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </Button>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {projectImages.length > 1 && (
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {projectImages.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentImageIndex(index)}
                      className={`flex-shrink-0 w-20 h-16 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                        currentImageIndex === index
                          ? 'border-vizualiza-purple shadow-lg shadow-vizualiza-purple/20'
                          : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`Thumbnail ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Project Details Section */}
          <div className={`space-y-8 ${projectImages.length === 0 ? 'lg:col-span-2' : ''}`}>
            {/* About Section */}
            <div>
              <h2 className="text-2xl font-bold text-white mb-4">Sobre o Projeto</h2>
              <p className="text-gray-300 leading-relaxed text-lg">
                {project.description}
              </p>
            </div>

            {/* Technologies Section - Only show if there are tags */}
            {project.tags && project.tags.length > 0 && (
              <div>
                <h3 className="text-xl font-bold text-white mb-4">Tecnologias e Ferramentas</h3>
                <div className="flex flex-wrap gap-3">
                  {project.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-4 py-2 bg-vizualiza-orange/10 text-vizualiza-orange text-sm rounded-full border border-vizualiza-orange/20 hover:bg-vizualiza-orange/20 transition-colors duration-300"
                    >
                      <Tag className="w-3 h-3 mr-2" />
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
