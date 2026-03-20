import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles } from 'lucide-react';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUISounds } from '../hooks/useUISounds';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Chatbot() {
  const { playHover, playClick } = useUISounds();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input;
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setInput('');
    setIsTyping(true);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: `You are an AI assistant on a futuristic portfolio website. 
        Answer the user's question concisely and in a cyber/futuristic tone.
        User: ${userMessage}`,
        config: {
          thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
        }
      });

      const aiMessage = response.text || "Connection lost. Re-establishing link...";
      setMessages(prev => [...prev, { role: 'ai', text: aiMessage }]);

      try {
        await addDoc(collection(db, 'chatMessages'), {
          userId: 'anonymous',
          query: userMessage,
          response: aiMessage,
          createdAt: new Date().toISOString()
        });
      } catch (dbError) {
        console.error("Failed to save chat history", dbError);
      }
    } catch (error) {
      console.error("AI Error:", error);
      setMessages(prev => [...prev, { role: 'ai', text: "System error. Please try again later." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <motion.button
        className="fixed bottom-8 right-8 z-50 p-4 bg-black/50 backdrop-blur-md border border-[#00F3FF]/50 rounded-full shadow-[0_0_15px_rgba(0,243,255,0.5)] hover:shadow-[0_0_25px_rgba(0,243,255,0.8)] transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onMouseEnter={playHover}
        onClick={() => { playClick(); setIsOpen(true); }}
      >
        <MessageSquare className="w-6 h-6 text-[#00F3FF]" />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-8 z-50 w-80 h-96 bg-black/80 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-gradient-to-r from-black to-[#4B0082]/30">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00F3FF]" />
                <h3 className="font-medium tracking-widest text-sm text-white">NEXUS AI</h3>
              </div>
              <button onClick={() => { playClick(); setIsOpen(false); }} onMouseEnter={playHover} className="text-white/50 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-4 scrollbar-thin scrollbar-thumb-white/10">
              {messages.length === 0 && (
                <div className="text-center text-white/50 text-sm mt-4">
                  System online. How can I assist you today?
                </div>
              )}
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-white/10 text-white rounded-tr-none' 
                      : 'bg-[#00F3FF]/10 text-[#00F3FF] border border-[#00F3FF]/20 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#00F3FF]/10 text-[#00F3FF] border border-[#00F3FF]/20 p-3 rounded-xl rounded-tl-none text-sm animate-pulse">
                    Processing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-black/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-[#00F3FF]/50 transition-colors"
                />
                <button 
                  onClick={() => { playClick(); handleSend(); }}
                  onMouseEnter={playHover}
                  disabled={!input.trim() || isTyping}
                  className="p-2 bg-[#00F3FF]/20 text-[#00F3FF] rounded-full hover:bg-[#00F3FF]/40 transition-colors disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
