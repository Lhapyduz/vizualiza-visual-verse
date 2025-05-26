
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';
import About from '@/components/About';
import Contact from '@/components/Contact';
import AdminPanel from '@/components/AdminPanel';
import AdminLogin from '@/components/AdminLogin';
import CustomCursor from '@/components/CustomCursor';
import { useState, useEffect } from 'react';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  tags: string[];
}

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  useEffect(() => {
    // Verificar se admin está logado
    const isLogged = localStorage.getItem('vizualiza-admin-logged') === 'true';
    setIsAdminLoggedIn(isLogged);
  }, []);

  const handleAdminClick = () => {
    if (isAdminLoggedIn) {
      setShowAdmin(!showAdmin);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = () => {
    setIsAdminLoggedIn(true);
    setShowLogin(false);
    setShowAdmin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('vizualiza-admin-logged');
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowAdmin(true);
  };

  return (
    <div className="min-h-screen bg-vizualiza-bg-dark text-white overflow-x-hidden relative">
      <CustomCursor />
      <Navbar 
        onAdminClick={handleAdminClick} 
        isAdminLoggedIn={isAdminLoggedIn}
        onLogout={handleLogout}
      />
      
      {showLogin && (
        <AdminLogin 
          onLogin={handleLogin}
          onClose={() => setShowLogin(false)}
        />
      )}
      
      {showAdmin ? (
        <AdminPanel 
          onClose={() => setShowAdmin(false)}
          editingProject={editingProject}
          onClearEditingProject={() => setEditingProject(null)}
        />
      ) : (
        <>
          <Hero />
          <About />
          <Portfolio 
            isAdmin={isAdminLoggedIn}
            onEditProject={handleEditProject}
          />
          <Contact />
        </>
      )}
    </div>
  );
};

export default Index;
