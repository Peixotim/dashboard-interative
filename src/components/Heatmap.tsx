"use client";
import type { EmotionData } from "@/services/emotionService";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useTheme } from "next-themes";

// 🎨 Cores por emoção para dark mode
const EMOTION_COLORS_DARK: Record<string, string> = {
  alegria: "bg-indigo-500",
  tristeza: "bg-cyan-500",
  raiva: "bg-red-400",
  surpresa: "bg-violet-400",
  medo: "bg-yellow-400",
  nojo: "bg-emerald-500",
  neutro: "bg-zinc-500",
};

// 🌞 Cores por emoção para light mode (mais sutis, estilo Apple/Google)
const EMOTION_COLORS_LIGHT: Record<string, string> = {
  alegria: "bg-indigo-300",
  tristeza: "bg-cyan-300",
  raiva: "bg-red-300",
  surpresa: "bg-violet-300",
  medo: "bg-yellow-300",
  nojo: "bg-emerald-400",
  neutro: "bg-zinc-400",
};

interface HeatmapProps {
  data: EmotionData[];
}

export function Heatmap({ data }: HeatmapProps) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const emotionColors = isDarkMode ? EMOTION_COLORS_DARK : EMOTION_COLORS_LIGHT;

  if (!data.length) return null;

  const recentData = data.slice(-100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className={`w-full h-full flex flex-col rounded-3xl p-6
                  ${isDarkMode ? "bg-zinc-900/50 shadow-2xl shadow-purple-700/20" : "bg-white border border border-zinc-200 shadow-zinc-400/20  "}`}
    >
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
        Linha do Tempo Emocional
      </h3>

      <TooltipProvider delayDuration={0}>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence>
            {recentData.map((item, idx) => (
              <Tooltip key={item.timestamp}>
                <TooltipTrigger asChild>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    className={`w-3.5 h-3.5 rounded-[3px] ${emotionColors[item.dominant.toLowerCase()] || "bg-zinc-400"}`}
                    style={{ opacity: Math.max(0.2, item.intensity) }}
                  />
                </TooltipTrigger>
                <TooltipContent
                  className={`rounded-md text-xs ${
                    isDarkMode
                      ? "bg-zinc-800/80 backdrop-blur-md border border-zinc-700 text-white"
                      : "bg-white/80 backdrop-blur-md border border-zinc-200 text-zinc-900"
                  }`}
                >
                  <p className="font-bold capitalize">{item.dominant} ({Math.round(item.intensity * 100)}%)</p>
                  <p className={`${isDarkMode ? "text-zinc-300" : "text-zinc-500"}`}>
                    {new Date(item.timestamp).toLocaleTimeString("pt-BR")}
                  </p>
                </TooltipContent>
              </Tooltip>
            ))}
          </AnimatePresence>
        </div>
      </TooltipProvider>
    </motion.div>
  );
}
