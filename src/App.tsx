/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Suspense, useEffect, useState, Component, ErrorInfo, ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars } from '@react-three/drei';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Projects from './pages/Projects';
import Lab from './pages/Lab';
import Chatbot from './components/Chatbot';
import Preloader from './components/Preloader';
import Cursor from './components/Cursor';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[var(--bg-color)] text-[var(--text-color)] p-8 text-center">
          <div>
            <h1 className="text-4xl font-bold text-[#00F3FF] mb-4">SYSTEM ERROR</h1>
            <p className="text-[var(--text-color)]/70">A critical error occurred during initialization.</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-8 px-6 py-3 bg-[var(--text-color)]/10 hover:bg-[var(--text-color)]/20 border border-[var(--text-color)]/20 rounded-xl transition-colors"
            >
              REBOOT SYSTEM
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export class CanvasErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error) {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.warn("Canvas error (WebGL might not be supported):", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return null; // Fail silently for the background canvas
    }
    return this.props.children;
  }
}

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
    <ErrorBoundary>
      <Router>
        <Cursor />
        <div className="relative w-full min-h-screen font-sans selection:bg-neon-blue selection:text-black">
          {/* 3D Background */}
          <div className="fixed inset-0 z-0 pointer-events-none">
            <CanvasErrorBoundary>
              <Canvas camera={{ position: [0, 0, 5], fov: 45 }}>
                <Suspense fallback={null}>
                  <ambientLight intensity={0.2} />
                  <directionalLight position={[10, 10, 5]} intensity={1} color="#00F3FF" />
                  <directionalLight position={[-10, -10, -5]} intensity={0.5} color="#4B0082" />
                  <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
                </Suspense>
              </Canvas>
            </CanvasErrorBoundary>
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
    </ErrorBoundary>
  );
}
