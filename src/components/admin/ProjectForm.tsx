import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUpload from '@/components/ImageUpload';
import TagManager from '@/components/TagManager';
import { Project } from '@/hooks/useProjects';

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  tags: string[];
  featured_image?: string;
  images?: string[];
}

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  editingProject?: Project | null;
  isLoading?: boolean;
}

const ProjectForm = ({ onSubmit, onCancel, editingProject, isLoading = false }: ProjectFormProps) => {
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: [],
    featured_image: '',
    images: []
  });

  const { categories } = useCategories('project');
  const { uploadFiles, uploading } = useImageUpload({
    bucket: 'project-images',
    maxFiles: 10,
    onSuccess: (urls) => {
      setFormData(prev => ({ 
        ...prev, 
        images: [...(prev.images || []), ...urls] 
      }));
    }
  });

  useEffect(() => {
    if (editingProject) {
      setFormData({
        title: editingProject.title,
        description: editingProject.description,
        category: editingProject.category,
        date: editingProject.date,
        tags: editingProject.tags || [],
        featured_image: editingProject.featured_image || '',
        images: editingProject.images?.map(img => img.image_url) || []
      });
    }
  }, [editingProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleFeaturedImageUpload = (images: string[]) => {
    if (images.length > 0) {
      setFormData(prev => ({ ...prev, featured_image: images[0] }));
    }
  };

  const handleAdditionalImagesUpload = (images: string[]) => {
    setFormData(prev => ({ ...prev, images }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-white mb-2">Título</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className="bg-white/5 border-white/20 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Descrição</label>
        <Textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          className="bg-white/5 border-white/20 text-white min-h-[100px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Categoria</label>
        <Select 
          value={formData.category} 
          onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
        >
          <SelectTrigger className="bg-white/5 border-white/20 text-white">
            <SelectValue placeholder="Selecione uma categoria" />
          </SelectTrigger>
          <SelectContent className="bg-vizualiza-bg-dark border-white/20">
            {categories.map((category) => (
              <SelectItem key={category.id} value={category.name} className="text-white hover:bg-white/10">
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Data</label>
        <Input
          type="date"
          value={formData.date}
          onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          className="bg-white/5 border-white/20 text-white"
          required
        />
      </div>

      <TagManager
        tags={formData.tags}
        onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
        placeholder="Digite uma tag..."
        maxTags={8}
      />

      <div>
        <label className="block text-sm font-medium text-white mb-2">Imagem Principal</label>
        <ImageUpload 
          onImagesSelected={handleFeaturedImageUpload}
          maxImages={1}
          existingImages={formData.featured_image ? [formData.featured_image] : []}
          bucket="project-images"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Imagens Adicionais</label>
        <ImageUpload 
          onImagesSelected={handleAdditionalImagesUpload}
          maxImages={9}
          existingImages={formData.images || []}
          bucket="project-images"
        />
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
        >
          {isLoading ? 'Salvando...' : editingProject ? 'Atualizar' : 'Criar'}
        </Button>
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
          className="border-white/20 text-white hover:bg-white/10"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
