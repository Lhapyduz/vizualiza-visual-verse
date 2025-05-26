
import { useEffect, useState } from 'react';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isPointer, setIsPointer] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const updateCursor = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsPointer(window.getComputedStyle(target).cursor === 'pointer' || 
                  target.tagName === 'BUTTON' || 
                  target.tagName === 'A' ||
                  target.closest('button') !== null ||
                  target.closest('a') !== null);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    document.addEventListener('mousemove', updatePosition);
    document.addEventListener('mouseover', updateCursor);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', updatePosition);
      document.removeEventListener('mouseover', updateCursor);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <>
      <div
        className={`fixed top-0 left-0 w-4 h-4 bg-vizualiza-purple rounded-full pointer-events-none z-50 transition-all duration-150 ${
          isPointer ? 'scale-150' : 'scale-100'
        } ${isClicking ? 'scale-75' : ''}`}
        style={{
          transform: `translate(${position.x - 8}px, ${position.y - 8}px)`,
        }}
      />
      <div
        className="fixed top-0 left-0 w-8 h-8 border border-vizualiza-purple/30 rounded-full pointer-events-none z-50 transition-all duration-300"
        style={{
          transform: `translate(${position.x - 16}px, ${position.y - 16}px) ${
            isPointer ? 'scale(1.5)' : 'scale(1)'
          }`,
        }}
      />
    </>
  );
};

export default CustomCursor;
