
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
  // Add compatibility property for components (required for consistency)
  image: string;
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
        // Try Supabase first
        const response = await fetch(`https://bmugkpdgmyjfifwxdqwj.supabase.co/rest/v1/projects?select=*,project_images(*)&order=created_at.desc`, {
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0'
          }
        });
        
        if (response.ok) {
          const data = await response.json();
          return (data || []).map((project: any) => ({
            ...project,
            images: project.project_images || [],
            tags: Array.isArray(project.tags) ? project.tags.filter((tag: any) => typeof tag === 'string') : [],
            image: project.featured_image || project.project_images?.[0]?.image_url || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop'
          })) as Project[];
        } else {
          throw new Error('Supabase fetch failed');
        }
      } catch (err) {
        console.log('Error fetching projects, using localStorage fallback:', err);
        const localProjects = localStorage.getItem('vizualiza-projects');
        const projects = localProjects ? JSON.parse(localProjects) : [];
        return projects.map((project: any) => ({
          ...project,
          tags: Array.isArray(project.tags) ? project.tags.filter((tag: any) => typeof tag === 'string') : [],
          image: project.featured_image || project.images?.[0]?.image_url || project.image || 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&h=400&fit=crop'
        })) as Project[];
      }
    }
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (projectData: CreateProjectData) => {
      try {
        const { images, ...projectInfo } = projectData;
        
        // Try Supabase first
        const response = await fetch(`https://bmugkpdgmyjfifwxdqwj.supabase.co/rest/v1/projects`, {
          method: 'POST',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
          },
          body: JSON.stringify(projectInfo)
        });

        if (response.ok) {
          const [project] = await response.json();
          
          // Insert images if any
          if (images && images.length > 0) {
            const imageData = images.map((url, index) => ({
              project_id: project.id,
              image_url: url,
              sort_order: index
            }));

            await fetch(`https://bmugkpdgmyjfifwxdqwj.supabase.co/rest/v1/project_images`, {
              method: 'POST',
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(imageData)
            });
          }

          return project;
        } else {
          throw new Error('Supabase insert failed');
        }
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
        const response = await fetch(`https://bmugkpdgmyjfifwxdqwj.supabase.co/rest/v1/projects?id=eq.${id}`, {
          method: 'PATCH',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(projectInfo)
        });

        if (response.ok) {
          // Handle images update if provided
          if (images !== undefined) {
            // Delete existing images
            await fetch(`https://bmugkpdgmyjfifwxdqwj.supabase.co/rest/v1/project_images?project_id=eq.${id}`, {
              method: 'DELETE',
              headers: {
                'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
                'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0'
              }
            });

            // Insert new images
            if (images.length > 0) {
              const imageData = images.map((image: any, index: number) => ({
                project_id: id,
                image_url: typeof image === 'string' ? image : image.image_url,
                sort_order: index
              }));

              await fetch(`https://bmugkpdgmyjfifwxdqwj.supabase.co/rest/v1/project_images`, {
                method: 'POST',
                headers: {
                  'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
                  'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(imageData)
              });
            }
          }
        } else {
          throw new Error('Supabase update failed');
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
        const response = await fetch(`https://bmugkpdgmyjfifwxdqwj.supabase.co/rest/v1/projects?id=eq.${id}`, {
          method: 'DELETE',
          headers: {
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0',
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJtdWdrcGRnbXlqZmlmd3hkcXdqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDgyNDk4OTAsImV4cCI6MjA2MzgyNTg5MH0.rMMOZIP1Za4Q1Tcs-Z86saiK4tiPu9Yx6ktTIbK5eh0'
          }
        });

        if (!response.ok) {
          throw new Error('Supabase delete failed');
        }
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
