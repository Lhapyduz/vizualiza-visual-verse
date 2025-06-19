
import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, Settings, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface NavbarProps {
  onAdminClick: () => void;
  isAdminLoggedIn?: boolean;
  onLogout?: () => void;
  currentSection?: string;
}

const Navbar = ({ onAdminClick, isAdminLoggedIn = false, onLogout, currentSection }: NavbarProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const menuContentRef = useRef<HTMLDivElement>(null);

  const navItems = [
    { name: 'Início', href: '#hero' },
    { name: 'Sobre', href: '#about' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contato', href: '#contact' },
  ];

  const scrollToSection = (event: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    event.preventDefault();
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMenuOpen(false);
  };

  useEffect(() => {
    if (isMenuOpen && menuContentRef.current) {
      const focusableElements = menuContentRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
      );
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }

      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Tab' && menuContentRef.current) {
          const focusableElements = menuContentRef.current.querySelectorAll<HTMLElement>(
            'a[href], button, input, textarea, select, details, [tabindex]:not([tabindex="-1"])'
          );
          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];

          if (event.shiftKey) {
            if (document.activeElement === firstElement) {
              lastElement.focus();
              event.preventDefault();
            }
          } else {
            if (document.activeElement === lastElement) {
              firstElement.focus();
              event.preventDefault();
            }
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        menuButtonRef.current?.focus();
      };
    }
  }, [isMenuOpen]);

  const getLinkClassName = (href: string) => {
    const isActive = href === `#${currentSection}`;
    // Base classes for all links
    let classes = "text-white px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 hover:scale-105 relative";

    // Active link specific styling (bold text, purple color) is handled by variants now for text, underline is separate
    if (isActive) {
      classes += " font-bold"; // Keep bold for active text, color will be part of variant
    }
    return classes;
  };

  const navLinkVariants = {
    rest: { color: "#FFFFFF" }, // Default text color
    hover: { color: "#8B5CF6", scale: 1.05 }, // Purple on hover
    active: { color: "#8B5CF6", scale: 1.05 }, // Purple for active
  };

  const underlineVariants = {
    initial: { scaleX: 0, opacity: 0, y: 2 }, // y to position it slightly below text
    hover: { scaleX: 1, opacity: 1, backgroundColor: "#FF8A00", height: "2px", transition: { duration: 0.2 } }, // Orange for hover
    active: { scaleX: 1, opacity: 1, backgroundColor: "#8B5CF6", height: "2px", transition: { duration: 0.3 } }, // Purple for active
  };

  const getMobileLinkClassName = (href: string) => {
    const isActive = href === `#${currentSection}`;
    return `text-white hover:text-vizualiza-purple block px-3 py-2 rounded-md text-base font-medium w-full text-left transition-colors duration-200 ${
      isActive ? 'text-vizualiza-purple font-bold' : ''
    }`;
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
              {navItems.map((item) => {
                const isActive = item.href === `#${currentSection}`;
                return (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    onClick={(e) => scrollToSection(e, item.href)}
                    className={getLinkClassName(item.href)} // Base styling, active class adds bold
                    variants={navLinkVariants}
                    initial="rest"
                    whileHover="hover"
                    animate={isActive ? "active" : "rest"}
                    transition={{ duration: 0.2 }} // Transition for text color and scale
                  >
                    {item.name}
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5" // Height set by variant
                      variants={underlineVariants}
                      initial="initial" // Start hidden
                      animate={isActive ? "active" : "rest"} // Animate to active if current, else rest (hidden for non-hovered)
                      // whileHover will override animate for underline on non-active items
                    />
                  </motion.a>
                );
              })}
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
              ref={menuButtonRef}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              variant="ghost"
              size="sm"
              className="text-white"
              aria-expanded={isMenuOpen}
              aria-controls="mobile-menu-content"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden" id="mobile-menu-content" ref={menuContentRef}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-vizualiza-bg-dark/95 backdrop-blur-md">
            {navItems.map((item) => {
              const isActive = item.href === `#${currentSection}`;
              return (
                <motion.a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => scrollToSection(e, item.href)}
                  className={`${getMobileLinkClassName(item.href)} relative`} // Ensure relative positioning for mobile too
                  variants={navLinkVariants} // Can reuse or define mobile-specific variants
                  initial="rest"
                  whileHover="hover" // Hover might be less relevant on mobile touch, but good for consistency
                  animate={isActive ? "active" : "rest"}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                  <motion.div
                    className="absolute bottom-0 left-0 right-0 h-0.5"
                    variants={underlineVariants} // Can reuse or define mobile-specific underline
                    initial="initial"
                    animate={isActive ? "active" : "rest"}
                  />
                </motion.a>
              );
            })}
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
