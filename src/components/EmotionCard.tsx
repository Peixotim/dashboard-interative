"use client";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Smile, Frown, Angry, Meh, Zap, CloudLightning, Flower } from "lucide-react";

const emotionIcons: Record<string, React.ReactNode> = {
  Alegria: <Smile size={50} strokeWidth={1.5} className="text-[#6366F1]" />,
  Tristeza: <Frown size={50} strokeWidth={1.5} className="text-[#22D3EE]" />,
  Raiva: <Angry size={50} strokeWidth={1.5} className="text-[#F87171]" />,
  Surpresa: <Zap size={50} strokeWidth={1.5} className="text-[#a78bfa]" />,
  Medo: <CloudLightning size={50} strokeWidth={1.5} className="text-[#facc15]" />,
  Nojo: <Flower size={50} strokeWidth={1.5} className="text-[#10B981]" />,
  Neutro: <Meh size={50} strokeWidth={1.2} className="text-zinc-400" />,
};

const emotionGradients: Record<string, string> = {
  Alegria: "bg-gradient-to-br from-[#f1f5ff] via-[#6366f188] to-[#6366f122]",
  Tristeza: "bg-gradient-to-br from-[#f1fdff] via-[#22D3EE55] to-[#22D3EE11]",
  Raiva: "bg-gradient-to-br from-[#fff1f4] via-[#f8717188] to-[#f871711a]",
  Surpresa: "bg-gradient-to-br from-[#fbf7ff] via-[#a78bfa88] to-[#a78bfa18]",
  Medo: "bg-gradient-to-br from-[#f7faff] via-[#facc1585] to-[#facc1515]",
  Nojo: "bg-gradient-to-br from-[#f1fff5] via-[#10B98166] to-[#10B9811b]",
  Neutro: "bg-gradient-to-br from-[#e1e1e2] via-[#d1d1d198] to-[#aeaeb220]",
};

import { useRef, useEffect } from "react";

interface EmotionCardProps {
  emotion: string;
  intensity: number;
}

export function EmotionCard({ emotion, intensity }: EmotionCardProps) {
  const previous = useRef<string>(emotion);
  const changed = previous.current !== emotion;
  useEffect(() => { previous.current = emotion; }, [emotion]);

  return (
    <motion.div
      className={`card-minimal w-full max-w-xl flex flex-col gap-6 items-center px-5 pt-7 pb-8 sm:p-8 rounded-3xl shadow-lg border relative ${emotionGradients[emotion] || emotionGradients["Neutro"]}`}
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: .55, type: "spring", bounce: 0.33 }}
      key={emotion}
      whileHover={{ scale: 1.01 }}
      style={{ minHeight: 250 }}
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
          <h2 className="h2 text-lg md:text-2xl font-semibold text-zinc-900 dark:text-zinc-50 capitalize tracking-tight mt-1 drop-shadow">{emotion}</h2>
        </motion.div>
      </AnimatePresence>
      <div className="flex flex-col gap-1 items-center w-full">
        <span className="text-xs text-zinc-400">Intensidade</span>
        <motion.div
          key={intensity+emotion}
          initial={{ width: 0, opacity: .7 }}
          animate={{ width: `${Math.round(intensity * 100)}%`, opacity: 1, backgroundPositionX: '100%' }}
          transition={{ duration: .9, type: 'spring', bounce: .22 }}
          className="h-4 rounded-full bg-gradient-to-r from-[#6366F1ad] via-[#22D3EEb3] to-[#10B981cc] shadow-inner border border-zinc-300/20"
          style={{ width: `${Math.round(intensity * 100)}%`, minWidth: 20 }}
        />
        <span className="text-xs font-medium text-zinc-400 mt-1">{(intensity * 100).toFixed(0)}%</span>
      </div>
      {changed && <motion.div className="absolute inset-0 pointer-events-none rounded-3xl border-[2px] border-[#6366F1] opacity-70"
        initial={{ opacity: .8, scale: 1.13 }} animate={{ opacity: 0, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.75 }} />}
    </motion.div>
  );
}
