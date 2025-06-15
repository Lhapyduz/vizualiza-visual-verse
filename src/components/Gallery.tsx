
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  title: string;
  description?: string;
}

interface GalleryProps {
  images: GalleryImage[];
  initialIndex?: number;
  onClose: () => void;
}

const Gallery = ({ images, initialIndex = 0, onClose }: GalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isZoomed, setIsZoomed] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setIsZoomed(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setIsZoomed(false);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: images[currentIndex].title,
          text: images[currentIndex].description,
          url: window.location.href,
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') prevImage();
    if (e.key === 'ArrowRight') nextImage();
    if (e.key === 'Escape') onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-sm"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4 bg-gradient-to-b from-black/50 to-transparent">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h3 className="text-lg font-semibold">{images[currentIndex].title}</h3>
            <p className="text-sm text-gray-300">
              {currentIndex + 1} de {images.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              onClick={handleShare}
              variant="outline"
              size="icon"
              className="bg-black/50 border-white/20 hover:bg-black/70"
            >
              <Share2 className="w-5 h-5" />
            </Button>
            <Button
              onClick={() => setIsZoomed(!isZoomed)}
              variant="outline"
              size="icon"
              className="bg-black/50 border-white/20 hover:bg-black/70"
            >
              <ZoomIn className="w-5 h-5" />
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              size="icon"
              className="bg-black/50 border-white/20 hover:bg-black/70"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Image */}
      <div className="flex items-center justify-center h-full pt-20 pb-20">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex].src}
            alt={images[currentIndex].alt}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ 
              opacity: 1, 
              scale: isZoomed ? 1.5 : 1,
              transition: { duration: 0.3 }
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            className={`max-w-full max-h-full object-contain transition-transform duration-300 ${
              isZoomed ? 'cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
          />
        </AnimatePresence>
      </div>

      {/* Navigation */}
      <Button
        onClick={prevImage}
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 hover:bg-black/70"
      >
        <ChevronLeft className="w-6 h-6" />
      </Button>
      
      <Button
        onClick={nextImage}
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 border-white/20 hover:bg-black/70"
      >
        <ChevronRight className="w-6 h-6" />
      </Button>

      {/* Thumbnails */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/50 to-transparent">
        <div className="flex items-center justify-center gap-2 overflow-x-auto">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => setCurrentIndex(index)}
              className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all overflow-hidden ${
                currentIndex === index
                  ? 'border-vizualiza-purple'
                  : 'border-white/20 hover:border-white/40'
              }`}
            >
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Gallery;
