
import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AdminPanelProps {
  onClose: () => void;
}

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  tags: string[];
}

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const categories = ['Identidade Visual', 'Design Gráfico', 'Fotografia', 'Web Design'];

  const initialProject: Omit<Project, 'id'> = {
    title: '',
    description: '',
    image: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: []
  };

  const [formData, setFormData] = useState<Omit<Project, 'id'>>(initialProject);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const savedProjects = localStorage.getItem('vizualiza-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem('vizualiza-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProject) {
      // Editar projeto existente
      const updatedProjects = projects.map(p => 
        p.id === editingProject.id 
          ? { ...formData, id: editingProject.id }
          : p
      );
      saveProjects(updatedProjects);
      toast({
        title: "Projeto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      // Criar novo projeto
      const newProject: Project = {
        ...formData,
        id: Date.now().toString()
      };
      const updatedProjects = [...projects, newProject];
      saveProjects(updatedProjects);
      toast({
        title: "Projeto criado!",
        description: "Novo projeto adicionado ao portfólio.",
      });
    }

    resetForm();
  };

  const handleDelete = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    saveProjects(updatedProjects);
    toast({
      title: "Projeto removido!",
      description: "O projeto foi excluído do portfólio.",
    });
  };

  const handleEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      date: project.date,
      tags: project.tags
    });
    setIsCreating(true);
  };

  const resetForm = () => {
    setFormData(initialProject);
    setEditingProject(null);
    setIsCreating(false);
  };

  const handleTagsChange = (value: string) => {
    const tags = value.split(',').map(tag => tag.trim()).filter(tag => tag);
    setFormData(prev => ({ ...prev, tags }));
  };

  return (
    <div className="min-h-screen bg-vizualiza-bg-dark text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pt-16">
          <h1 className="text-3xl font-bold">
            <span className="bg-vizualiza-gradient bg-clip-text text-transparent">
              Painel Administrativo
            </span>
          </h1>
          <Button 
            onClick={onClose}
            variant="outline"
            className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
          >
            <X className="w-5 h-5 mr-2" />
            Fechar
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Formulário */}
          <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                {editingProject ? 'Editar Projeto' : 'Novo Projeto'}
              </h2>
              {!isCreating && (
                <Button 
                  onClick={() => setIsCreating(true)}
                  className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Novo
                </Button>
              )}
            </div>

            {isCreating && (
              <form onSubmit={handleSubmit} className="space-y-4">
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
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />

                <Input
                  placeholder="URL da imagem"
                  value={formData.image}
                  onChange={(e) => setFormData(prev => ({ ...prev, image: e.target.value }))}
                  required
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />

                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
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
                  placeholder="Tags (separadas por vírgula)"
                  value={formData.tags.join(', ')}
                  onChange={(e) => handleTagsChange(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                />

                <div className="flex space-x-4">
                  <Button 
                    type="submit"
                    className="flex-1 bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {editingProject ? 'Atualizar' : 'Criar'}
                  </Button>
                  <Button 
                    type="button"
                    onClick={resetForm}
                    variant="outline"
                    className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                  >
                    Cancelar
                  </Button>
                </div>
              </form>
            )}
          </div>

          {/* Lista de Projetos */}
          <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
            <h2 className="text-xl font-semibold mb-6">Projetos Cadastrados</h2>
            
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {projects.map(project => (
                <div key={project.id} className="bg-white/5 p-4 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{project.title}</h3>
                      <p className="text-sm text-gray-400 mb-2">{project.category}</p>
                      <p className="text-xs text-gray-500">{new Date(project.date).toLocaleDateString('pt-BR')}</p>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleEdit(project)}
                        size="sm"
                        variant="outline"
                        className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(project.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              
              {projects.length === 0 && (
                <p className="text-gray-400 text-center py-8">
                  Nenhum projeto cadastrado ainda.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
