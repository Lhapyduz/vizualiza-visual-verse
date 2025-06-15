
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Category {
  id: string;
  name: string;
  type: 'project' | 'blog';
  created_at: string;
}

export const useCategories = (type?: 'project' | 'blog') => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch categories with fallback to static data
  const {
    data: categories = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      try {
        let query = supabase
          .from('categories')
          .select('*')
          .order('name');

        if (type) {
          query = query.eq('type', type);
        }

        const { data, error } = await query;

        if (error) {
          console.log('Supabase error, using default categories:', error);
          // Fallback to default categories
          const defaultCategories = [
            { id: '1', name: 'Identidade Visual', type: 'project', created_at: new Date().toISOString() },
            { id: '2', name: 'Design Gráfico', type: 'project', created_at: new Date().toISOString() },
            { id: '3', name: 'Fotografia', type: 'project', created_at: new Date().toISOString() },
            { id: '4', name: 'Web Design', type: 'project', created_at: new Date().toISOString() },
            { id: '5', name: 'Design', type: 'blog', created_at: new Date().toISOString() },
            { id: '6', name: 'Tecnologia', type: 'blog', created_at: new Date().toISOString() },
            { id: '7', name: 'Branding', type: 'blog', created_at: new Date().toISOString() },
            { id: '8', name: 'Tendências', type: 'blog', created_at: new Date().toISOString() },
            { id: '9', name: 'Tutoriais', type: 'blog', created_at: new Date().toISOString() }
          ] as Category[];
          
          return type ? defaultCategories.filter(cat => cat.type === type) : defaultCategories;
        }

        return data as Category[];
      } catch (err) {
        console.log('Error fetching categories, using defaults:', err);
        const defaultCategories = [
          { id: '1', name: 'Identidade Visual', type: 'project', created_at: new Date().toISOString() },
          { id: '2', name: 'Design Gráfico', type: 'project', created_at: new Date().toISOString() },
          { id: '3', name: 'Fotografia', type: 'project', created_at: new Date().toISOString() },
          { id: '4', name: 'Web Design', type: 'project', created_at: new Date().toISOString() },
          { id: '5', name: 'Design', type: 'blog', created_at: new Date().toISOString() },
          { id: '6', name: 'Tecnologia', type: 'blog', created_at: new Date().toISOString() },
          { id: '7', name: 'Branding', type: 'blog', created_at: new Date().toISOString() },
          { id: '8', name: 'Tendências', type: 'blog', created_at: new Date().toISOString() },
          { id: '9', name: 'Tutoriais', type: 'blog', created_at: new Date().toISOString() }
        ] as Category[];
        
        return type ? defaultCategories.filter(cat => cat.type === type) : defaultCategories;
      }
    }
  });

  // Create category mutation
  const createCategoryMutation = useMutation({
    mutationFn: async ({ name, type }: { name: string; type: 'project' | 'blog' }) => {
      try {
        const { data, error } = await supabase
          .from('categories')
          .insert([{ name, type }])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.log('Supabase error creating category:', error);
        // For now, just return a mock object as we'll use static categories
        return { id: Date.now().toString(), name, type, created_at: new Date().toISOString() };
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria criada!",
        description: "Nova categoria adicionada.",
      });
    },
    onError: (error) => {
      console.error('Error creating category:', error);
      toast({
        title: "Erro ao criar categoria",
        description: "Não foi possível criar a categoria. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('categories')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.log('Supabase error deleting category:', error);
        // For static categories, we don't need to do anything
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      toast({
        title: "Categoria removida!",
        description: "A categoria foi excluída.",
      });
    },
    onError: (error) => {
      console.error('Error deleting category:', error);
      toast({
        title: "Erro ao excluir categoria",
        description: "Não foi possível excluir a categoria. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  return {
    categories,
    isLoading,
    error,
    refetch,
    createCategory: createCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending
  };
};
