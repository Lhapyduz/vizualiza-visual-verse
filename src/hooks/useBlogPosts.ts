
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  tags: string[];
  featured_image?: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

interface CreateBlogPostData {
  title: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  read_time: string;
  tags: string[];
  featured_image?: string;
  date: string;
}

export const useBlogPosts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch blog posts with fallback to localStorage
  const {
    data: posts = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['blog-posts'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Supabase error, falling back to localStorage:', error);
          // Fallback to localStorage if Supabase fails
          const localPosts = localStorage.getItem('vizualiza-blog-posts');
          return localPosts ? JSON.parse(localPosts) : [];
        }

        return data as BlogPost[];
      } catch (err) {
        console.log('Error fetching blog posts, using localStorage fallback:', err);
        const localPosts = localStorage.getItem('vizualiza-blog-posts');
        return localPosts ? JSON.parse(localPosts) : [];
      }
    }
  });

  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async (postData: CreateBlogPostData) => {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .insert([postData])
          .select()
          .single();

        if (error) throw error;
        return data;
      } catch (error) {
        console.log('Supabase error, saving to localStorage:', error);
        // Fallback to localStorage
        const newPost = {
          id: Date.now().toString(),
          ...postData,
          created_at: new Date().toISOString()
        };
        
        const existingPosts = JSON.parse(localStorage.getItem('vizualiza-blog-posts') || '[]');
        const updatedPosts = [newPost, ...existingPosts];
        localStorage.setItem('vizualiza-blog-posts', JSON.stringify(updatedPosts));
        
        return newPost;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Post criado!",
        description: "Novo post adicionado ao blog.",
      });
    },
    onError: (error) => {
      console.error('Error creating blog post:', error);
      toast({
        title: "Erro ao criar post",
        description: "Não foi possível criar o post. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async ({ id, ...postData }: Partial<BlogPost> & { id: string }) => {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.log('Supabase error, updating localStorage:', error);
        // Fallback to localStorage
        const existingPosts = JSON.parse(localStorage.getItem('vizualiza-blog-posts') || '[]');
        const updatedPosts = existingPosts.map((p: BlogPost) => 
          p.id === id ? { ...p, ...postData, updated_at: new Date().toISOString() } : p
        );
        localStorage.setItem('vizualiza-blog-posts', JSON.stringify(updatedPosts));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Post atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating blog post:', error);
      toast({
        title: "Erro ao atualizar post",
        description: "Não foi possível atualizar o post. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Delete blog post mutation
  const deletePostMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('blog_posts')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.log('Supabase error, deleting from localStorage:', error);
        // Fallback to localStorage
        const existingPosts = JSON.parse(localStorage.getItem('vizualiza-blog-posts') || '[]');
        const updatedPosts = existingPosts.filter((p: BlogPost) => p.id !== id);
        localStorage.setItem('vizualiza-blog-posts', JSON.stringify(updatedPosts));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog-posts'] });
      toast({
        title: "Post removido!",
        description: "O post foi excluído do blog.",
      });
    },
    onError: (error) => {
      console.error('Error deleting blog post:', error);
      toast({
        title: "Erro ao excluir post",
        description: "Não foi possível excluir o post. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  return {
    posts,
    isLoading,
    error,
    refetch,
    createPost: createPostMutation.mutate,
    updatePost: updatePostMutation.mutate,
    deletePost: deletePostMutation.mutate,
    isCreating: createPostMutation.isPending,
    isUpdating: updatePostMutation.isPending,
    isDeleting: deletePostMutation.isPending
  };
};
