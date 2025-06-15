
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit, Trash2, Eye, EyeOff, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useSocialMedia, SocialMedia } from '@/hooks/useSocialMedia';

const PLATFORM_OPTIONS = [
  { value: 'instagram', label: 'Instagram', icon: 'instagram', color: 'from-purple-600 to-pink-600' },
  { value: 'linkedin', label: 'LinkedIn', icon: 'linkedin', color: 'from-blue-600 to-blue-800' },
  { value: 'facebook', label: 'Facebook', icon: 'facebook', color: 'from-blue-600 to-blue-700' },
  { value: 'twitter', label: 'Twitter/X', icon: 'twitter', color: 'from-gray-800 to-black' },
  { value: 'youtube', label: 'YouTube', icon: 'youtube', color: 'from-red-600 to-red-700' },
  { value: 'tiktok', label: 'TikTok', icon: 'music', color: 'from-black to-gray-800' },
  { value: 'behance', label: 'Behance', icon: 'palette', color: 'from-blue-500 to-blue-600' },
  { value: 'dribbble', label: 'Dribbble', icon: 'dribbble', color: 'from-pink-500 to-pink-600' }
];

const SocialMediaManager = () => {
  const { socialMedias, addSocialMedia, updateSocialMedia, removeSocialMedia, toggleSocialMedia } = useSocialMedia();
  const { toast } = useToast();
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    platform: '',
    handle: '',
    url: '',
    icon: '',
    color: ''
  });

  const handlePlatformChange = (platform: string) => {
    const platformData = PLATFORM_OPTIONS.find(p => p.value === platform);
    if (platformData) {
      setFormData({
        ...formData,
        platform: platformData.label,
        icon: platformData.icon,
        color: platformData.color
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.platform || !formData.handle || !formData.url) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive"
      });
      return;
    }

    if (editingId) {
      updateSocialMedia(editingId, {
        platform: formData.platform,
        handle: formData.handle,
        url: formData.url,
        icon: formData.icon,
        color: formData.color
      });
      toast({
        title: "Sucesso",
        description: "Rede social atualizada com sucesso!"
      });
      setEditingId(null);
    } else {
      addSocialMedia({
        platform: formData.platform,
        handle: formData.handle,
        url: formData.url,
        icon: formData.icon,
        color: formData.color,
        isActive: true
      });
      toast({
        title: "Sucesso",
        description: "Rede social adicionada com sucesso!"
      });
      setIsAdding(false);
    }

    setFormData({ platform: '', handle: '', url: '', icon: '', color: '' });
  };

  const handleEdit = (media: SocialMedia) => {
    setFormData({
      platform: media.platform,
      handle: media.handle,
      url: media.url,
      icon: media.icon,
      color: media.color
    });
    setEditingId(media.id);
    setIsAdding(true);
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ platform: '', handle: '', url: '', icon: '', color: '' });
  };

  const handleRemove = (id: string) => {
    if (confirm('Tem certeza que deseja remover esta rede social?')) {
      removeSocialMedia(id);
      toast({
        title: "Sucesso",
        description: "Rede social removida com sucesso!"
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold text-white">Gerenciar Redes Sociais</h3>
        <Button
          onClick={() => setIsAdding(true)}
          className="bg-vizualiza-purple hover:bg-vizualiza-purple/80"
          disabled={isAdding}
        >
          <Plus className="w-4 h-4 mr-2" />
          Adicionar Rede Social
        </Button>
      </div>

      {/* Formulário */}
      {isAdding && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10"
        >
          <h4 className="text-lg font-medium text-white mb-4">
            {editingId ? 'Editar Rede Social' : 'Adicionar Nova Rede Social'}
          </h4>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="platform" className="text-white">Plataforma *</Label>
              <Select onValueChange={handlePlatformChange} value={PLATFORM_OPTIONS.find(p => p.label === formData.platform)?.value || ''}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Selecione a plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {PLATFORM_OPTIONS.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="handle" className="text-white">Handle/Usuário *</Label>
              <Input
                id="handle"
                value={formData.handle}
                onChange={(e) => setFormData({ ...formData, handle: e.target.value })}
                placeholder="@seuusuario"
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div>
              <Label htmlFor="url" className="text-white">URL Completa *</Label>
              <Input
                id="url"
                type="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://..."
                className="bg-white/10 border-white/20 text-white"
              />
            </div>

            <div className="flex gap-2">
              <Button type="submit" className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {editingId ? 'Atualizar' : 'Salvar'}
              </Button>
              <Button type="button" onClick={handleCancel} variant="outline">
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
            </div>
          </form>
        </motion.div>
      )}

      {/* Lista de Redes Sociais */}
      <div className="grid gap-4">
        {socialMedias.map((media) => (
          <Card key={media.id} className="bg-white/5 border-white/10">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${media.color} flex items-center justify-center`}>
                    <span className="text-white text-sm font-bold">
                      {media.platform.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-white font-medium">{media.platform}</h4>
                    <p className="text-gray-400 text-sm">{media.handle}</p>
                    <a
                      href={media.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-vizualiza-purple text-xs hover:underline"
                    >
                      {media.url}
                    </a>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleSocialMedia(media.id)}
                    variant="ghost"
                    size="sm"
                    className={media.isActive ? 'text-green-400' : 'text-gray-400'}
                  >
                    {media.isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  </Button>
                  <Button
                    onClick={() => handleEdit(media)}
                    variant="ghost"
                    size="sm"
                    className="text-blue-400"
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleRemove(media.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {socialMedias.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>Nenhuma rede social configurada ainda.</p>
        </div>
      )}
    </div>
  );
};

export default SocialMediaManager;
