import { motion, useScroll, useTransform } from 'motion/react';
import { useRef, Suspense } from 'react';
import { ArrowDown, Code, Cpu, Globe, Layers, Terminal } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import HeroObject from '../components/3d/HeroObject';
import { useUISounds } from '../hooks/useUISounds';

export default function Home() {
  const { playHover, playClick } = useUISounds();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <div ref={containerRef} className="relative w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center">
        {/* Interactive 3D Object */}
        <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-auto">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <directionalLight position={[10, 10, 5]} intensity={1} color="#00F3FF" />
              <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4B0082" />
              <HeroObject />
              <OrbitControls enableZoom={false} enablePan={true} autoRotate autoRotateSpeed={0.5} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        <motion.div 
          style={{ y, opacity }}
          className="z-10 flex flex-col items-center pointer-events-none"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut", delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F3FF] to-[#4B0082]"
          >
            CREATIVE
            <br />
            TECHNOLOGIST
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl font-light tracking-wide"
          >
            Building immersive digital experiences at the intersection of design, engineering, and artificial intelligence.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="mt-12 flex gap-6 pointer-events-auto"
          >
            <button 
              onMouseEnter={playHover}
              onClick={playClick}
              className="px-8 py-4 bg-white text-black font-bold tracking-widest uppercase rounded-full hover:bg-[#00F3FF] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all duration-300"
            >
              View Work
            </button>
            <button 
              onMouseEnter={playHover}
              onClick={playClick}
              className="px-8 py-4 bg-transparent border border-white/20 text-white font-bold tracking-widest uppercase rounded-full hover:border-[#4B0082] hover:bg-[#4B0082]/20 transition-all duration-300"
            >
              Contact Me
            </button>
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-xs tracking-widest uppercase text-white/50">Scroll to explore</span>
          <ArrowDown className="w-4 h-4 text-[#00F3FF] animate-bounce" />
        </motion.div>
      </section>

      {/* About Section */}
      <section className="min-h-screen py-32 flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">
        <div className="w-full md:w-1/2">
          <motion.h2 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-6xl font-bold tracking-tighter mb-8"
          >
            SYSTEM <span className="text-[#00F3FF]">OVERVIEW</span>
          </motion.h2>
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={{
              visible: { transition: { staggerChildren: 0.2, delayChildren: 0.2 } },
              hidden: {}
            }}
            className="space-y-6 text-lg text-white/70 font-light leading-relaxed"
          >
            <p>
              {[
                "I am a multidisciplinary developer specializing in high-performance web applications, 3D graphics, and AI integration.",
                "My mission is to push the boundaries of what's possible in the browser."
              ].map((line, i) => (
                <motion.span key={i} className="block" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
                  {line}
                </motion.span>
              ))}
            </p>
            <p>
              {[
                "With a deep understanding of modern frameworks and a passion for cyber-aesthetic design,",
                "I craft digital environments that are not just functional, but unforgettable."
              ].map((line, i) => (
                <motion.span key={i} className="block mt-2" variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0, transition: { duration: 0.6 } } }}>
                  {line}
                </motion.span>
              ))}
            </p>
          </motion.div>
        </div>
        
        <div className="w-full md:w-1/2 relative h-[500px]">
          {/* Glassmorphism Card */}
          <motion.div 
            initial={{ opacity: 0, rotateY: 30, scale: 0.8 }}
            whileInView={{ opacity: 1, rotateY: 0, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, type: "spring" }}
            className="absolute inset-0 bg-gradient-to-br from-white/10 to-black/40 backdrop-blur-xl border border-white/20 rounded-3xl p-8 flex flex-col justify-between shadow-[0_0_50px_rgba(75,0,130,0.3)] hover:scale-[1.02] hover:shadow-[0_0_60px_rgba(0,243,255,0.4)] transition-all duration-500"
          >
            <div className="flex justify-between items-start">
              <Terminal className="w-8 h-8 text-[#00F3FF]" />
              <span className="text-xs font-mono text-white/50">STATUS: ONLINE</span>
            </div>
            
            <div className="space-y-4">
              <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: "85%" }}
                  transition={{ duration: 1.5, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-[#4B0082] to-[#00F3FF]"
                />
              </div>
              <div className="flex justify-between text-xs font-mono text-white/50">
                <span>SYSTEM CAPACITY</span>
                <span>85%</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section className="py-32 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 text-center"
        >
          CORE <span className="text-[#4B0082]">MODULES</span>
        </motion.h2>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: <Code className="w-8 h-8" />, title: "Frontend", desc: "React, Next.js, Tailwind" },
            { icon: <Layers className="w-8 h-8" />, title: "3D & Motion", desc: "Three.js, WebGL, Framer" },
            { icon: <Cpu className="w-8 h-8" />, title: "Backend", desc: "Node.js, Firebase, SQL" },
            { icon: <Globe className="w-8 h-8" />, title: "AI Integration", desc: "Gemini, OpenAI, LangChain" }
          ].map((skill, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -10, scale: 1.05 }}
              className="p-6 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#00F3FF]/50 hover:shadow-[0_0_30px_rgba(0,243,255,0.2)] transition-all group"
            >
              <div className="w-16 h-16 rounded-full bg-black/50 border border-white/10 flex items-center justify-center mb-6 group-hover:text-[#00F3FF] group-hover:border-[#00F3FF]/50 transition-colors">
                {skill.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
              <p className="text-sm text-white/50">{skill.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-32 relative z-10">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-bold tracking-tighter mb-16 text-center"
        >
          SYSTEM <span className="text-[#00F3FF]">LOGS</span>
        </motion.h2>

        <div className="max-w-3xl mx-auto relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-[#00F3FF] via-[#4B0082] to-transparent transform md:-translate-x-1/2" />

          {[
            { year: "2026", role: "Lead Creative Technologist", company: "CyberDyne Systems", desc: "Architecting next-gen neural interfaces." },
            { year: "2024", role: "Senior Frontend Engineer", company: "Nexus Corp", desc: "Built award-winning 3D web experiences." },
            { year: "2022", role: "Full Stack Developer", company: "Quantum Web", desc: "Developed high-performance e-commerce platforms." }
          ].map((item, i) => (
            <motion.div 
              key={i}
              initial={{ opacity: 0, x: i % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className={`relative flex flex-col md:flex-row items-center justify-between mb-16 ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
            >
              {/* Dot */}
              <div className="absolute left-[-4px] md:left-1/2 top-0 w-2 h-2 bg-[#00F3FF] rounded-full shadow-[0_0_10px_#00F3FF] transform md:-translate-x-1/2" />
              
              <div className="w-full md:w-5/12 pl-8 md:pl-0">
                <div className={`p-6 bg-black/50 backdrop-blur-md border border-white/10 rounded-2xl hover:border-[#4B0082] transition-colors ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'}`}>
                  <span className="text-[#00F3FF] font-mono text-sm">{item.year}</span>
                  <h3 className="text-xl font-bold mt-2">{item.role}</h3>
                  <h4 className="text-white/70 text-sm mb-4">{item.company}</h4>
                  <p className="text-white/50 text-sm">{item.desc}</p>
                </div>
              </div>
              <div className="hidden md:block w-5/12" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-32 relative z-10">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto bg-gradient-to-br from-black/80 to-[#4B0082]/20 backdrop-blur-xl border border-white/20 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,243,255,0.1)]"
        >
          <h2 className="text-4xl font-bold tracking-tighter mb-2 text-center">INITIATE <span className="text-[#00F3FF]">CONTACT</span></h2>
          <p className="text-center text-white/50 mb-8 font-mono text-sm">AWAITING TRANSMISSION...</p>

          <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#00F3FF]">IDENTIFIER</label>
                <input type="text" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#00F3FF]/50 transition-colors" placeholder="Name" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-mono text-[#00F3FF]">COMM-LINK</label>
                <input type="email" className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#00F3FF]/50 transition-colors" placeholder="Email" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-mono text-[#00F3FF]">PAYLOAD</label>
              <textarea className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-3 text-white focus:outline-none focus:border-[#00F3FF]/50 transition-colors resize-y" placeholder="Message"></textarea>
            </div>
            <button 
              onMouseEnter={playHover}
              onClick={playClick}
              className="w-full py-4 bg-white text-black font-bold tracking-widest uppercase rounded-xl hover:bg-[#00F3FF] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all duration-300"
            >
              Transmit
            </button>
          </form>
        </motion.div>
      </section>
    </div>
  );
}
