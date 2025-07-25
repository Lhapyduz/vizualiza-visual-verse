
import { useState } from 'react';
import { X, ZoomIn } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageZoomProps {
  src: string;
  alt: string;
  className?: string;
}

const ImageZoom = ({ src, alt, className }: ImageZoomProps) => {
  const [isZoomed, setIsZoomed] = useState(false);

  const openZoom = () => setIsZoomed(true);
  const closeZoom = () => setIsZoomed(false);

  return (
    <>
      <div className={`relative group cursor-pointer ${className}`} onClick={openZoom}>
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <ZoomIn className="w-8 h-8 text-white" />
        </div>
      </div>

      {isZoomed && (
        <div 
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={closeZoom}
        >
          <div className="relative w-full h-full flex items-center justify-center">
            <Button
              onClick={(e) => {
                e.stopPropagation();
                closeZoom();
              }}
              variant="outline"
              size="icon"
              className="absolute top-6 right-6 z-10 bg-black/50 border-white/20 hover:bg-black/70 text-white"
            >
              <X className="w-5 h-5" />
            </Button>
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain cursor-pointer"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </>
  );
};

export default ImageZoom;
