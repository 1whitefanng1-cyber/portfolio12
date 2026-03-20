import { useEffect, useState } from 'react';
import { motion } from 'motion/react';

export default function Cursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive = 
        target.tagName.toLowerCase() === 'button' || 
        target.tagName.toLowerCase() === 'a' || 
        target.tagName.toLowerCase() === 'input' || 
        target.tagName.toLowerCase() === 'textarea' || 
        target.closest('button') || 
        target.closest('a');
        
      if (isInteractive) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', updateMousePosition);
    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 w-4 h-4 bg-[#00F3FF] rounded-full pointer-events-none z-[100] mix-blend-screen"
        animate={{
          x: mousePosition.x - 8,
          y: mousePosition.y - 8,
          scale: isHovering ? 2 : 1,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 28, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-32 h-32 border border-[#4B0082]/30 rounded-full pointer-events-none z-[99] mix-blend-screen"
        initial={{ backgroundColor: "rgba(0, 243, 255, 0)" }}
        animate={{
          x: mousePosition.x - 64,
          y: mousePosition.y - 64,
          scale: isHovering ? 1.2 : 1,
          backgroundColor: isHovering ? "rgba(0, 243, 255, 0.03)" : "rgba(0, 243, 255, 0)"
        }}
        transition={{ type: "spring", stiffness: 250, damping: 20, mass: 0.8 }}
      />
    </>
  );
}
