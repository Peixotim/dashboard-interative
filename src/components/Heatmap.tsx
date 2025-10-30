"use client";
import { Card } from "@/components/ui/card";
import type { EmotionData } from "@/services/emotionService";
import { motion, AnimatePresence } from "framer-motion";

const emotionColors: Record<string, string> = {
  alegria: "bg-[#6366F1]",
  tristeza: "bg-[#22D3EE]",
  raiva: "bg-[#F87171]",
  surpresa: "bg-[#a78bfa]",
  medo: "bg-[#facc15]",
  nojo: "bg-[#10B981]",
  neutro: "bg-zinc-400",
};

interface HeatmapProps {
  data: EmotionData[];
}

export function Heatmap({ data }: HeatmapProps) {
  if (!data.length) return null;
  return (
    <Card className="card-minimal w-full p-4 pt-3 rounded-2xl shadow-sm min-h-[88px]">
      <h3 className="h3 font-semibold text-zinc-300 mb-2 text-xs uppercase tracking-widest">Linha do Tempo Emocional</h3>
      <div className="flex gap-[2px] flex-wrap items-end min-h-[28px] pb-1">
        <AnimatePresence initial={false}>
          {data.map((item, idx) => (
            <motion.div
              key={item.timestamp}
              className={`w-4 h-8 md:w-5 md:h-10 rounded-md ${emotionColors[item.dominant.toLowerCase()] || "bg-zinc-400"} transition-base`}
              title={`${item.dominant} (${Math.round(item.intensity * 100)}%) às ${new Date(item.timestamp).toLocaleTimeString("pt-BR")}`}
              initial={{ scale: 0.73, opacity: .38 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
              transition={{ duration: .29, delay: 0.04*(data.length-idx) }}
            />
          ))}
        </AnimatePresence>
      </div>
    </Card>
  );
}
