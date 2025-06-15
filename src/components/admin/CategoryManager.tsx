
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2, GripVertical } from 'lucide-react';
import { useCategories, Category } from '@/hooks/useCategories';
import { useToast } from '@/hooks/use-toast';

interface CategoryManagerProps {
  type: 'project' | 'blog';
}

const CategoryManager = ({ type }: CategoryManagerProps) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const { 
    categories, 
    createCategory, 
    deleteCategory, 
    updateCategorySortOrder,
    isCreating, 
    isDeleting,
    isUpdating 
  } = useCategories(type);
  const { toast } = useToast();

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      toast({
        title: "Erro",
        description: "Nome da categoria não pode estar vazio",
        variant: "destructive"
      });
      return;
    }

    const existingCategory = categories.find(cat => 
      cat.name.toLowerCase() === newCategoryName.toLowerCase()
    );

    if (existingCategory) {
      toast({
        title: "Erro",
        description: "Categoria já existe",
        variant: "destructive"
      });
      return;
    }

    try {
      await createCategory({ name: newCategoryName.trim(), type });
      setNewCategoryName('');
      setIsAdding(false);
      toast({
        title: "Sucesso",
        description: "Categoria criada com sucesso"
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Falha ao criar categoria",
        variant: "destructive"
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string, categoryName: string) => {
    if (window.confirm(`Tem certeza que deseja excluir a categoria "${categoryName}"?`)) {
      try {
        await deleteCategory(categoryId);
        toast({
          title: "Sucesso",
          description: "Categoria excluída com sucesso"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao excluir categoria",
          variant: "destructive"
        });
      }
    }
  };

  const moveCategoryUp = async (index: number) => {
    if (index > 0) {
      const currentCategory = categories[index];
      const previousCategory = categories[index - 1];
      
      try {
        // Swap sort orders
        await updateCategorySortOrder({ 
          id: currentCategory.id, 
          newSortOrder: previousCategory.sort_order 
        });
        await updateCategorySortOrder({ 
          id: previousCategory.id, 
          newSortOrder: currentCategory.sort_order 
        });
        
        toast({
          title: "Sucesso",
          description: "Ordem da categoria alterada"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao alterar ordem da categoria",
          variant: "destructive"
        });
      }
    }
  };

  const moveCategoryDown = async (index: number) => {
    if (index < categories.length - 1) {
      const currentCategory = categories[index];
      const nextCategory = categories[index + 1];
      
      try {
        // Swap sort orders
        await updateCategorySortOrder({ 
          id: currentCategory.id, 
          newSortOrder: nextCategory.sort_order 
        });
        await updateCategorySortOrder({ 
          id: nextCategory.id, 
          newSortOrder: currentCategory.sort_order 
        });
        
        toast({
          title: "Sucesso",
          description: "Ordem da categoria alterada"
        });
      } catch (error) {
        toast({
          title: "Erro",
          description: "Falha ao alterar ordem da categoria",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">
          Gerenciar Categorias - {type === 'project' ? 'Projetos' : 'Blog'}
        </h3>
        {!isAdding && (
          <Button 
            onClick={() => setIsAdding(true)}
            className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Categoria
          </Button>
        )}
      </div>

      {/* Add new category form */}
      {isAdding && (
        <div className="mb-6 p-4 bg-white/5 rounded-lg border border-white/10">
          <div className="flex gap-2">
            <Input
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Nome da categoria"
              className="bg-white/5 border-white/20 text-white flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
            />
            <Button 
              onClick={handleAddCategory}
              disabled={isCreating || !newCategoryName.trim()}
              className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
            >
              {isCreating ? 'Criando...' : 'Adicionar'}
            </Button>
            <Button 
              onClick={() => {
                setIsAdding(false);
                setNewCategoryName('');
              }}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Categories list */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <div className="text-center py-8 text-white/60">
            Nenhuma categoria encontrada
          </div>
        ) : (
          categories.map((category, index) => (
            <div 
              key={category.id}
              className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 transition-colors"
            >
              <div className="cursor-move text-white/40 hover:text-white/60">
                <GripVertical className="w-4 h-4" />
              </div>
              
              <div className="flex-1 text-white">
                {category.name}
              </div>

              <div className="flex gap-1">
                <Button
                  onClick={() => moveCategoryUp(index)}
                  disabled={index === 0 || isUpdating}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                >
                  ↑
                </Button>
                <Button
                  onClick={() => moveCategoryDown(index)}
                  disabled={index === categories.length - 1 || isUpdating}
                  variant="ghost"
                  size="sm"
                  className="text-white/60 hover:text-white hover:bg-white/10 w-8 h-8 p-0"
                >
                  ↓
                </Button>
                <Button
                  onClick={() => handleDeleteCategory(category.id, category.name)}
                  disabled={isDeleting}
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 w-8 h-8 p-0"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CategoryManager;
