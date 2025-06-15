
import React, { useState, useEffect } from 'react';
import { Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCategories } from '@/hooks/useCategories';
import { BlogPost } from '@/hooks/useBlogPosts';
import ImageUpload from '../ImageUpload';

interface BlogFormProps {
  onSubmit: (data: BlogFormData) => void;
  onCancel: () => void;
  editingPost?: BlogPost | null;
  isLoading?: boolean;
}

export interface BlogFormData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  date: string;
  tags: string[];
  featured_image?: string;
}

const BlogForm = ({ onSubmit, onCancel, editingPost, isLoading = false }: BlogFormProps) => {
  const { categories } = useCategories('blog');
  const [image, setImage] = useState<string[]>([]);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    excerpt: '',
    content: '',
    category: '',
    author: 'Gregory Vizualiza',
    read_time: '5 min',
    date: new Date().toISOString().split('T')[0],
    tags: []
  });

  useEffect(() => {
    if (editingPost) {
      setFormData({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        category: editingPost.category,
        author: editingPost.author,
        read_time: editingPost.read_time,
        date: editingPost.date,
        tags: editingPost.tags
      });
      
      setImage(editingPost.featured_image ? [editingPost.featured_image] : []);
    }
  }, [editingPost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      featured_image: image[0] || ''
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

  const handleImageSelected = (selectedImages: string[]) => {
    setImage(selectedImages);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        placeholder="Título do post"
        value={formData.title}
        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        required
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
      />

      <Textarea
        placeholder="Resumo/Excerpt do post"
        value={formData.excerpt}
        onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
        required
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
      />

      <Textarea
        placeholder="Conteúdo completo do post"
        value={formData.content}
        onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
        required
        rows={6}
        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
      />

      <div>
        <label className="block text-sm font-medium text-white mb-3">
          Imagem do Post
        </label>
        <ImageUpload
          onImagesSelected={handleImageSelected}
          maxImages={1}
          existingImages={image}
          bucket="blog-images"
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

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Autor"
          value={formData.author}
          onChange={(e) => setFormData(prev => ({ ...prev, author: e.target.value }))}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />

        <Input
          placeholder="Tempo de leitura (ex: 5 min)"
          value={formData.read_time}
          onChange={(e) => setFormData(prev => ({ ...prev, read_time: e.target.value }))}
          required
          className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
        />
      </div>

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
          {editingPost ? 'Atualizar' : 'Criar'}
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

export default BlogForm;
