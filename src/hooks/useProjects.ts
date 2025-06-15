
import { useState, useEffect } from 'react';
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

  // Fetch projects
  const {
    data: projects = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['projects'],
    queryFn: async () => {
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
        console.error('Error fetching projects:', error);
        throw error;
      }

      return data.map(project => ({
        ...project,
        images: project.project_images || []
      })) as Project[];
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      const { images, ...projectInfo } = projectData;
      
      // Insert project
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
      const { images, ...projectInfo } = projectData;
      
      // Update project
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
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', id);

      if (error) throw error;
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
