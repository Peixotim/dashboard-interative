"use client";
import { useState } from "react";
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";

const ranges = [
  { value: "30", label: "Últimos 1:30" },
  { value: "12", label: "Últimos 1:00" },
  { value: "6", label: "Últimos 0:30" },
];

// ✅ Componente para o Controle Segmentado (estilo Apple)
function SegmentedControl({ options, value, onChange }: { options: typeof ranges; value: string; onChange: (val: string) => void }) {
  return (
    <div className="flex items-center gap-1 bg-zinc-800/50 p-1 rounded-lg border border-zinc-700">
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative px-3 py-1 text-xs font-medium transition-colors duration-300 ${
            value === opt.value ? "text-white" : "text-zinc-400 hover:text-white"
          }`}
        >
          {value === opt.value && (
            <motion.div
              layoutId="segmented-control-active-bg"
              className="absolute inset-0 bg-indigo-600 rounded-md shadow-md"
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          )}
          <span className="relative z-10">{opt.label}</span>
        </button>
      ))}
    </div>
  );
}


export function TimelineChart({ data }: { data: EmotionData[] }) {
  const [range, setRange] = useState("30");
  const chartData = data.slice(-parseInt(range));

  return (
    // ✅ Card com o mesmo estilo premium dos outros componentes
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full h-full flex flex-col rounded-3xl p-6 bg-zinc-900/50 border border-white/10 shadow-2xl shadow-indigo-900/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className="text-lg font-bold text-white">Variação de Intensidade</h3>
          <p className="text-sm text-zinc-400">Em tempo real</p>
        </div>
        {/* ✅ Substituído o <Select> pelo <SegmentedControl> */}
        <SegmentedControl options={ranges} value={range} onChange={setRange} />
      </div>
      
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              {/* ✅ Gradiente mais suave */}
              <linearGradient id="areaIntensidade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#818CF8" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 5" stroke="#ffffff1a" vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(t) => new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              style={{ fontSize: 12, fill: "#a1a1aa" }}
            />
            <YAxis
              domain={[0, 1]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v * 100}%`} // ✅ Eixo Y com porcentagens
              style={{ fontSize: 12, fill: "#a1a1aa" }}
            />
            <Tooltip
              cursor={{ stroke: "#818CF8", strokeWidth: 1, strokeDasharray: "3 3" }}
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                const y = payload[0].value as number;
                return (
                  // ✅ Tooltip com efeito "glassmorphism"
                  <div className="rounded-xl px-3 py-2 bg-zinc-800/80 backdrop-blur-md border border-zinc-700 shadow-lg text-xs">
                    <div className="text-zinc-300 pb-0.5">{new Date(label as string).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</div>
                    <div className="font-bold text-indigo-400">{Math.round(y*100)}% de intensidade</div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="intensity"
              stroke="#818CF8"
              strokeWidth={3}
              fill="url(#areaIntensidade)"
              dot={false}
              isAnimationActive
              animationDuration={500}
              // ✅ Ponto ativo que aparece no hover, com animação
              activeDot={{
                r: 6,
                stroke: "#18181b",
                strokeWidth: 2,
                fill: "#c7d2fe",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}

// Definição do tipo EmotionData (coloque em um arquivo separado, ex: 'types.ts')
export type EmotionData = {
  timestamp: number;
  intensity: number;
  emotion: string;
};