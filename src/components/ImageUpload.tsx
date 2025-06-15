
import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface ImageUploadProps {
  onImagesSelected: (images: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
  className?: string;
}

const ImageUpload = ({ 
  onImagesSelected, 
  maxImages = 10, 
  existingImages = [],
  className = '' 
}: ImageUploadProps) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<string[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const handleFiles = useCallback(async (files: FileList) => {
    if (files.length === 0) return;

    const imageFiles = Array.from(files).filter(file => 
      file.type.startsWith('image/')
    );

    if (imageFiles.length === 0) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive"
      });
      return;
    }

    if (uploadedImages.length + imageFiles.length > maxImages) {
      toast({
        title: "Limite excedido",
        description: `Você pode fazer upload de no máximo ${maxImages} imagens.`,
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);

    try {
      const base64Images = await Promise.all(
        imageFiles.map(file => convertToBase64(file))
      );

      const newImages = [...uploadedImages, ...base64Images];
      setUploadedImages(newImages);
      onImagesSelected(newImages);

      toast({
        title: "Upload realizado!",
        description: `${imageFiles.length} imagem(ns) carregada(s) com sucesso.`,
      });
    } catch (error) {
      toast({
        title: "Erro no upload",
        description: "Ocorreu um erro ao processar as imagens.",
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  }, [uploadedImages, maxImages, onImagesSelected, toast]);

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

  const removeImage = (index: number) => {
    const newImages = uploadedImages.filter((_, i) => i !== index);
    setUploadedImages(newImages);
    onImagesSelected(newImages);
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
        } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
      >
        <input
          type="file"
          id="imageUpload"
          multiple
          accept="image/*"
          onChange={handleFileInput}
          className="hidden"
          disabled={isUploading}
        />
        
        <div className="flex flex-col items-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-vizualiza-purple' : 'bg-white/10'}`}>
            <Upload className="w-8 h-8 text-white" />
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">
              {isUploading ? 'Processando imagens...' : 'Faça upload das suas imagens'}
            </h3>
            <p className="text-gray-400 mb-4">
              Arraste e solte suas imagens aqui ou clique para selecionar
            </p>
            <p className="text-sm text-gray-500">
              Máximo de {maxImages} imagens • Formatos: JPG, PNG, GIF
            </p>
          </div>
          
          <Button
            type="button"
            onClick={() => document.getElementById('imageUpload')?.click()}
            disabled={isUploading}
            className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
          >
            <ImageIcon className="w-4 h-4 mr-2" />
            Selecionar Imagens
          </Button>
        </div>
      </div>

      {/* Image Preview Grid */}
      {uploadedImages.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg"
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
