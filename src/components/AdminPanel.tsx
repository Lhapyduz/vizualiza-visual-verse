import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, Upload, Image, BookOpen, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';

interface AdminPanelProps {
  onClose: () => void;
  editingProject?: Project | null;
  editingPost?: BlogPost | null;
  onClearEditingProject?: () => void;
  onClearEditingPost?: () => void;
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

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

const AdminPanel = ({ 
  onClose, 
  editingProject, 
  editingPost,
  onClearEditingProject, 
  onClearEditingPost 
}: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'posts'>('projects');
  const [projects, setProjects] = useState<Project[]>([]);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [editingProjectState, setEditingProjectState] = useState<Project | null>(null);
  const [editingPostState, setEditingPostState] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const { toast } = useToast();

  const projectCategories = ['Identidade Visual', 'Design Gráfico', 'Fotografia', 'Web Design'];
  const postCategories = ['Design', 'Tecnologia', 'Branding', 'Tendências', 'Tutoriais'];

  const initialProject: Omit<Project, 'id'> = {
    title: '',
    description: '',
    image: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: []
  };

  const initialPost: Omit<BlogPost, 'id'> = {
    title: '',
    excerpt: '',
    content: '',
    image: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Gregory Vizualiza',
    readTime: '5 min',
    tags: []
  };

  const [projectFormData, setProjectFormData] = useState<Omit<Project, 'id'>>(initialProject);
  const [postFormData, setPostFormData] = useState<Omit<BlogPost, 'id'>>(initialPost);

  useEffect(() => {
    loadProjects();
    loadPosts();
    
    // Se há um projeto sendo editado
    if (editingProject) {
      setActiveTab('projects');
      setEditingProjectState(editingProject);
      setProjectFormData({
        title: editingProject.title,
        description: editingProject.description,
        image: editingProject.image,
        category: editingProject.category,
        date: editingProject.date,
        tags: editingProject.tags
      });
      setProjectImages([editingProject.image]);
      setIsCreating(true);
      
      if (onClearEditingProject) {
        onClearEditingProject();
      }
    }

    // Se há um post sendo editado
    if (editingPost) {
      setActiveTab('posts');
      setEditingPostState(editingPost);
      setPostFormData({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        image: editingPost.image,
        category: editingPost.category,
        date: editingPost.date,
        author: editingPost.author,
        readTime: editingPost.readTime,
        tags: editingPost.tags
      });
      setIsCreating(true);
      
      if (onClearEditingPost) {
        onClearEditingPost();
      }
    }
  }, [editingProject, editingPost, onClearEditingProject, onClearEditingPost]);

  const loadProjects = () => {
    const savedProjects = localStorage.getItem('vizualiza-projects');
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects));
    }
  };

  const loadPosts = () => {
    const savedPosts = localStorage.getItem('vizualiza-posts');
    if (savedPosts) {
      setPosts(JSON.parse(savedPosts));
    }
  };

  const saveProjects = (updatedProjects: Project[]) => {
    localStorage.setItem('vizualiza-projects', JSON.stringify(updatedProjects));
    setProjects(updatedProjects);
  };

  const savePosts = (updatedPosts: BlogPost[]) => {
    localStorage.setItem('vizualiza-posts', JSON.stringify(updatedPosts));
    setPosts(updatedPosts);
  };

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingProjectState) {
      const updatedProjects = projects.map(p => 
        p.id === editingProjectState.id 
          ? { ...projectFormData, id: editingProjectState.id }
          : p
      );
      saveProjects(updatedProjects);
      toast({
        title: "Projeto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      const newProject: Project = {
        ...projectFormData,
        id: Date.now().toString()
      };
      const updatedProjects = [...projects, newProject];
      saveProjects(updatedProjects);
      toast({
        title: "Projeto criado!",
        description: "Novo projeto adicionado ao portfólio.",
      });
    }

    resetProjectForm();
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingPostState) {
      const updatedPosts = posts.map(p => 
        p.id === editingPostState.id 
          ? { ...postFormData, id: editingPostState.id }
          : p
      );
      savePosts(updatedPosts);
      toast({
        title: "Post atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    } else {
      const newPost: BlogPost = {
        ...postFormData,
        id: Date.now().toString()
      };
      const updatedPosts = [...posts, newPost];
      savePosts(updatedPosts);
      toast({
        title: "Post criado!",
        description: "Novo post adicionado ao blog.",
      });
    }

    resetPostForm();
  };

  const handleDeleteProject = (id: string) => {
    const updatedProjects = projects.filter(p => p.id !== id);
    saveProjects(updatedProjects);
    toast({
      title: "Projeto removido!",
      description: "O projeto foi excluído do portfólio.",
    });
  };

  const handleDeletePost = (id: string) => {
    const updatedPosts = posts.filter(p => p.id !== id);
    savePosts(updatedPosts);
    toast({
      title: "Post removido!",
      description: "O post foi excluído do blog.",
    });
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectState(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
      date: project.date,
      tags: project.tags
    });
    setProjectImages([project.image]);
    setIsCreating(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostState(post);
    setPostFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      image: post.image,
      category: post.category,
      date: post.date,
      author: post.author,
      readTime: post.readTime,
      tags: post.tags
    });
    setIsCreating(true);
  };

  const resetProjectForm = () => {
    setProjectFormData(initialProject);
    setEditingProjectState(null);
    setProjectImages([]);
    setIsCreating(false);
  };

  const resetPostForm = () => {
    setPostFormData(initialPost);
    setEditingPostState(null);
    setIsCreating(false);
  };

  const handleProjectTagsChange = (value: string) => {
    const tags = value
      .replace(/,/g, ';')
      .split(';')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    setProjectFormData(prev => ({ ...prev, tags }));
  };

  const handlePostTagsChange = (value: string) => {
    const tags = value
      .replace(/,/g, ';')
      .split(';')
      .map(tag => tag.trim())
      .filter(tag => tag !== '');
    setPostFormData(prev => ({ ...prev, tags }));
  };

  const handleProjectImagesSelected = (images: string[]) => {
    setProjectImages(images);
    if (images.length > 0) {
      setProjectFormData(prev => ({ ...prev, image: images[0] }));
    }
  };

  const handlePostImageSelected = (images: string[]) => {
    if (images.length > 0) {
      setPostFormData(prev => ({ ...prev, image: images[0] }));
    }
  };

  return (
    <div className="min-h-screen bg-vizualiza-bg-dark text-white p-6">
      <div className="max-w-7xl mx-auto">
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

        {/* Tabs */}
        <div className="flex space-x-4 mb-8">
          <Button
            onClick={() => setActiveTab('projects')}
            variant={activeTab === 'projects' ? 'default' : 'outline'}
            className={activeTab === 'projects' 
              ? 'bg-vizualiza-purple hover:bg-vizualiza-purple-dark' 
              : 'border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white'
            }
          >
            <Briefcase className="w-4 h-4 mr-2" />
            Projetos
          </Button>
          <Button
            onClick={() => setActiveTab('posts')}
            variant={activeTab === 'posts' ? 'default' : 'outline'}
            className={activeTab === 'posts' 
              ? 'bg-vizualiza-purple hover:bg-vizualiza-purple-dark' 
              : 'border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white'
            }
          >
            <BookOpen className="w-4 h-4 mr-2" />
            Blog Posts
          </Button>
        </div>

        {/* Projects Tab */}
        {activeTab === 'projects' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Project Form */}
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingProjectState ? 'Editar Projeto' : 'Novo Projeto'}
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
                <form onSubmit={handleProjectSubmit} className="space-y-6">
                  <Input
                    placeholder="Título do projeto"
                    value={projectFormData.title}
                    onChange={(e) => setProjectFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <Textarea
                    placeholder="Descrição do projeto"
                    value={projectFormData.description}
                    onChange={(e) => setProjectFormData(prev => ({ ...prev, description: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Imagens do Projeto
                    </label>
                    <ImageUpload
                      onImagesSelected={handleProjectImagesSelected}
                      maxImages={5}
                      existingImages={projectImages}
                    />
                  </div>

                  <Select value={projectFormData.category} onValueChange={(value) => setProjectFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="date"
                    value={projectFormData.date}
                    onChange={(e) => setProjectFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />

                  <Input
                    placeholder="Tags (separadas por vírgula ou ponto e vírgula)"
                    value={projectFormData.tags.join('; ')}
                    onChange={(e) => handleProjectTagsChange(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <div className="flex space-x-4">
                    <Button 
                      type="submit"
                      className="flex-1 bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingProjectState ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button 
                      type="button"
                      onClick={resetProjectForm}
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Projects List */}
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
                          onClick={() => handleEditProject(project)}
                          size="sm"
                          variant="outline"
                          className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeleteProject(project.id)}
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
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Post Form */}
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">
                  {editingPostState ? 'Editar Post' : 'Novo Post'}
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
                <form onSubmit={handlePostSubmit} className="space-y-6">
                  <Input
                    placeholder="Título do post"
                    value={postFormData.title}
                    onChange={(e) => setPostFormData(prev => ({ ...prev, title: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <Textarea
                    placeholder="Resumo/Excerpt do post"
                    value={postFormData.excerpt}
                    onChange={(e) => setPostFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <Textarea
                    placeholder="Conteúdo completo do post"
                    value={postFormData.content}
                    onChange={(e) => setPostFormData(prev => ({ ...prev, content: e.target.value }))}
                    required
                    rows={6}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <div>
                    <label className="block text-sm font-medium text-white mb-3">
                      Imagem do Post
                    </label>
                    <ImageUpload
                      onImagesSelected={handlePostImageSelected}
                      maxImages={1}
                      existingImages={postFormData.image ? [postFormData.image] : []}
                    />
                  </div>

                  <Select value={postFormData.category} onValueChange={(value) => setPostFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {postCategories.map(category => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      placeholder="Autor"
                      value={postFormData.author}
                      onChange={(e) => setPostFormData(prev => ({ ...prev, author: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />

                    <Input
                      placeholder="Tempo de leitura (ex: 5 min)"
                      value={postFormData.readTime}
                      onChange={(e) => setPostFormData(prev => ({ ...prev, readTime: e.target.value }))}
                      required
                      className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                    />
                  </div>

                  <Input
                    type="date"
                    value={postFormData.date}
                    onChange={(e) => setPostFormData(prev => ({ ...prev, date: e.target.value }))}
                    required
                    className="bg-white/10 border-white/20 text-white"
                  />

                  <Input
                    placeholder="Tags (separadas por vírgula ou ponto e vírgula)"
                    value={postFormData.tags.join('; ')}
                    onChange={(e) => handlePostTagsChange(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
                  />

                  <div className="flex space-x-4">
                    <Button 
                      type="submit"
                      className="flex-1 bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {editingPostState ? 'Atualizar' : 'Criar'}
                    </Button>
                    <Button 
                      type="button"
                      onClick={resetPostForm}
                      variant="outline"
                      className="border-gray-600 text-gray-400 hover:bg-gray-600 hover:text-white"
                    >
                      Cancelar
                    </Button>
                  </div>
                </form>
              )}
            </div>

            {/* Posts List */}
            <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
              <h2 className="text-xl font-semibold mb-6">Posts Cadastrados</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {posts.map(post => (
                  <div key={post.id} className="bg-white/5 p-4 rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-1">{post.title}</h3>
                        <p className="text-sm text-gray-400 mb-2">{post.category}</p>
                        <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('pt-BR')}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          onClick={() => handleEditPost(post)}
                          size="sm"
                          variant="outline"
                          className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDeletePost(post.id)}
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
                
                {posts.length === 0 && (
                  <p className="text-gray-400 text-center py-8">
                    Nenhum post cadastrado ainda.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
