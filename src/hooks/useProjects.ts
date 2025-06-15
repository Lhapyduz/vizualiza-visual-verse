
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  tags: string[];
  featured_image?: string;
  images?: ProjectImage[];
  created_at?: string;
  updated_at?: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

interface CreateProjectData {
  title: string;
  description: string;
  category: string;
  date: string;
  tags: string[];
  featured_image?: string;
  images?: string[];
}

export const useProjects = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch projects with fallback to localStorage
  const {
    data: projects = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select(`
            *,
            project_images (
              id,
              image_url,
              alt_text,
              sort_order
            )
          `)
          .order('created_at', { ascending: false });

        if (error) {
          console.log('Supabase error, falling back to localStorage:', error);
          // Fallback to localStorage if Supabase fails
          const localProjects = localStorage.getItem('vizualiza-projects');
          return localProjects ? JSON.parse(localProjects) : [];
        }

        return (data || []).map(project => ({
          ...project,
          images: project.project_images || []
        })) as Project[];
      } catch (err) {
        console.log('Error fetching projects, using localStorage fallback:', err);
        const localProjects = localStorage.getItem('vizualiza-projects');
        return localProjects ? JSON.parse(localProjects) : [];
      }
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      try {
        const { images, ...projectInfo } = projectData;
        
        // Try Supabase first
        const { data: project, error: projectError } = await supabase
          .from('projects')
          .insert([projectInfo])
          .select()
          .single();

        if (projectError) throw projectError;

        // Insert images if any
        if (images && images.length > 0) {
          const imageData = images.map((url, index) => ({
            project_id: project.id,
            image_url: url,
            sort_order: index
          }));

          const { error: imagesError } = await supabase
            .from('project_images')
            .insert(imageData);

          if (imagesError) throw imagesError;
        }

        return project;
      } catch (error) {
        console.log('Supabase error, saving to localStorage:', error);
        // Fallback to localStorage
        const newProject = {
          id: Date.now().toString(),
          ...projectData,
          created_at: new Date().toISOString()
        };
        
        const existingProjects = JSON.parse(localStorage.getItem('vizualiza-projects') || '[]');
        const updatedProjects = [newProject, ...existingProjects];
        localStorage.setItem('vizualiza-projects', JSON.stringify(updatedProjects));
        
        return newProject;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Projeto criado!",
        description: "Novo projeto adicionado ao portfólio.",
      });
    },
    onError: (error) => {
      console.error('Error creating project:', error);
      toast({
        title: "Erro ao criar projeto",
        description: "Não foi possível criar o projeto. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Update project mutation
  const updateProjectMutation = useMutation({
    mutationFn: async ({ id, ...projectData }: Partial<Project> & { id: string }) => {
      try {
        const { images, ...projectInfo } = projectData;
        
        // Try Supabase first
        const { error: projectError } = await supabase
          .from('projects')
          .update(projectInfo)
          .eq('id', id);

        if (projectError) throw projectError;

        // Handle images update if provided
        if (images !== undefined) {
          // Delete existing images
          await supabase
            .from('project_images')
            .delete()
            .eq('project_id', id);

          // Insert new images
          if (images.length > 0) {
            const imageData = images.map((image, index) => ({
              project_id: id,
              image_url: typeof image === 'string' ? image : image.image_url,
              sort_order: index
            }));

            const { error: imagesError } = await supabase
              .from('project_images')
              .insert(imageData);

            if (imagesError) throw imagesError;
          }
        }
      } catch (error) {
        console.log('Supabase error, updating localStorage:', error);
        // Fallback to localStorage
        const existingProjects = JSON.parse(localStorage.getItem('vizualiza-projects') || '[]');
        const updatedProjects = existingProjects.map((p: Project) => 
          p.id === id ? { ...p, ...projectData, updated_at: new Date().toISOString() } : p
        );
        localStorage.setItem('vizualiza-projects', JSON.stringify(updatedProjects));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Projeto atualizado!",
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      console.error('Error updating project:', error);
      toast({
        title: "Erro ao atualizar projeto",
        description: "Não foi possível atualizar o projeto. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  // Delete project mutation
  const deleteProjectMutation = useMutation({
    mutationFn: async (id: string) => {
      try {
        const { error } = await supabase
          .from('projects')
          .delete()
          .eq('id', id);

        if (error) throw error;
      } catch (error) {
        console.log('Supabase error, deleting from localStorage:', error);
        // Fallback to localStorage
        const existingProjects = JSON.parse(localStorage.getItem('vizualiza-projects') || '[]');
        const updatedProjects = existingProjects.filter((p: Project) => p.id !== id);
        localStorage.setItem('vizualiza-projects', JSON.stringify(updatedProjects));
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: "Projeto removido!",
        description: "O projeto foi excluído do portfólio.",
      });
    },
    onError: (error) => {
      console.error('Error deleting project:', error);
      toast({
        title: "Erro ao excluir projeto",
        description: "Não foi possível excluir o projeto. Tente novamente.",
        variant: "destructive"
      });
    }
  });

  return {
    projects,
    isLoading,
    error,
    refetch,
    createProject: createProjectMutation.mutate,
    updateProject: updateProjectMutation.mutate,
    deleteProject: deleteProjectMutation.mutate,
    isCreating: createProjectMutation.isPending,
    isUpdating: updateProjectMutation.isPending,
    isDeleting: deleteProjectMutation.isPending
  };
};
