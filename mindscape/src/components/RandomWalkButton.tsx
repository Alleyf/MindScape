import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

interface RandomWalkButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function RandomWalkButton({ onClick, disabled }: RandomWalkButtonProps) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0 0 30px rgba(233, 69, 96, 0.5)"
      }}
      whileTap={{ scale: 0.95 }}
      className="relative px-8 py-4 bg-gradient-to-r from-nebula-accent to-nebula-glow rounded-full font-bold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden"
    >
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-gradient bg-[length:200%_200%]" />
      
      {/* Content */}
      <span className="relative z-10 flex items-center gap-3">
        <motion.span
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          ✨
        </motion.span>
        随机漫步
        <motion.span
          animate={{ rotate: [0, -360] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        >
          🌟
        </motion.span>
      </span>
      
      {/* Glow ring */}
      <div className="absolute inset-0 rounded-full border-2 border-white/30 group-hover:border-white/60 transition-colors" />
    </motion.button>
  );
}
