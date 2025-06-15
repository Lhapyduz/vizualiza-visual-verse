
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, FolderOpen, FileText, Tag, BarChart3, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProjectList from './admin/ProjectList';
import ProjectForm from './admin/ProjectForm';
import BlogList from './admin/BlogList';
import BlogForm from './admin/BlogForm';
import CategoryManager from './admin/CategoryManager';
import Analytics from './admin/Analytics';
import { Project } from '@/hooks/useProjects';
import { BlogPost } from '@/hooks/useBlogPosts';
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
    } else if (editingPost) {
      setActiveTab('blog');
    }
  }, [editingProject, editingPost]);

  const renderContent = () => {
    switch (activeTab) {
      case 'projects':
        return editingProject ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Editar Projeto</h3>
            <div className="text-gray-400">
              Funcionalidade de edição será implementada em breve.
            </div>
          </div>
        ) : (
          <ProjectList />
        );
      case 'blog':
        return editingPost ? (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white">Editar Post</h3>
            <div className="text-gray-400">
              Funcionalidade de edição será implementada em breve.
            </div>
          </div>
        ) : (
          <BlogList />
        );
      case 'categories':
        return <CategoryManager type="project" />;
      case 'social':
        return <SocialMediaManager />;
      case 'analytics':
        return <Analytics />;
      default:
        return <ProjectList />;
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
