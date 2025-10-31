"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Angry, Meh, Zap, CloudLightning, Flower } from "lucide-react";
import { useRef, useEffect } from "react";

// O mapa de ícones está ótimo como está.
const emotionIcons: Record<string, React.ReactNode> = {
  Alegria: <Smile size={50} strokeWidth={1.5} className="text-[#6366F1]" />,
  Tristeza: <Frown size={50} strokeWidth={1.5} className="text-[#22D3EE]" />,
  Raiva: <Angry size={50} strokeWidth={1.5} className="text-[#F87171]" />,
  Surpresa: <Zap size={50} strokeWidth={1.5} className="text-[#a78bfa]" />,
  Medo: <CloudLightning size={50} strokeWidth={1.5} className="text-[#facc15]" />,
  Nojo: <Flower size={50} strokeWidth={1.5} className="text-[#10B981]" />,
  Neutro: <Meh size={50} strokeWidth={1.2} className="text-zinc-400" />,
};

// ✅ NOVO MAPA de cores para a borda animada
// Isso torna a animação "shockwave" dinâmica
const emotionBorders: Record<string, string> = {
  Alegria: "border-[#6366F1]",
  Tristeza: "border-[#22D3EE]",
  Raiva: "border-[#F87171]",
  Surpresa: "border-[#a78bfa]",
  Medo: "border-[#facc15]",
  Nojo: "border-[#10B981]",
  Neutro: "border-zinc-400",
};

interface EmotionCardProps {
  emotion: string;
  intensity: number;
}

export function EmotionCard({ emotion, intensity }: EmotionCardProps) {
  const currentBorder = emotionBorders[emotion] || emotionBorders["Neutro"];

  return (
    <motion.div
      // ✅ ESTILO ATUALIZADO:
      // Removemos 'emotionGradients' e aplicamos o estilo "glassmorphism"
      // Adicionamos 'h-full' para que ele preencha a célula do grid
      className={`w-full h-full flex flex-col gap-6 items-center justify-center p-6 rounded-3xl shadow-2xl bg-zinc-900/50 border border-white/10 relative`}
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
          {/* ✅ COR DO TEXTO CORRIGIDA: de text-zinc-900 para text-zinc-100 */}
          <h2 className="h2 text-lg md:text-2xl font-semibold text-zinc-100 capitalize tracking-tight mt-1 drop-shadow">{emotion}</h2>
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-col gap-1.5 items-center w-full">
        <span className="text-xs text-zinc-400">Intensidade</span>
        
        {/* ✅ Track da barra de progresso */}
        <div className="w-full h-4 bg-zinc-700/50 rounded-full overflow-hidden border border-zinc-700/80 shadow-inner">
          <motion.div
            key={intensity + emotion}
            initial={{ width: 0 }}
            animate={{ width: `${Math.round(intensity * 100)}%` }}
            transition={{ duration: .9, type: 'spring', bounce: .22 }}
            // ✅ Barra de progresso com gradiente (como no seu código original)
            className="h-full rounded-full bg-gradient-to-r from-[#6366F1ad] via-[#22D3EEb3] to-[#10B981cc]"
            style={{ minWidth: 2 }}
          />
        </div>
        <span className="text-xs font-medium text-zinc-400 mt-1">{(intensity * 100).toFixed(0)}%</span>
      </div>

      {/* ✅ ANIMAÇÃO DE BORDA DINÂMICA: */}
      {/* A cor da borda agora muda com a emoção */}
      <motion.div
        key={emotion + "-border"} // Chave diferente para garantir que a animação ocorra
        className={`absolute inset-0 pointer-events-none rounded-3xl border-2 opacity-70 ${currentBorder}`}
        initial={{ opacity: .8, scale: 1.13 }}
        animate={{ opacity: 0, scale: 1 }}
        transition={{ duration: 0.75 }}
      />
    </motion.div>
  );
}
