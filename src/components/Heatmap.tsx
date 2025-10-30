"use client";
import type { EmotionData } from "@/services/emotionService";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// ✅ Cores atualizadas para o novo design (mais sutis, baseadas no Tailwind)
const emotionColors: Record<string, string> = {
  alegria: "bg-indigo-500",
  tristeza: "bg-cyan-500",
  raiva: "bg-red-500",
  surpresa: "bg-violet-500",
  medo: "bg-yellow-500",
  nojo: "bg-emerald-500",
  neutro: "bg-zinc-600",
};

interface HeatmapProps {
  data: EmotionData[];
}

export function Heatmap({ data }: HeatmapProps) {
  if (!data.length) return null;

  // Mostra no máximo os últimos 100 pontos de dados para não poluir a tela
  const recentData = data.slice(-100);

  return (
    // ✅ Card com o mesmo estilo premium dos outros
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
      className="w-full flex flex-col rounded-3xl p-6 bg-zinc-900/50 border border-white/10 shadow-2xl shadow-indigo-900/20"
    >
      <h3 className="text-lg font-bold text-white mb-4">Linha do Tempo Emocional</h3>
      
      <TooltipProvider delayDuration={0}>
        <div className="flex flex-wrap gap-1.5">
          <AnimatePresence>
            {recentData.map((item, idx) => (
              <Tooltip key={item.timestamp}>
                <TooltipTrigger asChild>
                  <motion.div
                    // ✅ Animação de entrada escalonada
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: idx * 0.02 }}
                    
                    // ✅ Design dos "quadradinhos" estilo GitHub
                    className={`w-3.5 h-3.5 rounded-[3px] ${emotionColors[item.dominant.toLowerCase()] || "bg-zinc-700"}`}
                    style={{ 
                      // ✅ Intensidade agora controla a opacidade
                      opacity: Math.max(0.2, item.intensity) 
                    }}
                  />
                </TooltipTrigger>
                {/* ✅ Tooltip com o mesmo estilo "glassmorphism" */}
                <TooltipContent className="rounded-md bg-zinc-800/80 backdrop-blur-md border-zinc-700 text-white text-xs">
                  <p className="font-bold capitalize">{item.dominant} ({Math.round(item.intensity * 100)}%)</p>
                  <p className="text-zinc-300">{new Date(item.timestamp).toLocaleTimeString("pt-BR")}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </AnimatePresence>
        </div>
      </TooltipProvider>
      {/* O erro de compilação estava aqui (provavelmente uma </div> extra) */}
    </motion.div>
  );
}

