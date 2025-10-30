"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ✅ Cores alinhadas com o Tailwind (para consistência)
const emotionColors: Record<string, string> = {
  alegria: "#6366F1",  // indigo-500
  tristeza: "#22D3EE", // cyan-500
  raiva: "#F87171",    // red-400
  surpresa: "#a78bfa", // violet-400
  medo: "#facc15",     // yellow-500
  nojo: "#10B981",     // emerald-600
  neutro: "#9ca3af",   // zinc-400
};

interface PieChartProps {
  scoreSums: Record<string, number>;
}

export function PieChart({ scoreSums }: PieChartProps) {
  const data = Object.entries(scoreSums).map(([key, value]) => ({ name: key, value }));
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  // ✅ Ajustes para o anel de Donut
  const radius = 60;
  const strokeWidth = 18;
  const circumference = 2 * Math.PI * radius;

  // Lógica para desenhar os arcos
  const getArc = (percent: number, startAngle: number) => {
    const endAngle = startAngle + percent * Math.PI * 2;
    const x1 = Math.cos(startAngle - Math.PI / 2) * radius;
    const y1 = Math.sin(startAngle - Math.PI / 2) * radius;
    const x2 = Math.cos(endAngle - Math.PI / 2) * radius;
    const y2 = Math.sin(endAngle - Math.PI / 2) * radius;
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return { d: `M ${x1} ${y1} A ${radius} ${radius} 0 ${large} 1 ${x2} ${y2}` };
  };

  let lastEnd = 0;

  // Valor central (TOTAL ou a emoção em hover)
  const centerValue = hoveredIdx !== null ? (data[hoveredIdx]?.value ?? 0) : total;
  const centerLabel = hoveredIdx !== null ? data[hoveredIdx]?.name : 'TOTAL';

  return (
    // ✅ Card com o mesmo estilo premium dos outros
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className="w-full flex flex-col rounded-3xl p-6 bg-zinc-900/50 border border-white/10 shadow-2xl shadow-indigo-900/20"
    >
      <h3 className="text-lg font-bold text-white mb-4">Distribuição de Emoções</h3>

      {/* --- Gráfico de Rosca --- */}
      <div className="flex-1 flex items-center justify-center relative min-h-[160px] w-full">
        <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} className="transform -rotate-90">
          <g transform={`translate(${radius + strokeWidth / 2},${radius + strokeWidth / 2})`}>
            {/* Trilha de fundo */}
            <circle
              cx={0} cy={0} r={radius}
              fill="transparent"
              stroke="#ffffff1a"
              strokeWidth={strokeWidth}
            />
            {/* Arcos das emoções */}
            {data.map((emoc, i) => {
              const percent = emoc.value / total;
              const { d } = getArc(percent, lastEnd);
              const isHovered = hoveredIdx === i;
              lastEnd += percent * Math.PI * 2;
              
              return (
                <motion.path
                  key={emoc.name}
                  d={d}
                  stroke={emotionColors[emoc.name] || "#9ca3af"}
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth} // ✅ Efeito de hover sutil
                  style={{ filter: isHovered ? `drop-shadow(0 0 8px ${emotionColors[emoc.name]})` : 'none', cursor: 'pointer' }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 * i, type: 'spring', bounce: 0 }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </g>
        </svg>
        
        {/* Texto central animado */}
        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredIdx === null ? "total" : data[hoveredIdx].name}
            className="absolute left-1/2 top-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 select-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <span className="text-3xl font-extrabold" style={{ color: hoveredIdx !== null ? emotionColors[data[hoveredIdx]?.name] : "#FFF" }}>
              {hoveredIdx !== null ? `${Math.round(centerValue * 100)}%` : total.toFixed(2)}
            </span>
            <span className="text-xs font-semibold text-zinc-400 tracking-wide uppercase">{centerLabel}</span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* --- Legenda --- */}
      <div className="flex flex-wrap gap-2 w-full justify-center mt-4">
        {data.map(({ name, value }, idx) => (
          <div
            key={name}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-200"
            style={{
              borderColor: emotionColors[name] + '80', // Borda com 50% de opacidade
              backgroundColor: hoveredIdx === idx ? emotionColors[name] + '30' : 'transparent', // Fundo no hover
              cursor: 'pointer'
            }}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: emotionColors[name] }} />
            <span className="text-xs font-medium text-zinc-300 capitalize">{name}</span>
            <span className="text-xs font-bold text-white">{Math.round(value * 100)}%</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
