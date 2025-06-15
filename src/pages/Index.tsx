
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
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useGestures } from '@/hooks/useGestures';

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  tags: string[];
}

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  category: string;
  date: string;
  author: string;
  readTime: string;
  tags: string[];
}

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
      const sections = ['hero', 'about', 'portfolio', 'blog', 'contact'];
      const currentSection = getCurrentSection();
      const currentIndex = sections.indexOf(currentSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: 'smooth' });
    },
    onSwipeRight: () => {
      // Ir para seção anterior
      const sections = ['hero', 'about', 'portfolio', 'blog', 'contact'];
      const currentSection = getCurrentSection();
      const currentIndex = sections.indexOf(currentSection);
      const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
      document.getElementById(sections[prevIndex])?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const getCurrentSection = () => {
    const sections = ['hero', 'about', 'portfolio', 'blog', 'contact'];
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
      <Helmet>
        <title>Vizualiza Visual Verse | Design e Identidade Visual</title>
        <meta name="description" content="Estúdio de design especializado em identidade visual, web design e branding. Transformamos sua marca com soluções criativas e impactantes." />
        <meta name="keywords" content="design, identidade visual, branding, web design, logo, marca, estúdio criativo" />
        <meta property="og:title" content="Vizualiza Visual Verse | Design e Identidade Visual" />
        <meta property="og:description" content="Estúdio de design especializado em identidade visual, web design e branding. Transformamos sua marca com soluções criativas e impactantes." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vizualiza.com.br" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vizualiza Visual Verse | Design e Identidade Visual" />
        <meta name="twitter:description" content="Estúdio de design especializado em identidade visual, web design e branding." />
        <link rel="canonical" href="https://vizualiza.com.br" />
      </Helmet>
      
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
