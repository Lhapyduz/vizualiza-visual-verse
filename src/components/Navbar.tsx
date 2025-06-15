
import { useState } from 'react';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onAdminClick: () => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
}

const Navbar = ({ onAdminClick, isAdminLoggedIn = false, onLogout }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { name: 'Início', href: '#hero' },
    { name: 'Sobre', href: '#about' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contato', href: '#contact' },
  ];

  const scrollToSection = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full z-50 bg-vizualiza-bg-dark/90 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold bg-vizualiza-gradient bg-clip-text text-transparent">
              Vizualiza
            </h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="text-white hover:text-vizualiza-purple px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105"
                >
                  {item.name}
                </button>
              ))}
              <div className="flex items-center space-x-2 ml-4">
                <Button
                  onClick={onAdminClick}
                  variant="outline"
                  size="sm"
                  className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white hover:scale-105 transition-all duration-200"
                >
                  <Settings className="w-4 h-4 mr-2" />
                  {isAdminLoggedIn ? 'Painel' : 'Admin'}
                </Button>
                {isAdminLoggedIn && onLogout && (
                  <Button
                    onClick={onLogout}
                    variant="outline"
                    size="sm"
                    className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white hover:scale-105 transition-all duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
              className="text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-vizualiza-bg-dark/95 backdrop-blur-md">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-white hover:text-vizualiza-purple block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200"
              >
                {item.name}
              </button>
            ))}
            <div className="flex flex-col space-y-2 px-3 pt-2">
              <Button
                onClick={onAdminClick}
                variant="outline"
                size="sm"
                className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white justify-start"
              >
                <Settings className="w-4 h-4 mr-2" />
                {isAdminLoggedIn ? 'Painel' : 'Admin'}
              </Button>
              {isAdminLoggedIn && onLogout && (
                <Button
                  onClick={onLogout}
                  variant="outline"
                  size="sm"
                  className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white justify-start"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sair
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
