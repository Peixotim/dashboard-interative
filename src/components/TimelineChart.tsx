"use client";
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import type { EmotionData } from "@/services/emotionService";
import { motion, AnimatePresence } from "framer-motion";

interface TimelineChartProps {
  data: EmotionData[];
}

export function TimelineChart({ data }: TimelineChartProps) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }} className="card-minimal rounded-2xl p-5 shadow-sm w-full h-72 relative">
      <AnimatePresence>
        <motion.div
          key={data.at(-1)?.timestamp}
          initial={{ boxShadow: "0 0 0 0 #6366f188" }}
          animate={{ boxShadow: "0 0 0 0px #6366f111" }}
          exit={{ boxShadow: "0 0 14px 2px #6366f180" }}
          transition={{ duration: .55 }}
          className="absolute z-0 inset-0 pointer-events-none rounded-2xl"
        />
      </AnimatePresence>
      <h3 className="h3 font-semibold text-zinc-300 mb-3">Variação de Intensidade (30m)</h3>
      <ResponsiveContainer width="100%" height="83%">
        <LineChart data={data} margin={{ left: 0, right: 6, top: 8, bottom: 6 }}>
          <CartesianGrid strokeDasharray="3 5" stroke="#23232960"/>
          <XAxis dataKey="timestamp" hide tick={{ fontFamily: 'Inter', fontSize: 12 }} />
          <YAxis domain={[0, 1]} ticks={[0, 0.25, 0.5, 0.75, 1]} axisLine={false} tickLine={false} tick={{ fill: '#6366f1', fontSize: 12, fontWeight: 500 }} />
          <Tooltip
            contentStyle={{ background: "#18181b", border: '1px solid #232329', borderRadius: 11, color: '#6366f1', fontFamily: "Inter,Outfit,sans-serif" }}
            labelFormatter={value => {
              const d = new Date(value as string);
              return d.toLocaleTimeString("pt-BR");
            }}
            formatter={val => `${Math.round((val as number) * 100)}%`}
            itemStyle={{ color: "#6366f1", fontWeight: 600 }}
          />
          <Line
            type="monotone"
            dataKey="intensity"
            stroke="#6366F1"
            strokeWidth={3}
            dot={false}
            isAnimationActive={true}
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>
    </motion.div>
  );
}
