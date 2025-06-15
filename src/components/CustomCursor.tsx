
import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = (e: MouseEvent) => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
      
      animationFrameId = requestAnimationFrame(() => {
        setPosition({ x: e.clientX, y: e.clientY });
      });
    };

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = window.getComputedStyle(target).cursor === 'pointer' || 
                          target.tagName === 'BUTTON' || 
                          target.tagName === 'A' ||
                          target.closest('button') !== null ||
                          target.closest('a') !== null ||
                          target.closest('[role="button"]') !== null ||
                          target.hasAttribute('data-clickable');
      
      setIsPointer(isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Set initial visibility
    setIsVisible(true);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, []);

  if (!isVisible) return null;

  return (
    <>
      {/* Inner cursor dot */}
      <div
        className={`fixed top-0 left-0 w-2 h-2 bg-vizualiza-purple rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-100 ease-out ${
          isPointer ? 'scale-200 bg-vizualiza-orange' : 'scale-100'
        } ${isClicking ? 'scale-50' : ''}`}
        style={{
          transform: `translate3d(${position.x - 4}px, ${position.y - 4}px, 0)`,
          willChange: 'transform',
        }}
      />
      
      {/* Outer cursor ring */}
      <div
        className={`fixed top-0 left-0 w-8 h-8 border-2 rounded-full pointer-events-none z-[9998] transition-all duration-200 ease-out ${
          isPointer 
            ? 'border-vizualiza-orange scale-150 opacity-80' 
            : 'border-vizualiza-purple/40 scale-100 opacity-60'
        } ${isClicking ? 'scale-75 opacity-100' : ''}`}
        style={{
          transform: `translate3d(${position.x - 16}px, ${position.y - 16}px, 0)`,
          willChange: 'transform',
        }}
      />
      
      {/* Trailing effect */}
      <div
        className={`fixed top-0 left-0 w-12 h-12 border border-vizualiza-purple/20 rounded-full pointer-events-none z-[9997] transition-all duration-500 ease-out ${
          isPointer ? 'scale-125 opacity-30' : 'scale-100 opacity-20'
        }`}
        style={{
          transform: `translate3d(${position.x - 24}px, ${position.y - 24}px, 0)`,
          willChange: 'transform',
        }}
      />
    </>
  );
};

export default CustomCursor;
