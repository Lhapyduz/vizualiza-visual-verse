
import React from 'react';
import { Edit, Trash2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlogPost } from '@/hooks/useBlogPosts';

interface BlogListProps {
  posts: BlogPost[];
  onEdit: (post: BlogPost) => void;
  onDelete: (id: string) => void;
  isDeleting?: boolean;
}

const BlogList = ({ posts, onEdit, onDelete, isDeleting = false }: BlogListProps) => {
  return (
    <div className="bg-white/5 p-6 rounded-lg backdrop-blur-sm">
      <h2 className="text-xl font-semibold mb-6">Posts Cadastrados</h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto">
        {posts.map(post => (
          <div key={post.id} className="bg-white/5 p-4 rounded-lg">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="font-semibold text-white mb-1">{post.title}</h3>
                <p className="text-sm text-gray-400 mb-2">{post.category}</p>
                <p className="text-xs text-gray-500">{new Date(post.date).toLocaleDateString('pt-BR')}</p>
              </div>
              <div className="flex space-x-2">
                <Button
                  onClick={() => onEdit(post)}
                  size="sm"
                  variant="outline"
                  className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  onClick={() => onDelete(post.id)}
                  disabled={isDeleting}
                  size="sm"
                  variant="outline"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                >
                  {isDeleting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Trash2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <p className="text-gray-400 text-center py-8">
            Nenhum post cadastrado ainda.
          </p>
        )}
      </div>
    </div>
  );
};

export default BlogList;
