
import React, { useState } from 'react';
import { motion, Reorder } from 'framer-motion';
import { GripVertical, Edit, Trash2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface DragDropItem {
  id: string;
  title: string;
  status?: 'published' | 'draft';
  category?: string;
  date?: string;
  featured_image?: string;
}

interface DragDropListProps {
  items: DragDropItem[];
  onReorder: (items: DragDropItem[]) => void;
  onEdit: (item: DragDropItem) => void;
  onDelete: (id: string) => void;
  onView?: (item: DragDropItem) => void;
  type: 'project' | 'blog';
  isDeleting?: boolean;
}

const DragDropList: React.FC<DragDropListProps> = ({
  items,
  onReorder,
  onEdit,
  onDelete,
  onView,
  type,
  isDeleting = false
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  const handleSelect = (id: string, isCtrlPressed: boolean) => {
    if (isCtrlPressed) {
      setSelectedItems(prev => 
        prev.includes(id) 
          ? prev.filter(item => item !== id)
          : [...prev, id]
      );
    } else {
      setSelectedItems([id]);
    }
  };

  const handleBulkDelete = () => {
    selectedItems.forEach(id => onDelete(id));
    setSelectedItems([]);
  };

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 bg-vizualiza-purple/10 rounded-lg border border-vizualiza-purple/20"
        >
          <span className="text-sm text-white">
            {selectedItems.length} item{selectedItems.length > 1 ? 's' : ''} selecionado{selectedItems.length > 1 ? 's' : ''}
          </span>
          <Button
            size="sm"
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={isDeleting}
            className="ml-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Deletar Selecionados
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => setSelectedItems([])}
            className="border-white/20 text-white hover:bg-white/10"
          >
            Cancelar
          </Button>
        </motion.div>
      )}

      {/* Drag & Drop List */}
      <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-3">
        {items.map((item) => (
          <Reorder.Item
            key={item.id}
            value={item}
            className={cn(
              "group relative",
              selectedItems.includes(item.id) && "ring-2 ring-vizualiza-purple/50"
            )}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
          >
            <motion.div
              layout
              className="flex items-center gap-4 p-4 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10 hover:border-vizualiza-purple/30 transition-all duration-300 cursor-pointer"
              onClick={(e) => handleSelect(item.id, e.ctrlKey || e.metaKey)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Drag Handle */}
              <div className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-white transition-colors">
                <GripVertical className="w-5 h-5" />
              </div>

              {/* Image Preview */}
              {item.featured_image && (
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-white/10">
                  <img 
                    src={item.featured_image} 
                    alt={item.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {item.category && (
                    <Badge variant="outline" className="text-xs border-vizualiza-purple/30 text-vizualiza-purple">
                      {item.category}
                    </Badge>
                  )}
                  {item.status && (
                    <Badge 
                      variant={item.status === 'published' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {item.status === 'published' ? 'Publicado' : 'Rascunho'}
                    </Badge>
                  )}
                  {item.date && (
                    <span className="text-xs text-gray-400">
                      {new Date(item.date).toLocaleDateString('pt-BR')}
                    </span>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className={cn(
                "flex items-center gap-2 transition-all duration-200",
                hoveredItem === item.id ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4"
              )}>
                {onView && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      onView(item);
                    }}
                    className="text-gray-400 hover:text-white hover:bg-white/10"
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(item);
                  }}
                  className="text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(item.id);
                  }}
                  disabled={isDeleting}
                  className="text-gray-400 hover:text-red-400 hover:bg-red-500/10"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              {/* Selection Indicator */}
              {selectedItems.includes(item.id) && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 w-6 h-6 bg-vizualiza-purple rounded-full flex items-center justify-center"
                >
                  <div className="w-3 h-3 bg-white rounded-full" />
                </motion.div>
              )}
            </motion.div>
          </Reorder.Item>
        ))}
      </Reorder.Group>

      {items.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12 text-gray-400"
        >
          <div className="text-4xl mb-4">📝</div>
          <p>Nenhum {type === 'project' ? 'projeto' : 'post'} encontrado</p>
          <p className="text-sm mt-2">Clique em "Adicionar" para criar seu primeiro item</p>
        </motion.div>
      )}
    </div>
  );
};

export default DragDropList;
