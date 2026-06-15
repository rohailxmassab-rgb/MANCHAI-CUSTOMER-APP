import { motion } from "motion/react";
import React from "react";

export function CircularButton({ children, className, onClick }: { children: React.ReactNode, className?: string, onClick?: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`bg-[#0A0A0A] text-white rounded-full flex flex-col items-center justify-center tracking-widest uppercase font-medium hover:bg-black/90 transition-all shadow-xl hover:shadow-2xl ${className}`}
    >
      {children}
    </motion.button>
  );
}
