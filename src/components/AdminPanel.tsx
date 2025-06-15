
import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, Save, Loader2, Briefcase, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import ImageUpload from './ImageUpload';
import { useProjects, Project } from '@/hooks/useProjects';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import { useCategories } from '@/hooks/useCategories';

interface AdminPanelProps {
  onClose: () => void;
  editingProject?: Project | null;
  editingPost?: BlogPost | null;
  onClearEditingProject?: () => void;
  onClearEditingPost?: () => void;
}

const AdminPanel = ({ 
  onClose, 
  editingProject, 
  editingPost,
  onClearEditingProject, 
  onClearEditingPost 
}: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState<'projects' | 'posts'>('projects');
  const [editingProjectState, setEditingProjectState] = useState<Project | null>(null);
  const [editingPostState, setEditingPostState] = useState<BlogPost | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [projectImages, setProjectImages] = useState<string[]>([]);
  const [postImage, setPostImage] = useState<string[]>([]);
  const { toast } = useToast();

  // Hooks for data management
  const { 
    projects, 
    createProject, 
    updateProject, 
    deleteProject,
    isCreating: isCreatingProject,
    isUpdating: isUpdatingProject,
    isDeleting: isDeletingProject
  } = useProjects();

  const { 
    posts, 
    createPost, 
    updatePost, 
    deletePost,
    isCreating: isCreatingPost,
    isUpdating: isUpdatingPost,
    isDeleting: isDeletingPost
  } = useBlogPosts();

  const { categories: projectCategories } = useCategories('project');
  const { categories: postCategories } = useCategories('blog');

  const initialProject = {
    title: '',
    description: '',
    featured_image: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    tags: []
  };

  const initialPost = {
    title: '',
    excerpt: '',
    content: '',
    featured_image: '',
    category: '',
    date: new Date().toISOString().split('T')[0],
    author: 'Gregory Vizualiza',
    read_time: '5 min',
    tags: []
  };

  const [projectFormData, setProjectFormData] = useState(initialProject);
  const [postFormData, setPostFormData] = useState(initialPost);

  useEffect(() => {
    // Se há um projeto sendo editado
    if (editingProject) {
      setActiveTab('projects');
      setEditingProjectState(editingProject);
      setProjectFormData({
        title: editingProject.title,
        description: editingProject.description,
        featured_image: editingProject.featured_image || '',
        category: editingProject.category,
        date: editingProject.date,
        tags: editingProject.tags
      });
      const images = editingProject.images?.map(img => img.image_url) || [];
      if (editingProject.featured_image) {
        images.unshift(editingProject.featured_image);
      }
      setProjectImages([...new Set(images)]); // Remove duplicates
      setIsCreating(true);
      
      onClearEditingProject?.();
    }

    // Se há um post sendo editado
    if (editingPost) {
      setActiveTab('posts');
      setEditingPostState(editingPost);
      setPostFormData({
        title: editingPost.title,
        excerpt: editingPost.excerpt,
        content: editingPost.content,
        featured_image: editingPost.featured_image || '',
        category: editingPost.category,
        date: editingPost.date,
        author: editingPost.author,
        read_time: editingPost.read_time,
        tags: editingPost.tags
      });
      setPostImage(editingPost.featured_image ? [editingPost.featured_image] : []);
      setIsCreating(true);
      
      onClearEditingPost?.();
    }
  }, [editingProject, editingPost, onClearEditingProject, onClearEditingPost]);

  const handleProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const projectData = {
      ...projectFormData,
      featured_image: projectImages[0] || '',
      images: projectImages
    };

    console.log('Submitting project data:', projectData);

    if (editingProjectState) {
      // Convert string[] to ProjectImage[] format for update
      const updateData = {
        ...projectData,
        images: projectImages.map((url, index) => ({
          id: '', // Will be handled by the backend
          project_id: editingProjectState.id,
          image_url: url,
          sort_order: index
        }))
      };
      updateProject({ id: editingProjectState.id, ...updateData });
    } else {
      createProject(projectData);
    }

    resetProjectForm();
  };

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const postData = {
      ...postFormData,
      featured_image: postImage[0] || ''
    };

    if (editingPostState) {
      updatePost({ id: editingPostState.id, ...postData });
    } else {
      createPost(postData);
    }

    resetPostForm();
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectState(project);
    setProjectFormData({
      title: project.title,
      description: project.description,
      featured_image: project.featured_image || '',
      category: project.category,
      date: project.date,
      tags: project.tags
    });
    const images = project.images?.map(img => img.image_url) || [];
    if (project.featured_image) {
      images.unshift(project.featured_image);
    }
    setProjectImages([...new Set(images)]);
    setIsCreating(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostState(post);
    setPostFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured_image: post.featured_image || '',
      category: post.category,
      date: post.date,
      author: post.author,
      read_time: post.read_time,
      tags: post.tags
    });
    setPostImage(post.featured_image ? [post.featured_image] : []);
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
    setPostImage([]);
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
      setProjectFormData(prev => ({ 
        ...prev, 
        featured_image: images[0]
      }));
    }
  };

  const handlePostImageSelected = (images: string[]) => {
    setPostImage(images);
    if (images.length > 0) {
      setPostFormData(prev => ({ 
        ...prev, 
        featured_image: images[0]
      }));
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
                      bucket="project-images"
                    />
                  </div>

                  <Select value={projectFormData.category} onValueChange={(value) => setProjectFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {projectCategories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
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
                      disabled={isCreatingProject || isUpdatingProject}
                      className="flex-1 bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                    >
                      {(isCreatingProject || isUpdatingProject) ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
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
                          onClick={() => deleteProject(project.id)}
                          disabled={isDeletingProject}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          {isDeletingProject ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
                      existingImages={postImage}
                      bucket="blog-images"
                    />
                  </div>

                  <Select value={postFormData.category} onValueChange={(value) => setPostFormData(prev => ({ ...prev, category: value }))}>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                    <SelectContent>
                      {postCategories.map(category => (
                        <SelectItem key={category.id} value={category.name}>
                          {category.name}
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
                      value={postFormData.read_time}
                      onChange={(e) => setPostFormData(prev => ({ 
                        ...prev, 
                        read_time: e.target.value
                      }))}
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
                      disabled={isCreatingPost || isUpdatingPost}
                      className="flex-1 bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                    >
                      {(isCreatingPost || isUpdatingPost) ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4 mr-2" />
                      )}
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
                          onClick={() => deletePost(post.id)}
                          disabled={isDeletingPost}
                          size="sm"
                          variant="outline"
                          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                        >
                          {isDeletingPost ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
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
