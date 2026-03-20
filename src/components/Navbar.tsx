import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useUISounds } from '../hooks/useUISounds';

export default function Navbar() {
  const { playHover, playClick } = useUISounds();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-4 bg-black/40 backdrop-blur-xl border-b border-white/10"
    >
      <Link to="/" onClick={playClick} onMouseEnter={playHover} className="text-2xl font-bold tracking-tighter text-white hover:text-[#00F3FF] transition-colors">
        NEXUS<span className="text-[#00F3FF]">.</span>
      </Link>
      
      <div className="flex items-center gap-8">
        <Link to="/" onClick={playClick} onMouseEnter={playHover} className={`text-sm font-medium tracking-widest uppercase transition-colors ${isActive('/') ? 'text-[#00F3FF]' : 'text-white/70 hover:text-white'}`}>Home</Link>
        <Link to="/projects" onClick={playClick} onMouseEnter={playHover} className={`text-sm font-medium tracking-widest uppercase transition-colors ${isActive('/projects') ? 'text-[#00F3FF]' : 'text-white/70 hover:text-white'}`}>Projects</Link>
        <Link to="/lab" onClick={playClick} onMouseEnter={playHover} className={`text-sm font-medium tracking-widest uppercase transition-colors ${isActive('/lab') ? 'text-[#00F3FF]' : 'text-white/70 hover:text-white'}`}>Lab</Link>
      </div>
    </motion.nav>
  );
}
