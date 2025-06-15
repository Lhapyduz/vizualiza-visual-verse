
import { useState } from 'react';
import { X, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

interface AdminLoginProps {
  onLogin: () => void;
  onClose: () => void;
}

const AdminLogin = ({
  onLogin,
  onClose
}: AdminLoginProps) => {
  const [password, setPassword] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Apenas verifica a senha
    if (password === 'Greg6660') {
      localStorage.setItem('vizualiza-admin-logged', 'true');
      onLogin();
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo."
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Senha incorreta.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-vizualiza-bg-dark border border-white/10 rounded-2xl p-8 max-w-md w-full">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <Lock className="w-6 h-6 text-vizualiza-purple" />
            <h2 className="text-2xl font-bold text-white">Login Admin</h2>
          </div>
          <Button onClick={onClose} variant="outline" size="icon" className="border-white/20 bg-slate-900 hover:bg-slate-800">
            <X className="w-5 h-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <Input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Digite a senha"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>

          <Button type="submit" className="w-full bg-vizualiza-purple hover:bg-vizualiza-purple-dark">
            Entrar
          </Button>
        </form>
      </div>
    </div>
  );
};
export default AdminLogin;
