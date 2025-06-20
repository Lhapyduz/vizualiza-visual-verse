
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, FolderOpen, FileText, Tag, BarChart3, Share2, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectForm, { ProjectFormData } from './admin/ProjectForm';
import BlogForm, { BlogFormData } from './admin/BlogForm';
import CategoryManager from './admin/CategoryManager';
import Analytics from './admin/Analytics';
import SocialMediaManager from './admin/SocialMediaManager';
import DragDropList from './admin/DragDropList';
import QuickActions from './admin/QuickActions';
import { Project, useProjects } from '@/hooks/useProjects';
import { BlogPost, useBlogPosts } from '@/hooks/useBlogPosts';

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
  const [searchQuery, setSearchQuery] = useState('');

  // Get projects and blog posts data
  const { projects, deleteProject, isDeleting: isDeletingProject, createProject, updateProject, isCreating: isCreatingProject, isUpdating: isUpdatingProject } = useProjects();
  const { posts, deletePost, isDeleting: isDeletingPost, createPost, updatePost, isCreating: isCreatingPost, isUpdating: isUpdatingPost } = useBlogPosts();

  const tabs = [
    { id: 'projects', label: 'Projetos', icon: FolderOpen, color: 'text-blue-400' },
    { id: 'blog', label: 'Blog', icon: FileText, color: 'text-green-400' },
    { id: 'categories', label: 'Categorias', icon: Tag, color: 'text-purple-400' },
    { id: 'social', label: 'Redes Sociais', icon: Share2, color: 'text-pink-400' },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, color: 'text-orange-400' }
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
    console.log('Edit project:', project);
  };

  const handleEditPost = (post: BlogPost) => {
    console.log('Edit post:', post);
  };

  const handleProjectSubmit = async (data: ProjectFormData) => {
    try {
      if (editingProject) {
        const { images, ...projectInfo } = data;
        const imageUrls = images?.map(img => typeof img === 'string' ? img : img.image_url || img.url || '') || [];
        await updateProject({
          id: editingProject.id,
          ...projectInfo,
          images: imageUrls
        });
      } else {
        const { images, ...projectInfo } = data;
        const imageUrls = images?.map(img => typeof img === 'string' ? img : img.image_url || img.url || '') || [];
        await createProject({
          ...projectInfo,
          images: imageUrls
        });
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

  const handleReorderProjects = (reorderedProjects: any[]) => {
    // Implementar reordenação no backend se necessário
    console.log('Reordered projects:', reorderedProjects);
  };

  const handleReorderPosts = (reorderedPosts: any[]) => {
    // Implementar reordenação no backend se necessário
    console.log('Reordered posts:', reorderedPosts);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleSettings = () => {
    setActiveTab('categories');
  };

  const filteredProjects = projects.filter(project =>
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FolderOpen className="w-6 h-6 text-blue-400" />
                  Projetos
                  <span className="text-sm font-normal text-gray-400">({filteredProjects.length})</span>
                </h2>
                <p className="text-gray-400 mt-1">Gerencie seus projetos com drag & drop</p>
              </div>
              <div className="flex gap-3">
                <QuickActions
                  onAddProject={handleAddProject}
                  onAddPost={handleAddBlog}
                  onSearch={handleSearch}
                  onSettings={handleSettings}
                />
                <Button
                  onClick={handleAddProject}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Projeto
                </Button>
              </div>
            </div>
            <DragDropList
              items={filteredProjects.map(project => ({
                id: project.id,
                title: project.title,
                category: project.category,
                date: project.date,
                featured_image: project.featured_image
              }))}
              onReorder={handleReorderProjects}
              onEdit={handleEditProject}
              onDelete={deleteProject}
              type="project"
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
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-green-400" />
                  Blog Posts
                  <span className="text-sm font-normal text-gray-400">({filteredPosts.length})</span>
                </h2>
                <p className="text-gray-400 mt-1">Gerencie seus posts com facilidade</p>
              </div>
              <div className="flex gap-3">
                <QuickActions
                  onAddProject={handleAddProject}
                  onAddPost={handleAddBlog}
                  onSearch={handleSearch}
                  onSettings={handleSettings}
                />
                <Button
                  onClick={handleAddBlog}
                  className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-green-500/25 transition-all duration-300"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Post
                </Button>
              </div>
            </div>
            <DragDropList
              items={filteredPosts.map(post => ({
                id: post.id,
                title: post.title,
                category: post.category,
                date: post.date,
                featured_image: post.featured_image,
                status: 'published'
              }))}
              onReorder={handleReorderPosts}
              onEdit={handleEditPost}
              onDelete={deletePost}
              type="blog"
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
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        className="w-full max-w-7xl max-h-[95vh] bg-gradient-to-br from-vizualiza-bg-dark/95 to-vizualiza-bg-light/95 backdrop-blur-xl rounded-2xl border border-white/20 shadow-2xl overflow-hidden"
      >
        {/* Modern Header with Glassmorphism */}
        <div className="relative p-6 border-b border-white/10 bg-gradient-to-r from-vizualiza-purple/10 to-vizualiza-orange/10">
          <div className="absolute inset-0 bg-white/5 backdrop-blur-sm" />
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-vizualiza-purple to-vizualiza-orange rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
                <p className="text-gray-400 text-sm">Gerencie seu conteúdo com facilidade</p>
              </div>
            </div>
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-200"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        <div className="flex h-[calc(95vh-120px)]">
          {/* Modern Sidebar */}
          <div className="w-64 bg-gradient-to-b from-white/5 to-white/2 border-r border-white/10 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <motion.button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                      isActive
                        ? 'bg-gradient-to-r from-vizualiza-purple/20 to-vizualiza-purple/10 text-white border border-vizualiza-purple/30 shadow-lg'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? tab.color : ''}`} />
                    <span className="font-medium">{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTab"
                        className="ml-auto w-2 h-2 bg-vizualiza-purple rounded-full"
                      />
                    )}
                  </motion.button>
                );
              })}
            </nav>
          </div>

          {/* Content Area with Enhanced Scrolling */}
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {renderContent()}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default AdminPanel;
