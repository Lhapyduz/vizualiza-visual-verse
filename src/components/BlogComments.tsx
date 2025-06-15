
import React, { useState } from 'react';
import { MessageCircle, Send, ThumbsUp, Reply } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface Comment {
  id: string;
  author: string;
  content: string;
  date: string;
  likes: number;
  replies: Comment[];
}

interface BlogCommentsProps {
  postId: string;
  comments?: Comment[];
}

const BlogComments = ({ postId, comments = [] }: BlogCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitComment = () => {
    if (!newComment.trim() || !authorName.trim()) return;
    
    console.log('Novo comentário:', { postId, author: authorName, content: newComment });
    setNewComment('');
    setAuthorName('');
  };

  const handleSubmitReply = (commentId: string) => {
    if (!replyContent.trim()) return;
    
    console.log('Nova resposta:', { commentId, content: replyContent });
    setReplyContent('');
    setReplyTo(null);
  };

  const mockComments: Comment[] = [
    {
      id: '1',
      author: 'Maria Silva',
      content: 'Excelente artigo! Me ajudou muito a entender melhor o processo de criação de identidade visual.',
      date: '2024-01-15',
      likes: 5,
      replies: [
        {
          id: '1-1',
          author: 'Gregory Vizualiza',
          content: 'Obrigado Maria! Fico feliz em saber que foi útil para você.',
          date: '2024-01-15',
          likes: 2,
          replies: []
        }
      ]
    },
    {
      id: '2',
      author: 'João Santos',
      content: 'Vocês fazem trabalhos para e-commerce também? Preciso de uma identidade para minha loja online.',
      date: '2024-01-14',
      likes: 3,
      replies: []
    }
  ];

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-4 rounded-lg ${isReply ? 'bg-white/5 ml-8' : 'bg-white/10'} border border-white/10`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-vizualiza-purple rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-medium">
              {comment.author.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div>
            <p className="text-white font-medium">{comment.author}</p>
            <p className="text-gray-400 text-sm">{new Date(comment.date).toLocaleDateString('pt-BR')}</p>
          </div>
        </div>
      </div>
      
      <p className="text-gray-300 mb-3">{comment.content}</p>
      
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-vizualiza-purple">
          <ThumbsUp className="w-4 h-4 mr-1" />
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

      <AnimatePresence>
        {replyTo === comment.id && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <Textarea
              placeholder="Escreva sua resposta..."
              value={replyContent}
              onChange={(e) => setReplyContent(e.target.value)}
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 mb-2"
            />
            <div className="flex space-x-2">
              <Button
                onClick={() => handleSubmitReply(comment.id)}
                size="sm"
                className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
              >
                <Send className="w-4 h-4 mr-1" />
                Responder
              </Button>
              <Button
                onClick={() => setReplyTo(null)}
                variant="outline"
                size="sm"
                className="border-gray-500 text-gray-400"
              >
                Cancelar
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {comment.replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </motion.div>
  );

  return (
    <div className="mt-8">
      <div className="flex items-center mb-6">
        <MessageCircle className="w-6 h-6 text-vizualiza-purple mr-2" />
        <h3 className="text-xl font-semibold text-white">
          Comentários ({mockComments.length})
        </h3>
      </div>

      {/* Novo Comentário */}
      <div className="bg-white/10 rounded-lg p-6 border border-white/10 mb-6">
        <h4 className="text-lg font-medium text-white mb-4">Deixe seu comentário</h4>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Seu nome"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-gray-400 focus:border-vizualiza-purple focus:outline-none"
          />
          <Textarea
            placeholder="Escreva seu comentário..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 min-h-[100px]"
          />
          <Button
            onClick={handleSubmitComment}
            className="bg-vizualiza-purple hover:bg-vizualiza-purple-dark"
            disabled={!newComment.trim() || !authorName.trim()}
          >
            <Send className="w-4 h-4 mr-2" />
            Publicar Comentário
          </Button>
        </div>
      </div>

      {/* Lista de Comentários */}
      <div className="space-y-4">
        {mockComments.map((comment) => (
          <CommentItem key={comment.id} comment={comment} />
        ))}
      </div>
    </div>
  );
};

export default BlogComments;
