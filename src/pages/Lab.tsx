import { useState, ChangeEvent } from 'react';
import { motion } from 'motion/react';
import { Upload, Video, Loader2, Sparkles } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { useUISounds } from '../hooks/useUISounds';

let aiClient: GoogleGenAI | null = null;

function getAIClient() {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not set");
    }
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

export default function Lab() {
  const { playHover, playClick } = useUISounds();
  const [file, setFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const generateVideo = async () => {
    playClick();
    if (!file) {
      setError("Please upload an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setVideoUrl(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        const base64Data = (reader.result as string).split(',')[1];
        const mimeType = file.type;

        try {
          const ai = getAIClient();
          let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt || 'Animate this image',
            image: {
              imageBytes: base64Data,
              mimeType: mimeType,
            },
            config: {
              numberOfVideos: 1,
              resolution: '720p',
              aspectRatio: '16:9'
            }
          });

          // Poll for completion
          while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 10000));
            operation = await ai.operations.getVideosOperation({ operation: operation });
          }

          const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
          
          if (downloadLink) {
            // Fetch video with API key header
            const response = await fetch(downloadLink, {
              method: 'GET',
              headers: {
                'x-goog-api-key': process.env.GEMINI_API_KEY || '',
              },
            });
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setVideoUrl(url);

            // Save to Firestore
            await addDoc(collection(db, 'videoGenerations'), {
              userId: 'anonymous',
              prompt: prompt,
              videoUrl: url, // In a real app, upload blob to Storage first
              status: 'completed',
              createdAt: new Date().toISOString()
            });
          } else {
            throw new Error("No video generated");
          }
        } catch (genError) {
          console.error("Generation error:", genError);
          setError("Failed to generate video. Please try again.");
        } finally {
          setLoading(false);
        }
      };
    } catch (err) {
      console.error(err);
      setError("An unexpected error occurred.");
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full min-h-screen py-32 z-10">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-16 text-center"
      >
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-white via-[#00F3FF] to-[#4B0082]">
          AI LAB
        </h1>
        <p className="mt-6 text-xl text-white/50 font-light tracking-widest uppercase">
          Experimental Video Generation
        </p>
      </motion.div>

      <div className="max-w-4xl mx-auto bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,243,255,0.1)]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Input Section */}
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#00F3FF]" /> Input Image
              </h3>
              <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed border-white/20 rounded-2xl cursor-pointer hover:border-[#00F3FF]/50 hover:bg-white/5 transition-all">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  {file ? (
                    <img src={URL.createObjectURL(file)} alt="Preview" className="h-48 object-contain rounded-lg" />
                  ) : (
                    <>
                      <Upload className="w-10 h-10 text-white/50 mb-4" />
                      <p className="mb-2 text-sm text-white/70"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                      <p className="text-xs text-white/50">PNG, JPG up to 10MB</p>
                    </>
                  )}
                </div>
                <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
              </label>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-4">Prompt (Optional)</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe how you want to animate this image..."
                className="w-full h-32 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#00F3FF]/50 transition-colors resize-y"
              />
            </div>

            <button
              onClick={generateVideo}
              onMouseEnter={playHover}
              disabled={loading || !file}
              className="w-full py-4 bg-gradient-to-r from-[#00F3FF] to-[#4B0082] text-white font-bold tracking-widest uppercase rounded-xl hover:shadow-[0_0_30px_rgba(0,243,255,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Video className="w-5 h-5" />}
              {loading ? "Synthesizing..." : "Generate Video"}
            </button>

            {error && <p className="text-red-400 text-sm text-center">{error}</p>}
          </div>

          {/* Output Section */}
          <div className="flex flex-col justify-center">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Video className="w-5 h-5 text-[#4B0082]" /> Output
            </h3>
            <div className="w-full aspect-video bg-black/80 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center relative">
              {loading ? (
                <div className="flex flex-col items-center gap-4">
                  <div className="w-16 h-16 border-t-2 border-b-2 border-[#00F3FF] rounded-full animate-spin"></div>
                  <p className="text-sm text-[#00F3FF] font-mono animate-pulse">Processing Neural Network...</p>
                </div>
              ) : videoUrl ? (
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover" />
              ) : (
                <div className="text-center text-white/30">
                  <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p className="font-mono text-sm">AWAITING INPUT</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
