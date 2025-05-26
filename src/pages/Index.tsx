
import Hero from '@/components/Hero';
import Navbar from '@/components/Navbar';
import Portfolio from '@/components/Portfolio';
import About from '@/components/About';
import Contact from '@/components/Contact';
import AdminPanel from '@/components/AdminPanel';
import CustomCursor from '@/components/CustomCursor';
import { useState } from 'react';

const Index = () => {
  const [showAdmin, setShowAdmin] = useState(false);

  return (
    <div className="min-h-screen bg-vizualiza-bg-dark text-white overflow-x-hidden relative">
      <CustomCursor />
      <Navbar onAdminClick={() => setShowAdmin(!showAdmin)} />
      {showAdmin ? (
        <AdminPanel onClose={() => setShowAdmin(false)} />
      ) : (
        <>
          <Hero />
          <About />
          <Portfolio />
          <Contact />
        </>
      )}
    </div>
  );
};

export default Index;
