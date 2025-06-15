
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, Reply, MoreHorizontal, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  date: string;
  likes: number;
  replies?: Comment[];
}

interface BlogCommentsProps {
  postId: string;
  comments?: Comment[];
}

const BlogComments = ({ postId, comments = [] }: BlogCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [authorEmail, setAuthorEmail] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !authorName.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      author: authorName,
      content: newComment,
      date: new Date().toISOString(),
      likes: 0,
      replies: []
    };

    console.log('New comment:', comment);
    
    // Reset form
    setNewComment('');
    setAuthorName('');
    setAuthorEmail('');
  };

  const handleReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    const reply: Comment = {
      id: Date.now().toString(),
      author: 'Usuário Anônimo',
      content: replyContent,
      date: new Date().toISOString(),
      likes: 0
    };

    console.log('New reply to', commentId, ':', reply);
    
    setReplyTo(null);
    setReplyContent('');
  };

  const mockComments: Comment[] = [
    {
      id: '1',
      author: 'Ana Silva',
      content: 'Excelente artigo! Muito esclarecedor sobre as tendências atuais do design.',
      date: '2024-01-15T10:30:00Z',
      likes: 5,
      replies: [
        {
          id: '2',
          author: 'Gregory Vizualiza',
          content: 'Obrigado pelo feedback, Ana! Fico feliz que tenha gostado.',
          date: '2024-01-15T11:00:00Z',
          likes: 2
        }
      ]
    },
    {
      id: '3',
      author: 'Carlos Mendes',
      content: 'Gostaria de ver mais conteúdo sobre UX/UI design. Parabéns pelo trabalho!',
      date: '2024-01-14T16:45:00Z',
      likes: 3
    }
  ];

  const displayComments = comments.length > 0 ? comments : mockComments;

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`${isReply ? 'ml-12 mt-4' : 'mb-6'} p-4 bg-white/5 rounded-lg border border-white/10`}
    >
      <div className="flex items-start gap-3">
        <Avatar className="w-10 h-10">
          <AvatarImage src={comment.avatar} />
          <AvatarFallback className="bg-vizualiza-purple text-white">
            <User className="w-5 h-5" />
          </AvatarFallback>
        </Avatar>
        
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h4 className="text-white font-medium">{comment.author}</h4>
              <p className="text-gray-400 text-sm">
                {new Date(comment.date).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <Button variant="ghost" size="sm" className="text-gray-400">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>
          
          <p className="text-gray-300 mb-3 leading-relaxed">{comment.content}</p>
          
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="text-gray-400 hover:text-red-400">
              <Heart className="w-4 h-4 mr-1" />
              {comment.likes}
            </Button>
            {!isReply && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-400 hover:text-vizualiza-purple"
                onClick={() => setReplyTo(replyTo === comment.id ? null : comment.id)}
              >
                <Reply className="w-4 h-4 mr-1" />
                Responder
              </Button>
            )}
          </div>
          
          {/* Reply form */}
          {replyTo === comment.id && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 p-4 bg-white/5 rounded-lg border border-white/10"
            >
              <Textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Escreva sua resposta..."
                className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 mb-3"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => handleReply(comment.id)}
                  className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
                  size="sm"
                >
                  Responder
                </Button>
                <Button
                  onClick={() => setReplyTo(null)}
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-400"
                >
                  Cancelar
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-4">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="mt-8 border-t border-white/10 pt-8">
      <h3 className="text-2xl font-bold text-white mb-6">
        Comentários ({displayComments.length})
      </h3>
      
      {/* Comment form */}
      <form onSubmit={handleSubmitComment} className="mb-8 p-6 bg-white/5 rounded-lg border border-white/10">
        <h4 className="text-lg font-medium text-white mb-4">Deixe seu comentário</h4>
        
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <Input
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            placeholder="Seu nome *"
            required
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
          />
          <Input
            type="email"
            value={authorEmail}
            onChange={(e) => setAuthorEmail(e.target.value)}
            placeholder="Seu email (opcional)"
            className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
          />
        </div>
        
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Escreva seu comentário..."
          required
          className="bg-white/5 border-white/20 text-white placeholder:text-gray-400 mb-4"
          rows={4}
        />
        
        <Button 
          type="submit"
          className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
          disabled={!newComment.trim() || !authorName.trim()}
        >
          Publicar Comentário
        </Button>
      </form>
      
      {/* Comments list */}
      <AnimatePresence>
        {displayComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </AnimatePresence>
      
      {displayComments.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-400">
            Seja o primeiro a comentar neste post!
          </p>
        </div>
      )}
    </div>
  );
};

export default BlogComments;
