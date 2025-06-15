
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';
import About from '@/components/About';
import Services from '@/components/Services';
import Testimonials from '@/components/Testimonials';
import FAQ from '@/components/FAQ';
import BudgetCalculator from '@/components/BudgetCalculator';
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
      const sections = ['hero', 'about', 'services', 'portfolio', 'testimonials', 'calculator', 'faq', 'blog', 'contact'];
      const currentSection = getCurrentSection();
      const currentIndex = sections.indexOf(currentSection);
      const nextIndex = (currentIndex + 1) % sections.length;
      document.getElementById(sections[nextIndex])?.scrollIntoView({ behavior: 'smooth' });
    },
    onSwipeRight: () => {
      // Ir para seção anterior
      const sections = ['hero', 'about', 'services', 'portfolio', 'testimonials', 'calculator', 'faq', 'blog', 'contact'];
      const currentSection = getCurrentSection();
      const currentIndex = sections.indexOf(currentSection);
      const prevIndex = (currentIndex - 1 + sections.length) % sections.length;
      document.getElementById(sections[prevIndex])?.scrollIntoView({ behavior: 'smooth' });
    }
  });

  const getCurrentSection = () => {
    const sections = ['hero', 'about', 'services', 'portfolio', 'testimonials', 'calculator', 'faq', 'blog', 'contact'];
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
        <title>Vizualiza Visual Verse | Design e Identidade Visual Profissional</title>
        <meta name="description" content="Estúdio de design especializado em identidade visual, web design e branding. Criamos marcas memoráveis que convertem. Orçamento grátis!" />
        <meta name="keywords" content="design, identidade visual, branding, web design, logo, marca, estúdio criativo, Guaratuba, Paraná" />
        <meta property="og:title" content="Vizualiza Visual Verse | Design e Identidade Visual Profissional" />
        <meta property="og:description" content="Transformamos sua marca com design profissional. Identidade visual, sites responsivos e branding completo. Solicite seu orçamento!" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://vizualiza.com.br" />
        <meta property="og:image" content="https://vizualiza.com.br/og-image.jpg" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Vizualiza Visual Verse | Design e Identidade Visual" />
        <meta name="twitter:description" content="Estúdio de design especializado em criar marcas memoráveis e sites que convertem." />
        <meta name="twitter:image" content="https://vizualiza.com.br/og-image.jpg" />
        <link rel="canonical" href="https://vizualiza.com.br" />
        
        {/* Schema.org structured data */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Vizualiza Visual Verse",
              "description": "Estúdio de design especializado em identidade visual, web design e branding",
              "url": "https://vizualiza.com.br",
              "telephone": "+5541995618116",
              "email": "gregory@vizualiza.com.br",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "Guaratuba",
                "addressRegion": "PR",
                "addressCountry": "BR"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": -25.8826,
                "longitude": -48.5739
              },
              "openingHours": "Mo-Su 00:00-23:59",
              "priceRange": "R$ 400 - R$ 5000",
              "serviceArea": {
                "@type": "State",
                "name": "Paraná"
              }
            }
          `}
        </script>
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
          <Services />
          <Portfolio 
            isAdmin={isAdminLoggedIn}
            onEditProject={handleEditProject}
          />
          <Testimonials />
          <div id="calculator">
            <BudgetCalculator />
          </div>
          <FAQ />
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
