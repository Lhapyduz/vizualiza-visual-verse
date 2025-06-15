
import { useState, useEffect } from 'react';
import { X, Plus, Briefcase, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useProjects, Project } from '@/hooks/useProjects';
import { useBlogPosts, BlogPost } from '@/hooks/useBlogPosts';
import ProjectForm, { ProjectFormData } from './admin/ProjectForm';
import BlogForm, { BlogFormData } from './admin/BlogForm';
import ProjectList from './admin/ProjectList';
import BlogList from './admin/BlogList';

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

  useEffect(() => {
    if (editingProject) {
      setActiveTab('projects');
      setEditingProjectState(editingProject);
      setIsCreating(true);
      onClearEditingProject?.();
    }

    if (editingPost) {
      setActiveTab('posts');
      setEditingPostState(editingPost);
      setIsCreating(true);
      onClearEditingPost?.();
    }
  }, [editingProject, editingPost, onClearEditingProject, onClearEditingPost]);

  const handleProjectSubmit = (data: ProjectFormData) => {
    console.log('Submitting project data:', data);

    if (editingProjectState) {
      // For updates, convert images array to ProjectImage format
      const updateData = {
        ...data,
        images: data.images?.map((url, index) => ({
          id: '',
          project_id: editingProjectState.id,
          image_url: url,
          sort_order: index
        })) || []
      };
      updateProject({ id: editingProjectState.id, ...updateData });
    } else {
      createProject(data);
    }

    resetProjectForm();
  };

  const handlePostSubmit = (data: BlogFormData) => {
    console.log('Submitting post data:', data);

    if (editingPostState) {
      updatePost({ id: editingPostState.id, ...data });
    } else {
      createPost(data);
    }

    resetPostForm();
  };

  const handleEditProject = (project: Project) => {
    setEditingProjectState(project);
    setIsCreating(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPostState(post);
    setIsCreating(true);
  };

  const resetProjectForm = () => {
    setEditingProjectState(null);
    setIsCreating(false);
  };

  const resetPostForm = () => {
    setEditingPostState(null);
    setIsCreating(false);
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
                <ProjectForm
                  onSubmit={handleProjectSubmit}
                  onCancel={resetProjectForm}
                  editingProject={editingProjectState}
                  isLoading={isCreatingProject || isUpdatingProject}
                />
              )}
            </div>

            {/* Projects List */}
            <ProjectList
              projects={projects}
              onEdit={handleEditProject}
              onDelete={deleteProject}
              isDeleting={isDeletingProject}
            />
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
                <BlogForm
                  onSubmit={handlePostSubmit}
                  onCancel={resetPostForm}
                  editingPost={editingPostState}
                  isLoading={isCreatingPost || isUpdatingPost}
                />
              )}
            </div>

            {/* Posts List */}
            <BlogList
              posts={posts}
              onEdit={handleEditPost}
              onDelete={deletePost}
              isDeleting={isDeletingPost}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
