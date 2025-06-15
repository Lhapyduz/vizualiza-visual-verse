
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';
import About from '@/components/About';
import Contact from '@/components/Contact';
import AdminPanel from '@/components/AdminPanel';
import AdminLogin from '@/components/AdminLogin';
import CustomCursor from '@/components/CustomCursor';
import ChatBot from '@/components/ChatBot';
import VoiceCommands from '@/components/VoiceCommands';
import Blog from '@/components/Blog';
import NewsletterSignup from '@/components/NewsletterSignup';
import SocialFeed from '@/components/SocialFeed';
import SEOHead from '@/components/SEOHead';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGestures } from '@/hooks/useGestures';
import { Project } from '@/hooks/useProjects';
import { BlogPost } from '@/hooks/useBlogPosts';

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    // Verificar se admin está logado
    const isLogged = localStorage.getItem('vizualiza-admin-logged') === 'true';
    setIsAdminLoggedIn(isLogged);
  }, []);

  // Gestos para navegação
  useGestures({
    onSwipeUp: () => {
      // Scroll para cima
      window.scrollBy({ top: -window.innerHeight, behavior: 'smooth' });
    },
    onSwipeDown: () => {
      // Scroll para baixo
      window.scrollBy({ top: window.innerHeight, behavior: 'smooth' });
    },
    onSwipeLeft: () => {
      // Ir para próxima seção
      const sections = ['hero', 'about', 'portfolio', 'blog', 'social', 'contact'];
      const currentSection = getCurrentSection();
      const currentIndex = sections.indexOf(currentSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: 'smooth' });
    },
    onSwipeRight: () => {
      // Ir para seção anterior
      const sections = ['hero', 'about', 'portfolio', 'blog', 'social', 'contact'];
      const currentSection = getCurrentSection();
      const currentIndex = sections.indexOf(currentSection);
      const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
      document.getElementById(sections[prevIndex])?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const getCurrentSection = () => {
    const sections = ['hero', 'about', 'portfolio', 'blog', 'social', 'contact'];
    const scrollPosition = window.scrollY + window.innerHeight / 2;
    
    for (const section of sections) {
      const element = document.getElementById(section);
      if (element) {
        const { offsetTop, offsetHeight } = element;
        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          return section;
        }
      }
    }
    return 'hero';
  };

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
    setEditingPost(null);
    setShowAdmin(true);
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setEditingProject(null);
    setShowAdmin(true);
  };

  return (
    <div className="min-h-screen bg-vizualiza-bg-dark text-white overflow-x-hidden relative">
      <SEOHead
        title="Vizualiza Visual Verse | Design e Identidade Visual"
        description="Estúdio de design especializado em identidade visual, web design e branding. Transformamos sua marca com soluções criativas e impactantes."
        keywords="design, identidade visual, branding, web design, logo, marca, estúdio criativo, vizualiza"
        type="website"
      />
      
      <CustomCursor />
      <VoiceCommands />
      <ChatBot />
      
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
          editingPost={editingPost}
          onClearEditingProject={() => setEditingProject(null)}
          onClearEditingPost={() => setEditingPost(null)}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Hero />
          <About />
          <Portfolio 
            isAdmin={isAdminLoggedIn}
            onEditProject={handleEditProject}
          />
          <Blog 
            isAdmin={isAdminLoggedIn}
            onEditPost={handleEditPost}
          />
          <div id="social">
            <SocialFeed />
          </div>
          <div className="py-20 px-4 bg-vizualiza-bg-dark">
            <div className="max-w-4xl mx-auto">
              <NewsletterSignup />
            </div>
          </div>
          <Contact />
        </motion.div>
      )}
    </div>
  );
};

export default Index;
