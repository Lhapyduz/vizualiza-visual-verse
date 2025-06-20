
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Command, Plus, Search, Settings, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface QuickAction {
  id: string;
  label: string;
  shortcut: string;
  icon: React.ReactNode;
  action: () => void;
  category: 'create' | 'navigate' | 'settings';
}

interface QuickActionsProps {
  onAddProject: () => void;
  onAddPost: () => void;
  onSearch: (query: string) => void;
  onSettings: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onAddProject,
  onAddPost,
  onSearch,
  onSettings
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);

  const actions: QuickAction[] = [
    {
      id: 'add-project',
      label: 'Adicionar Projeto',
      shortcut: 'Ctrl+P',
      icon: <Plus className="w-4 h-4" />,
      action: onAddProject,
      category: 'create'
    },
    {
      id: 'add-post',
      label: 'Adicionar Post',
      shortcut: 'Ctrl+B',
      icon: <Plus className="w-4 h-4" />,
      action: onAddPost,
      category: 'create'
    },
    {
      id: 'search',
      label: 'Buscar',
      shortcut: 'Ctrl+F',
      icon: <Search className="w-4 h-4" />,
      action: () => {
        onSearch(searchQuery);
        setIsOpen(false);
      },
      category: 'navigate'
    },
    {
      id: 'settings',
      label: 'Configurações',
      shortcut: 'Ctrl+,',
      icon: <Settings className="w-4 h-4" />,
      action: onSettings,
      category: 'settings'
    }
  ];

  const filteredActions = actions.filter(action =>
    action.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'k':
            e.preventDefault();
            setIsOpen(true);
            break;
          case 'p':
            e.preventDefault();
            onAddProject();
            break;
          case 'b':
            e.preventDefault();
            onAddPost();
            break;
          case 'f':
            e.preventDefault();
            onSearch('');
            break;
          case ',':
            e.preventDefault();
            onSettings();
            break;
        }
      }

      if (isOpen) {
        switch (e.key) {
          case 'Escape':
            setIsOpen(false);
            setSearchQuery('');
            setActiveIndex(0);
            break;
          case 'ArrowDown':
            e.preventDefault();
            setActiveIndex(prev => 
              prev < filteredActions.length - 1 ? prev + 1 : 0
            );
            break;
          case 'ArrowUp':
            e.preventDefault();
            setActiveIndex(prev => 
              prev > 0 ? prev - 1 : filteredActions.length - 1
            );
            break;
          case 'Enter':
            e.preventDefault();
            if (filteredActions[activeIndex]) {
              filteredActions[activeIndex].action();
              setIsOpen(false);
              setSearchQuery('');
              setActiveIndex(0);
            }
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeIndex, filteredActions, onAddProject, onAddPost, onSearch, onSettings, searchQuery]);

  const categoryColors = {
    create: 'text-green-400 border-green-400/30',
    navigate: 'text-blue-400 border-blue-400/30',
    settings: 'text-purple-400 border-purple-400/30'
  };

  return (
    <>
      {/* Trigger Button */}
      <Button
        onClick={() => setIsOpen(true)}
        variant="outline"
        className="gap-2 border-white/20 bg-white/5 hover:bg-white/10 text-white backdrop-blur-sm"
      >
        <Zap className="w-4 h-4" />
        <span className="hidden sm:inline">Quick Actions</span>
        <div className="hidden sm:flex items-center gap-1 text-xs text-gray-400">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </Button>

      {/* Command Palette */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-start justify-center pt-20"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: -20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: -20 }}
              className="w-full max-w-lg mx-4 bg-vizualiza-bg-dark/95 backdrop-blur-md rounded-xl border border-white/20 shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Search Input */}
              <div className="p-4 border-b border-white/10">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setActiveIndex(0);
                    }}
                    placeholder="Digite um comando ou busque..."
                    className="pl-10 bg-white/5 border-white/20 text-white placeholder:text-gray-400 focus:border-vizualiza-purple/50"
                  />
                </div>
              </div>

              {/* Actions List */}
              <div className="max-h-80 overflow-y-auto">
                {filteredActions.map((action, index) => (
                  <motion.button
                    key={action.id}
                    onClick={() => {
                      action.action();
                      setIsOpen(false);
                      setSearchQuery('');
                      setActiveIndex(0);
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-white/5 transition-colors",
                      index === activeIndex && "bg-vizualiza-purple/20 border-r-2 border-vizualiza-purple"
                    )}
                    whileHover={{ x: 4 }}
                  >
                    <div className={cn(
                      "w-8 h-8 rounded-md border flex items-center justify-center",
                      categoryColors[action.category]
                    )}>
                      {action.icon}
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-medium">{action.label}</div>
                      <div className="text-xs text-gray-400 capitalize">{action.category}</div>
                    </div>
                    <div className="text-xs text-gray-400 font-mono">
                      {action.shortcut}
                    </div>
                  </motion.button>
                ))}

                {filteredActions.length === 0 && (
                  <div className="px-4 py-8 text-center text-gray-400">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>Nenhum comando encontrado</p>
                    <p className="text-xs mt-1">Tente outro termo de busca</p>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="px-4 py-3 border-t border-white/10 bg-white/5">
                <div className="flex items-center justify-between text-xs text-gray-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <div className="w-4 h-4 border border-gray-400 rounded text-center text-[10px]">↑</div>
                      <div className="w-4 h-4 border border-gray-400 rounded text-center text-[10px]">↓</div>
                      navegar
                    </span>
                    <span className="flex items-center gap-1">
                      <div className="px-1.5 py-0.5 border border-gray-400 rounded text-[10px]">Enter</div>
                      executar
                    </span>
                  </div>
                  <span className="flex items-center gap-1">
                    <div className="px-1.5 py-0.5 border border-gray-400 rounded text-[10px]">Esc</div>
                    fechar
                  </span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickActions;
