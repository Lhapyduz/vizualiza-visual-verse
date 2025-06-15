
import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { Project } from '@/hooks/useProjects';
import ImageUpload from '../ImageUpload';

interface ProjectFormProps {
  onSubmit: (data: ProjectFormData) => void;
  onCancel: () => void;
  editingProject?: Project | null;
  isLoading?: boolean;
}

export interface ProjectFormData {
  title: string;
  description: string;
  category: string;
  date: string;
  tags: string[];
  featured_image?: string;
  images?: string[];
}

const ProjectForm = ({ onSubmit, onCancel, editingProject, isLoading = false }: ProjectFormProps) => {
  const { categories } = useCategories('project');
  const [images, setImages] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProjectFormData>({
    title: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: []
  });

  useEffect(() => {
    if (editingProject) {
      // Only populate when editing an existing project
      setFormData({
        title: editingProject.title,
        description: editingProject.description,
        category: editingProject.category,
        date: editingProject.date,
        tags: editingProject.tags || []
      });
      
      // Fix: Properly handle images without duplication
      const projectImages: string[] = [];
      
      // Add featured image if it exists
      if (editingProject.featured_image) {
        projectImages.push(editingProject.featured_image);
      }
      
      // Add additional images if they exist, but avoid duplicating the featured image
      if (editingProject.images && editingProject.images.length > 0) {
        editingProject.images.forEach(img => {
          const imageUrl = img.image_url;
          // Only add if it's not already in the array (avoid duplicating featured image)
          if (!projectImages.includes(imageUrl)) {
            projectImages.push(imageUrl);
          }
        });
      }
      
      setImages(projectImages);
    } else {
      // Reset form when creating new project
      setFormData({
        title: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        tags: []
      });
      setImages([]);
    }
  }, [editingProject]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      featured_image: images[0] || '',
      images: images
    };

    onSubmit(submitData);
  };

  const handleTagsChange = (value: string) => {
    const tags = value
      .replace(/,/g, ';')
      .split(';')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    setFormData(prev => ({ ...prev, tags }));
  };

  const handleImagesSelected = (selectedImages: string[]) => {
    setImages(selectedImages);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        placeholder="Título do projeto"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
      />

      <Textarea
        placeholder="Descrição do projeto"
        value={formData.description}
        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        required
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[120px]"
      />

      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Imagens do Projeto
        </label>
        <ImageUpload
          onImagesSelected={handleImagesSelected}
          maxImages={5}
          existingImages={images}
          bucket="project-images"
        />
      </div>

      <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
        <SelectTrigger className="bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Selecione uma categoria" />
        </SelectTrigger>
        <SelectContent>
          {categories.map(category => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        type="date"
        value={formData.date}
        onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
        required
        className="bg-white/10 border-white/20 text-white"
      />

      <Input
        placeholder="Tags (separadas por vírgula ou ponto e vírgula)"
        value={formData.tags.join('; ')}
        onChange={(e) => handleTagsChange(e.target.value)}
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
      />

      <div className="flex space-x-4">
        <Button 
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {editingProject ? 'Atualizar' : 'Criar'}
        </Button>
        <Button 
          type="button"
          onClick={onCancel}
          variant="outline"
          className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
        >
          Cancelar
        </Button>
      </div>
    </form>
  );
};

export default ProjectForm;
