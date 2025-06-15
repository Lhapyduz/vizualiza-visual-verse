
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { useImageUpload } from '@/hooks/useImageUpload';
import ImageUpload from '@/components/ImageUpload';
import TagManager from '@/components/TagManager';
import { BlogPost } from '@/hooks/useBlogPosts';

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
  image?: string;
}

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
  editingPost?: BlogPost | null;
  isLoading?: boolean;
}

const BlogForm = ({ onSubmit, onCancel, editingPost, isLoading = false }: BlogFormProps) => {
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    author: '',
    readTime: '',
    tags: [],
    image: ''
  });

  const { categories } = useCategories('blog');
  const { uploadImage, isUploading } = useImageUpload();

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        category: editingPost.category,
        date: editingPost.date,
        author: editingPost.author,
        readTime: editingPost.readTime,
        tags: editingPost.tags || [],
        image: editingPost.image || ''
      });
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleImageUpload = async (file: File) => {
    try {
      const imageUrl = await uploadImage(file);
      setFormData(prev => ({ ...prev, image: imageUrl }));
    } catch (error) {
      console.error('Error uploading image:', error);
    }
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
        <label className="block text-sm font-medium text-white mb-2">Resumo</label>
        <Textarea
          value={formData.excerpt}
          onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
          className="bg-white/5 border-white/20 text-white min-h-[80px]"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-white mb-2">Conteúdo</label>
        <Textarea
          value={formData.content}
          onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
          className="bg-white/5 border-white/20 text-white min-h-[200px]"
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white mb-2">Autor</label>
          <Input
            value={formData.author}
            onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
            className="bg-white/5 border-white/20 text-white"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-2">Tempo de Leitura</label>
          <Input
            value={formData.readTime}
            onChange={(e) => setFormData(prev => ({ ...prev, readTime: e.target.value }))}
            placeholder="ex: 5 min"
            className="bg-white/5 border-white/20 text-white"
            required
          />
        </div>
      </div>

      <TagManager
        tags={formData.tags}
        onChange={(tags) => setFormData(prev => ({ ...prev, tags }))}
        placeholder="Digite uma tag..."
        maxTags={10}
      />

      <div>
        <label className="block text-sm font-medium text-white mb-2">Imagem</label>
        <ImageUpload 
          onImageUpload={handleImageUpload}
          currentImage={formData.image}
          onRemoveImage={() => setFormData(prev => ({ ...prev, image: '' }))}
          isUploading={isUploading}
        />
      </div>

      <div className="flex gap-4">
        <Button 
          type="submit" 
          disabled={isLoading}
          className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
        >
          {isLoading ? 'Salvando...' : editingPost ? 'Atualizar' : 'Criar'}
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

export default BlogForm;
