"use client";
import { Header } from "@/components/Header";
import { EmotionCard } from "@/components/EmotionCard";
import { TimelineChart } from "@/components/TimelineChart";
import { PieChart } from "@/components/PieChart";
import { Heatmap } from "@/components/Heatmap";
import { useEmotionData } from "@/hooks/useEmotionData";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { data, lastUpdate, loading } = useEmotionData();
  const atual = data.at(-1);
  const scoreSums: Record<string, number> = {};
  data.forEach((d) => {
    Object.entries(d.scores).forEach(([emo, val]) => {
      scoreSums[emo] = (scoreSums[emo] || 0) + val / data.length;
    });
  });

  return (
    <main className="w-full min-h-screen flex flex-col bg-transparent p-2 md:p-6 xl:p-10 gap-8 font-[var(--font-main)]">
      <Header lastUpdate={lastUpdate} />
      {loading || !atual ? (
        <div className="flex flex-1 h-[55vh] items-center justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55 }} className="flex flex-col items-center gap-3">
            <Loader2 className="animate-spin w-11 h-11 text-zinc-500" />
            <span className="font-medium text-zinc-400 tracking-wide text-lg">Analisando emoções...</span>
          </motion.div>
        </div>
      ) : (
        <div className="w-full flex-1 flex flex-col xl:flex-row gap-8 min-h-0">
          <div className="flex flex-col gap-8 items-stretch xl:w-1/4 min-w-0">
            <EmotionCard emotion={atual.dominant} intensity={atual.intensity} />
            <Heatmap data={data} />
          </div>
          <div className="flex flex-col gap-8 flex-1 min-w-0">
            <TimelineChart data={data} />
          </div>
          <div className="flex flex-col gap-8 items-stretch xl:w-1/4 min-w-0">
            <PieChart scoreSums={scoreSums} />
          </div>
        </div>
      )}
    </main>
  );
}
