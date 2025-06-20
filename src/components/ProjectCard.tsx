import React from 'react';
import { motion, useMotionValue, useTransform } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Calendar, ArrowUpRight } from 'lucide-react';
import { Project } from '@/hooks/useProjects';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const ProjectCard = ({ project, index, onClick }: ProjectCardProps) => {
  const cardVariants = {
    rest: {},
    hover: {
      transition: { staggerChildren: 0.05, duration: 0.3 }
    }
  };

  const titleVariants = {
    rest: { opacity: 1, y: 0 },
    hover: { y: -5, transition: { type: "spring", stiffness: 300, damping: 10 } }
  };

  const descriptionVariants = {
    rest: { opacity: 1, y: 0 },
    hover: { y: -3, transition: { type: "spring", stiffness: 300, damping: 10, delay: 0.05 } }
  };

  const tagsVariants = {
    rest: { opacity: 1, y: 0 },
    hover: { y: -3, transition: { type: "spring", stiffness: 300, damping: 10, delay: 0.1 } }
  };

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useTransform(mouseY, [-100, 100], [5, -5], { clamp: false });
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5], { clamp: false });

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      variants={cardVariants}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover="hover"
      transition={{
        duration: 0.6,
        delay: index * 0.1,
        y: { type: "spring", stiffness: 100 },
        scale: { type: "spring", stiffness: 400, damping: 17 },
        rotateX: { type: "spring", stiffness: 200, damping: 20 },
        rotateY: { type: "spring", stiffness: 200, damping: 20 }
      }}
      whileTap={{ scale: 0.98 }}
      className="group relative bg-gradient-to-br from-white/5 to-white/10 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-vizualiza-purple/50 transition-all duration-500 cursor-pointer"
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        perspective: "800px"
      }}
    >
      {/* Image Container */}
      <motion.div
        className="relative h-72 overflow-hidden"
        style={{ transformStyle: "preserve-3d" }}
        layoutId={`project-image-${project.id}`}
      >
        <LazyLoadImage
          src={project.featured_image || project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          effect="blur"
          style={{ transform: "translateZ(0)" }}
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className="px-3 py-1 bg-vizualiza-purple/90 backdrop-blur-sm text-white text-sm font-medium rounded-full border border-white/20">
            {project.category}
          </span>
        </div>
        
        {/* Hover Icon */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
            <ArrowUpRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </motion.div>
      
      {/* Content */}
      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {new Date(project.date).toLocaleDateString('pt-BR')}
          </div>
        </div>
        
        <motion.h3
          variants={titleVariants}
          className="text-xl font-bold text-white mb-3 group-hover:text-vizualiza-purple transition-colors duration-300 line-clamp-2"
        >
          {project.title}
        </motion.h3>
        
        <motion.p
          variants={descriptionVariants}
          className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3"
        >
          {project.description}
        </motion.p>
        
        {/* Tags */}
        {project.tags && project.tags.length > 0 && (
          <motion.div variants={tagsVariants} className="flex flex-wrap gap-2">
            {project.tags.slice(0, 3).map((tag, tagIndex) => (
              <motion.span
                key={tagIndex}
                className="px-2 py-1 bg-vizualiza-orange/20 text-vizualiza-orange text-xs rounded-md border border-vizualiza-orange/30"
              >
                {tag}
              </motion.span>
            ))}
            {project.tags.length > 3 && (
              <motion.span
                className="px-2 py-1 bg-gray-700/50 text-gray-400 text-xs rounded-md"
              >
                +{project.tags.length - 3}
              </motion.span>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Bottom Gradient Line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-vizualiza-purple via-vizualiza-orange to-vizualiza-purple opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  );
};

export default ProjectCard;
