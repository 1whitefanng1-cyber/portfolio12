import { motion, useMotionValue, useSpring, useTransform } from 'motion/react';
import { ExternalLink, Github } from 'lucide-react';
import React from 'react';
import { useUISounds } from '../hooks/useUISounds';

const projects = [
  {
    id: 1,
    title: "AI WORKFLOW AUTOMATION",
    category: "AUTOMATION",
    image: "https://picsum.photos/seed/automation/800/600",
    description: "Automated business processes using LLMs and custom scripts.",
    tags: ["Python", "LangChain", "APIs"]
  },
  {
    id: 2,
    title: "FULL STACK E-COMMERCE",
    category: "WEB DEV",
    image: "https://picsum.photos/seed/ecommerce/800/600",
    description: "Scalable e-commerce platform with real-time inventory management.",
    tags: ["Next.js", "Node.js", "PostgreSQL"]
  },
  {
    id: 3,
    title: "INTELLIGENT DASHBOARD",
    category: "AI INTERFACE",
    image: "https://picsum.photos/seed/dashboard/800/600",
    description: "Data visualization dashboard powered by generative AI insights.",
    tags: ["React", "Gemini API", "Tailwind"]
  }
];

function ProjectCard({ project, index }: { project: typeof projects[0], index: number }) {
  const { playHover, playClick } = useUISounds();
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8, rotateY: 30 }}
      whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay: index * 0.1, type: "spring" }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={playHover}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="group relative h-[500px] rounded-3xl overflow-hidden bg-black/50 border border-white/10 hover:border-[#00F3FF] hover:shadow-[0_0_80px_rgba(0,243,255,0.6)] transition-all duration-500"
    >
      {/* Image Background */}
      <div className="absolute inset-0 z-0" style={{ transform: "translateZ(-20px)" }}>
        <img 
          src={project.image} 
          alt={project.title} 
          className="w-full h-full object-cover opacity-50 group-hover:opacity-80 scale-100 group-hover:scale-110 transition-all duration-700 ease-out"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 z-10 p-8 flex flex-col justify-end" style={{ transform: "translateZ(50px)" }}>
        <span className="text-xs font-mono tracking-widest text-[#00F3FF] mb-2">{project.category}</span>
        <h2 className="text-3xl font-bold tracking-tighter mb-4">{project.title}</h2>
        <p className="text-sm text-white/70 mb-6 line-clamp-2">{project.description}</p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {project.tags.map(tag => (
            <span key={tag} className="px-3 py-1 text-xs font-mono border border-white/20 rounded-full bg-white/5 backdrop-blur-md">
              {tag}
            </span>
          ))}
        </div>

        <div className="flex gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
          <button 
            onMouseEnter={(e) => { e.stopPropagation(); playHover(); }}
            onClick={(e) => { e.stopPropagation(); playClick(); }}
            className="flex-1 flex items-center justify-center gap-2 py-3 bg-white text-black font-bold text-sm tracking-widest uppercase rounded-full hover:bg-[#00F3FF] transition-colors"
          >
            <ExternalLink className="w-4 h-4" /> View
          </button>
          <button 
            onMouseEnter={(e) => { e.stopPropagation(); playHover(); }}
            onClick={(e) => { e.stopPropagation(); playClick(); }}
            className="p-3 border border-white/20 rounded-full hover:bg-white/10 transition-colors"
          >
            <Github className="w-5 h-5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function Projects() {
  return (
    <div className="relative w-full min-h-screen py-32 z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-24 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F3FF] to-[#4B0082]">
          ARCHIVES
        </h1>
        <p className="mt-6 text-xl text-white/50 font-light tracking-widest uppercase">
          Selected Works 2024-2026
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12" style={{ perspective: "1000px" }}>
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </div>
  );
}
