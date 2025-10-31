"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Angry, Meh, Zap, CloudLightning, Flower } from "lucide-react";


// O mapa de ícones está ótimo como está.
const emotionIcons: Record<string, React.ReactNode> = {
  Alegria: <Smile size={50} strokeWidth={1.5} className="text-[#6366F1]" />,
  Tristeza: <Frown size={50} strokeWidth={1.5} className="text-[#22D3EE]" />,
  Raiva: <Angry size={50} strokeWidth={1.5} className="text-[#F87171]" />,
  Surpresa: <Zap size={50} strokeWidth={1.5} className="text-[#a78bfa]" />,
  Medo: <CloudLightning size={50} strokeWidth={1.5} className="text-[#facc15]" />,
  Nojo: <Flower size={50} strokeWidth={1.5} className="text-[#10B981]" />,
  Neutro: <Meh size={50} strokeWidth={1.2} className="text-zinc-500" />,
};

// O mapa de cores da borda animada está perfeito
const emotionBorders: Record<string, string> = {
  Alegria: "border-[#6366F1]",
  Tristeza: "border-[#22D3EE]",
  Raiva: "border-[#F87171]",
  Surpresa: "border-[#a78bfa]",
  Medo: "border-[#facc15]",
  Nojo: "border-[#10B981]",
  Neutro: "border-zinc-500",
};

interface EmotionCardProps {
  emotion: string;
  intensity: number;
}

export function EmotionCard({ emotion, intensity }: EmotionCardProps) {
  const currentBorder = emotionBorders[emotion] || emotionBorders["Neutro"];

  return (
    <motion.div
      // ✅ ESTILO LIGHT/DARK (Apple/Google para Light, Glassmorphism para Dark)
      className={`w-full h-full flex flex-col gap-6 items-center justify-center p-6 rounded-3xl relative
                  // --- Estilo Light Mode (Apple/Google Suave) ---
                  bg-white border border-zinc-200 shadow-md shadow-zinc-200/50
                  // --- Estilo Dark Mode (Glassmorphism) ---
                  dark:bg-zinc-900/50 dark:border-white/10 dark:shadow-2xl dark:shadow-indigo-900/20`}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: .55, type: "spring", bounce: 0.33 }}
      key={emotion}
      whileHover={{ scale: 1.01 }}
    >
      <AnimatePresence>
        <motion.div
          key={emotion}
          initial={{ scale: .78, opacity: 0, y: 32, rotate: -7 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: .88, opacity: 0, y: -14, rotate: 7 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="flex flex-col gap-1 items-center mb-2"
        >
          {emotionIcons[emotion as keyof typeof emotionIcons] || emotionIcons["Neutro"]}
          {/* ✅ COR DO TEXTO (light/dark) */}
          <h2 className="h2 text-lg md:text-2xl font-semibold text-zinc-800 dark:text-zinc-100 capitalize tracking-tight mt-1 drop-shadow-sm dark:drop-shadow">{emotion}</h2>
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-col gap-1.5 items-center w-full">
        {/* ✅ COR DO TEXTO (light/dark) */}
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Intensidade</span>
        
        {/* ✅ Track da barra de progresso (light/dark) */}
        <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-700/50 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700/80 shadow-inner">
          <motion.div
            key={intensity + emotion}
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(intensity * 100)}%` }}
            transition={{ duration: .9, type: 'spring', bounce: .22 }}
            className="h-full rounded-full bg-linear-to-r from-[#6366F1ad] via-[#22D3EEb3] to-[#10B981cc]"
            style={{ minWidth: 2 }}
          />
        </div>
        {/* ✅ COR DO TEXTO (light/dark) */}
        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">{(intensity * 100).toFixed(0)}%</span>
      </div>

      {/* A borda animada já usa as cores da emoção, então não precisa de alteração */}
      <motion.div
        key={emotion + "-border"} 
        className={`absolute inset-0 pointer-events-none rounded-3xl border-2 opacity-70 ${currentBorder}`}
        initial={{ opacity: .8, scale: 1.13 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.75 }}
      />
    </motion.div>
  );
}

