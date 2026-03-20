import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUISounds } from '../hooks/useUISounds';
import { useState, useEffect } from 'react';
import { Sun, Moon } from 'lucide-react';

export default function Navbar() {
  const { playHover, playClick } = useUISounds();
  const location = useLocation();
  const [isLight, setIsLight] = useState(() => {
    return localStorage.getItem('theme') === 'light';
  });

  useEffect(() => {
    if (isLight) {
      document.documentElement.classList.add('light');
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.classList.remove('light');
      localStorage.setItem('theme', 'dark');
    }
  }, [isLight]);

  const toggleTheme = () => {
    playClick();
    setIsLight(!isLight);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      <Link to="/" onClick={playClick} onMouseEnter={playHover} className="text-2xl font-bold tracking-tighter text-white hover:text-[#00F3FF] transition-colors">
        SK<span className="text-[#00F3FF]">.</span>
      </Link>
      
      <div className="flex items-center gap-8">
        <Link to="/" onClick={playClick} onMouseEnter={playHover} className={`text-sm font-medium tracking-widest uppercase transition-colors ${isActive('/') ? 'text-[#00F3FF]' : 'text-white/70 hover:text-white'}`}>Home</Link>
        <Link to="/projects" onClick={playClick} onMouseEnter={playHover} className={`text-sm font-medium tracking-widest uppercase transition-colors ${isActive('/projects') ? 'text-[#00F3FF]' : 'text-white/70 hover:text-white'}`}>Projects</Link>
        <Link to="/lab" onClick={playClick} onMouseEnter={playHover} className={`text-sm font-medium tracking-widest uppercase transition-colors ${isActive('/lab') ? 'text-[#00F3FF]' : 'text-white/70 hover:text-white'}`}>Lab</Link>
        
        <button 
          onClick={toggleTheme}
          onMouseEnter={playHover}
          className="p-2 rounded-full bg-white/5 border border-white/10 text-white hover:text-[#00F3FF] hover:border-[#00F3FF]/50 transition-all"
          aria-label="Toggle theme"
        >
          {isLight ? <Moon size={18} /> : <Sun size={18} />}
        </button>
      </div>
    </motion.nav>
  );
}
