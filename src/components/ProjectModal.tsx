
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, ChevronLeft, ChevronRight, Edit } from 'lucide-react';
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

const ProjectModal = ({
  project,
  isOpen,
  onClose,
  isAdmin = false,
  onEdit
}: ProjectModalProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Create a unique array of images, avoiding duplicates
  const projectImages: string[] = [];

  // Add featured image if it exists
  if (project.featured_image) {
    projectImages.push(project.featured_image);
  }

  // Add additional images, but avoid duplicating the featured image
  if (project.images && project.images.length > 0) {
    project.images.forEach(img => {
      const imageUrl = img.image_url;
      // Only add if it's not already in the array
      if (!projectImages.includes(imageUrl)) {
        projectImages.push(imageUrl);
      }
    });
  }

  const nextImage = () => {
    setCurrentImageIndex(prev => (prev + 1) % projectImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex(prev => (prev - 1 + projectImages.length) % projectImages.length);
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(project);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="bg-vizualiza-bg-dark border border-white/10 rounded-3xl max-w-6xl w-full max-h-[95vh] overflow-hidden"
            onClick={e => e.stopPropagation()}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30, duration: 0.4 }}
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
                  className="border-white/20 text-white transition-all duration-300 bg-gray-950 hover:bg-gray-800 rounded-sm"
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
                  <motion.div
                    className="relative group aspect-[4/3] overflow-hidden rounded-2xl bg-gray-900"
                    layoutId={`project-image-${project.id}`}
                  >
                    <ImageZoom 
                      src={projectImages[currentImageIndex]} 
                      alt={`${project.title} - ${currentImageIndex + 1}`} 
                      className="w-full h-full object-cover"
                    />
                    
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
                  </motion.div>

                  {/* Thumbnails */}
                  {projectImages.length > 1 && (
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {projectImages.map((img, index) => (
                        <button 
                          key={`${img}-${index}`}
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
                {project.description && (
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-4">Sobre o Projeto</h2>
                    <p className="text-gray-300 leading-relaxed text-lg">
                      {project.description}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ProjectModal;
