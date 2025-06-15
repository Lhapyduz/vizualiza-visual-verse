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
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const {
    toast
  } = useToast();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Credenciais simples para demonstração
    if (credentials.username === 'admin' && credentials.password === 'admin123') {
      localStorage.setItem('vizualiza-admin-logged', 'true');
      onLogin();
      toast({
        title: "Login realizado!",
        description: "Bem-vindo ao painel administrativo."
      });
    } else {
      toast({
        title: "Erro no login",
        description: "Usuário ou senha incorretos.",
        variant: "destructive"
      });
    }
  };
  return <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
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
              Usuário
            </label>
            <Input type="text" value={credentials.username} onChange={e => setCredentials(prev => ({
            ...prev,
            username: e.target.value
          }))} placeholder="Digite seu usuário" required className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Senha
            </label>
            <Input type="password" value={credentials.password} onChange={e => setCredentials(prev => ({
            ...prev,
            password: e.target.value
          }))} placeholder="Digite sua senha" required className="bg-white/10 border-white/20 text-white placeholder:text-gray-400" />
          </div>

          <Button type="submit" className="w-full bg-vizualiza-purple hover:bg-vizualiza-purple-dark">
            Entrar
          </Button>
        </form>

        <div className="mt-4 p-3 bg-white/5 rounded-lg">
          <p className="text-xs text-gray-400">
            <strong>Demo:</strong> usuário: admin, senha: admin123
          </p>
        </div>
      </div>
    </div>;
};
export default AdminLogin;