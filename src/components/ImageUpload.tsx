
import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useImageUpload } from '@/hooks/useImageUpload';

interface ImageUploadProps {
  onImagesSelected: (images: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
  className?: string;
  bucket: 'project-images' | 'blog-images';
}

const ImageUpload = ({ 
  onImagesSelected, 
  maxImages = 10, 
  existingImages = [],
  className = '',
  bucket
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages);

  const { uploadFiles, deleteFile, uploading, progress } = useImageUpload({
    bucket,
    maxFiles: maxImages,
    onSuccess: (urls) => {
      const newImages = [...uploadedImages, ...urls];
      setUploadedImages(newImages);
      onImagesSelected(newImages);
    }
  });

  const handleFiles = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    if (uploadedImages.length + files.length > maxImages) {
      return;
    }

    await uploadFiles(files);
  }, [uploadFiles, uploadedImages.length, maxImages]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  }, [handleFiles]);

  const removeImage = async (index: number) => {
    const imageUrl = uploadedImages[index];
    const success = await deleteFile(imageUrl);
    
    if (success) {
      const newImages = uploadedImages.filter((_, i) => i !== index);
      setUploadedImages(newImages);
      onImagesSelected(newImages);
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Drag and Drop Area */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
          isDragOver
            ? 'border-vizualiza-purple bg-vizualiza-purple/10'
            : 'border-white/20 hover:border-vizualiza-purple/50'
        } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          id="imageUpload"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-vizualiza-purple' : 'bg-white/10'}`}>
            {uploading ? (
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            ) : (
              <Upload className="w-8 h-8 text-white" />
            )}
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {uploading ? 'Fazendo upload...' : 'Faça upload das suas imagens'}
            </h3>
            <p className="text-gray-400 mb-4">
              Arraste e solte suas imagens aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500">
              Máximo de {maxImages} imagens • Formatos: JPG, PNG, GIF, WebP
            </p>
            <p className="text-sm text-gray-500">
              Tamanho máximo: 10MB por arquivo
            </p>
          </div>
          
          <Button
            type="button"
            onClick={() => document.getElementById('imageUpload')?.click()}
            disabled={uploading}
            className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Selecionar Imagens
          </Button>
        </div>
      </div>

      {/* Progress indicators */}
      {Object.keys(progress).length > 0 && (
        <div className="space-y-2">
          {Object.entries(progress).map(([fileId, percent]) => (
            <div key={fileId} className="bg-white/10 rounded-full h-2">
              <div 
                className="bg-vizualiza-purple h-2 rounded-full transition-all duration-300"
                style={{ width: `${percent}%` }}
              />
            </div>
          ))}
        </div>
      )}

      {/* Image Preview Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
                loading="lazy"
              />
              <Button
                type="button"
                onClick={() => removeImage(index)}
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 w-8 h-8 p-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
