
import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/ThemeContext';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      variant="outline"
      size="sm"
      className="border-vizualiza-purple text-vizualiza-purple hover:bg-vizualiza-purple hover:text-white relative overflow-hidden"
    >
      <motion.div
        animate={{ rotate: theme === 'light' ? 180 : 0 }}
        transition={{ duration: 0.3 }}
        className="flex items-center"
      >
        {theme === 'light' ? (
          <Moon className="w-4 h-4 mr-2" />
        ) : (
          <Sun className="w-4 h-4 mr-2" />
        )}
        {theme === 'light' ? 'Escuro' : 'Claro'}
      </motion.div>
    </Button>
  );
};

export default ThemeToggle;
