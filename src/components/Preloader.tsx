import { motion } from 'motion/react';

export default function Preloader() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative flex items-center justify-center"
      >
        <div className="absolute w-32 h-32 border-t-2 border-b-2 border-[#00F3FF] rounded-full animate-spin"></div>
        <div className="absolute w-24 h-24 border-l-2 border-r-2 border-[#4B0082] rounded-full animate-spin-reverse"></div>
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="text-2xl font-bold tracking-widest text-white"
        >
          INIT
        </motion.h1>
      </motion.div>
    </div>
  );
}
