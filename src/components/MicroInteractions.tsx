
import React from 'react';
import { motion } from 'framer-motion';
import { useSpring, animated } from '@react-spring/web';
import { useHover } from 'react-use';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
}

export const FloatingCard = ({ children, className = '', glowColor = '#8B5CF6' }: FloatingCardProps) => {
  const [hoverable, hovered] = useHover((isHovered) => (
    <div className={`relative ${className}`}>
      {children}
    </div>
  ));

  const springProps = useSpring({
    transform: hovered ? 'scale(1.02) translateY(-4px)' : 'scale(1) translateY(0px)',
    boxShadow: hovered 
      ? `0 20px 40px rgba(139, 92, 246, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)` 
      : '0 4px 20px rgba(0, 0, 0, 0.1), 0 0 0 1px rgba(255, 255, 255, 0.05)',
    config: { tension: 300, friction: 30 }
  });

  return (
    <animated.div style={springProps} className="transition-all duration-300">
      {hoverable}
    </animated.div>
  );
};

interface GlassmorphismCardProps {
  children: React.ReactNode;
  className?: string;
  intensity?: 'light' | 'medium' | 'strong';
}

export const GlassmorphismCard = ({ 
  children, 
  className = '', 
  intensity = 'medium' 
}: GlassmorphismCardProps) => {
  const intensityClasses = {
    light: 'bg-white/5 backdrop-blur-sm border-white/10',
    medium: 'bg-white/10 backdrop-blur-md border-white/20',
    strong: 'bg-white/15 backdrop-blur-lg border-white/30'
  };

  return (
    <motion.div
      className={`${intensityClasses[intensity]} border rounded-xl ${className}`}
      whileHover={{ 
        backgroundColor: 'rgba(255, 255, 255, 0.15)',
        borderColor: 'rgba(255, 255, 255, 0.3)'
      }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
};

interface PulseLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export const PulseLoader = ({ size = 'md', color = '#8B5CF6' }: PulseLoaderProps) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} rounded-full`}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.7, 1, 0.7]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};

interface CounterProps {
  from: number;
  to: number;
  duration?: number;
  suffix?: string;
  className?: string;
}

export const AnimatedCounter = ({ 
  from, 
  to, 
  duration = 2000, 
  suffix = '', 
  className = '' 
}: CounterProps) => {
  const { number } = useSpring({
    from: { number: from },
    to: { number: to },
    config: { duration }
  });

  return (
    <animated.span className={className}>
      {number.to((n: number) => Math.floor(n).toLocaleString())}{suffix}
    </animated.span>
  );
};

interface ProgressBarProps {
  progress: number;
  height?: number;
  color?: string;
  backgroundColor?: string;
  className?: string;
}

export const AnimatedProgressBar = ({ 
  progress, 
  height = 4, 
  color = '#8B5CF6',
  backgroundColor = 'rgba(255, 255, 255, 0.1)',
  className = '' 
}: ProgressBarProps) => {
  const springProps = useSpring({
    width: `${Math.min(Math.max(progress, 0), 100)}%`,
    config: { tension: 300, friction: 30 }
  });

  return (
    <div 
      className={`relative overflow-hidden rounded-full ${className}`}
      style={{ height, backgroundColor }}
    >
      <animated.div
        style={{
          ...springProps,
          height: '100%',
          backgroundColor: color,
          borderRadius: 'inherit'
        }}
        className="transition-all duration-300"
      />
    </div>
  );
};

export default {
  FloatingCard,
  GlassmorphismCard,
  PulseLoader,
  AnimatedCounter,
  AnimatedProgressBar
};
