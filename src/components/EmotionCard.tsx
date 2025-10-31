"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Angry, Meh, Zap, CloudLightning, Flower } from "lucide-react";
import { useTheme } from "next-themes";

// ÍCONES
const emotionIconsLight: Record<string, React.ReactNode> = {
  Alegria: <Smile size={50} strokeWidth={1.5} className="text-[#2563EB]" />,
  Tristeza: <Frown size={50} strokeWidth={1.5} className="text-[#0284C7]" />,
  Raiva: <Angry size={50} strokeWidth={1.5} className="text-[#EF4444]" />,
  Surpresa: <Zap size={50} strokeWidth={1.5} className="text-[#8B5CF6]" />,
  Medo: <CloudLightning size={50} strokeWidth={1.5} className="text-[#FBBF24]" />,
  Nojo: <Flower size={50} strokeWidth={1.5} className="text-[#10B981]" />,
  Neutro: <Meh size={50} strokeWidth={1.2} className="text-zinc-600" />,
};

const emotionIconsDark: Record<string, React.ReactNode> = {
  Alegria: <Smile size={50} strokeWidth={1.5} className="text-[#6366F1]" />,
  Tristeza: <Frown size={50} strokeWidth={1.5} className="text-[#22D3EE]" />,
  Raiva: <Angry size={50} strokeWidth={1.5} className="text-[#F87171]" />,
  Surpresa: <Zap size={50} strokeWidth={1.5} className="text-[#a78bfa]" />,
  Medo: <CloudLightning size={50} strokeWidth={1.5} className="text-[#facc15]" />,
  Nojo: <Flower size={50} strokeWidth={1.5} className="text-[#10B981]" />,
  Neutro: <Meh size={50} strokeWidth={1.2} className="text-zinc-500" />,
};

// BORDAS
const emotionBordersLight: Record<string, string> = {
  Alegria: "border-[#2563EB]",
  Tristeza: "border-[#0284C7]",
  Raiva: "border-[#EF4444]",
  Surpresa: "border-[#8B5CF6]",
  Medo: "border-[#FBBF24]",
  Nojo: "border-[#10B981]",
  Neutro: "border-zinc-400",
};

const emotionBordersDark: Record<string, string> = {
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
  const { theme } = useTheme();

  const icons = theme === "light" ? emotionIconsLight : emotionIconsDark;
  const borders = theme === "light" ? emotionBordersLight : emotionBordersDark;
  const currentBorder = borders[emotion] || borders["Neutro"];

  // Gradiente animado
  const gradient = theme === "light"
    ? "linear-gradient(90deg, #2563EB, #0284C7, #10B981)"
    : "linear-gradient(90deg, #6366F1ad, #22D3EEb3, #10B981cc)";

  return (
    <motion.div
      className={`w-full h-full flex flex-col gap-6 items-center justify-center p-6 rounded-3xl relative
                  ${theme === "light" ? "bg-white border border-zinc-200 shadow-sm" : 
                                         "bg-zinc-900/50 border-white/10 shadow-2xl shadow-purple-700/20"}`}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.55, type: "spring", bounce: 0.33 }}
      key={emotion}
      whileHover={{ scale: 1.01 }}
    >
      <AnimatePresence>
        <motion.div
          key={emotion}
          initial={{ scale: 0.78, opacity: 0, y: 32, rotate: -7 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: -14, rotate: 7 }}
          transition={{ type: "spring", stiffness: 320, damping: 24 }}
          className="flex flex-col gap-1 items-center mb-2"
        >
          {icons[emotion as keyof typeof icons] || icons["Neutro"]}
          <h2 className="h2 text-lg md:text-2xl font-semibold text-zinc-800 dark:text-zinc-100 capitalize tracking-tight mt-1 drop-shadow-sm dark:drop-shadow">
            {emotion}
          </h2>
        </motion.div>
      </AnimatePresence>

      <div className="flex flex-col gap-1.5 items-center w-full">
        <span className="text-xs text-zinc-500 dark:text-zinc-400">Intensidade</span>

        <div className="w-full h-4 bg-zinc-100 dark:bg-zinc-700/50 rounded-full overflow-hidden border border-zinc-300 dark:border-zinc-700/80 shadow-inner">
          <motion.div
            key={intensity + emotion}
            initial={{ width: 0, backgroundPositionX: "0%" }}
            animate={{ 
              width: `${Math.round(intensity * 100)}%`, 
              backgroundPositionX: ["0%", "200%"] 
            }}
            transition={{ duration: 1.2, repeat: 0, type: "tween" }}
            className="h-full rounded-full"
            style={{ backgroundImage: gradient, backgroundSize: "200% 100%" }}
          />
        </div>

        <span className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">
          {(intensity * 100).toFixed(0)}%
        </span>
      </div>

      {/* Borda animada */}
      <motion.div
        key={emotion + "-border"}
        className={`absolute inset-0 pointer-events-none rounded-3xl border-2 opacity-70 ${currentBorder}`}
        initial={{ opacity: 0.8, scale: 1.13 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.75 }}
      />
    </motion.div>
  );
}
