import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FolderOpen, FileText, Tag, BarChart3, Share2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectList from './admin/ProjectList';
import ProjectForm, { ProjectFormData } from './admin/ProjectForm';
import BlogList from './admin/BlogList';
import BlogForm, { BlogFormData } from './admin/BlogForm';
import CategoryManager from './admin/CategoryManager';
import Analytics from './admin/Analytics';
import { Project, useProjects } from '@/hooks/useProjects';
import { BlogPost, useBlogPosts } from '@/hooks/useBlogPosts';
import SocialMediaManager from './admin/SocialMediaManager';

interface AdminPanelProps {
  onClose: () => void;
  editingProject: Project | null;
  editingPost: BlogPost | null;
  onClearEditingProject: () => void;
  onClearEditingPost: () => void;
}

const AdminPanel = ({ onClose, editingProject, editingPost, onClearEditingProject, onClearEditingPost }: AdminPanelProps) => {
  const [activeTab, setActiveTab] = useState(() => {
    if (editingProject) return 'projects';
    if (editingPost) return 'blog';
    return 'projects';
  });
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showBlogForm, setShowBlogForm] = useState(false);

  // Get projects and blog posts data
  const { projects, deleteProject, isDeleting: isDeletingProject, createProject, updateProject, isCreating: isCreatingProject, isUpdating: isUpdatingProject } = useProjects();
  const { posts, deletePost, isDeleting: isDeletingPost, createPost, updatePost, isCreating: isCreatingPost, isUpdating: isUpdatingPost } = useBlogPosts();

  const tabs = [
    { id: 'projects', label: 'Projetos', icon: FolderOpen },
    { id: 'blog', label: 'Blog', icon: FileText },
    { id: 'categories', label: 'Categorias', icon: Tag },
    { id: 'social', label: 'Redes Sociais', icon: Share2 },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 }
  ];

  useEffect(() => {
    if (editingProject) {
      setActiveTab('projects');
      setShowProjectForm(true);
    } else if (editingPost) {
      setActiveTab('blog');
      setShowBlogForm(true);
    }
  }, [editingProject, editingPost]);

  const handleEditProject = (project: Project) => {
    // This would be handled by the parent component
    console.log('Edit project:', project);
  };

  const handleEditPost = (post: BlogPost) => {
    // This would be handled by the parent component
    console.log('Edit post:', post);
  };

  const handleProjectSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        // For updating, convert string URLs to proper format expected by updateProject
        const updateData = {
          id: editingProject.id,
          title: data.title,
          description: data.description,
          category: data.category,
          date: data.date,
          tags: data.tags,
          featured_image: data.featured_image,
          images: data.images || [] // Pass as string array for update
        };
        await updateProject(updateData);
      } else {
        // For creating, ensure we pass string array as expected by createProject
        const createData = {
          title: data.title,
          description: data.description,
          category: data.category,
          date: data.date,
          tags: data.tags,
          featured_image: data.featured_image,
          images: data.images || [] // Pass as string array for create
        };
        await createProject(createData);
      }
      onClearEditingProject();
      setShowProjectForm(false);
    } catch (error) {
      console.error('Error submitting project:', error);
    }
  };

  const handleBlogSubmit = async (data: BlogFormData) => {
    try {
      const blogData = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        category: data.category,
        author: data.author,
        read_time: data.readTime || '5 min',
        tags: data.tags,
        featured_image: data.images?.[0] || '',
        date: data.date
      };
      
      if (editingPost) {
        await updatePost({ id: editingPost.id, ...blogData });
      } else {
        await createPost(blogData);
      }
      onClearEditingPost();
      setShowBlogForm(false);
    } catch (error) {
      console.error('Error submitting blog post:', error);
    }
  };

  const handleAddProject = () => {
    setShowProjectForm(true);
    setActiveTab('projects');
  };

  const handleAddBlog = () => {
    setShowBlogForm(true);
    setActiveTab('blog');
  };

  const handleCancelProject = () => {
    setShowProjectForm(false);
    onClearEditingProject();
  };

  const handleCancelBlog = () => {
    setShowBlogForm(false);
    onClearEditingPost();
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return (showProjectForm || editingProject) ? (
          <ProjectForm
            editingProject={editingProject}
            onSubmit={handleProjectSubmit}
            onCancel={handleCancelProject}
            isLoading={isCreatingProject || isUpdatingProject}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Projetos</h2>
              <Button
                onClick={handleAddProject}
                className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Projeto
              </Button>
            </div>
            <ProjectList
              projects={projects}
              onEdit={handleEditProject}
              onDelete={deleteProject}
              isDeleting={isDeletingProject}
            />
          </div>
        );
      case 'blog':
        return (showBlogForm || editingPost) ? (
          <BlogForm
            editingPost={editingPost}
            onSubmit={handleBlogSubmit}
            onCancel={handleCancelBlog}
            isLoading={isCreatingPost || isUpdatingPost}
          />
        ) : (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Blog Posts</h2>
              <Button
                onClick={handleAddBlog}
                className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Post
              </Button>
            </div>
            <BlogList
              posts={posts}
              onEdit={handleEditPost}
              onDelete={deletePost}
              isDeleting={isDeletingPost}
            />
          </div>
        );
      case 'categories':
        return <CategoryManager type="project" />;
      case 'social':
        return <SocialMediaManager />;
      case 'analytics':
        return <Analytics />;
      default:
        return (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Projetos</h2>
              <Button
                onClick={handleAddProject}
                className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
              >
                <Plus className="w-4 h-4 mr-2" />
                Adicionar Projeto
              </Button>
            </div>
            <ProjectList
              projects={projects}
              onEdit={handleEditProject}
              onDelete={deleteProject}
              isDeleting={isDeletingProject}
            />
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-7xl max-h-[90vh] bg-vizualiza-bg-dark rounded-xl border border-white/20 overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
          <Button
            onClick={onClose}
            variant="ghost"
            size="icon"
            className="text-gray-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="flex h-[calc(90vh-100px)]">
          {/* Sidebar */}
          <div className="w-64 bg-white/5 border-r border-white/10 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-vizualiza-purple text-white'
                        : 'text-gray-400 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {renderContent()}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
