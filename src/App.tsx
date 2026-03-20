/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Lab from './pages/Lab';
import Chatbot from './components/Chatbot';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate preloader
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => {
      clearTimeout(timer);
    };
  }, []);

  if (loading) return <Preloader />;

  return (
    <Router>
      <Cursor />
      <div className="relative w-full min-h-screen bg-black text-white font-sans selection:bg-neon-blue selection:text-black">
        {/* 3D Background */}
        <div className="fixed inset-0 z-0 pointer-events-none">
          <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.2} />
              <directionalLight position={[10, 10, 5]} intensity={1} color="#00F3FF" />
              <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4B0082" />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <Environment preset="city" />
            </Suspense>
          </Canvas>
        </div>

        {/* UI Overlay */}
        <div className="relative z-10 w-full">
          <Navbar />
          
          <main className="min-h-screen pt-24 px-6 md:px-12 lg:px-24 max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/lab" element={<Lab />} />
            </Routes>
          </main>
        </div>

        {/* Floating Chatbot */}
        <Chatbot />
      </div>
    </Router>
  );
}
