"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

// 🎨 Cores dark-mode igual ao EmotionCard
const EMOTION_COLORS_DARK: Record<string, string> = {
  alegria: "#6366F1",   // indigo-500
  tristeza: "#22D3EE",  // cyan-500
  raiva: "#F87171",     // red-400
  surpresa: "#A78BFA",  // violet-400
  medo: "#FACC15",      // yellow-500
  nojo: "#10B981",      // emerald-600
  neutro: "#9CA3AF",    // zinc-400
  
  // --- Adicionadas as chaves em minúsculas que faltavam ---
  happy: "#6366F1",
  sad: "#22D3EE",
  angry: "#F87171",
  surprise: "#A78BFA",
  fear: "#FACC15",
  disgust: "#10B981",
  neutral: "#9CA3AF",
};

// 🌞 Light-mode cores vibrantes
const EMOTION_COLORS_LIGHT: Record<string, string> = {
  alegria: "#2563EB",
  tristeza: "#0284C7",
  raiva: "#DC2626",
  surpresa: "#8B5CF6",
  medo: "#FBBF24",
  nojo: "#047857",
  neutro: "#71717A",
  
  // --- Adicionadas as chaves em minúsculas que faltavam ---
  happy: "#2563EB",
  sad: "#0284C7",
  angry: "#DC2626",
  surprise: "#8B5CF6",
  fear: "#FBBF24",
  disgust: "#047857",
  neutral: "#71717A",
};

// --- ALTERAÇÃO AQUI ---
interface PieChartProps {
  scores: Record<string, number>; // Renomeado de 'scoreSums' para 'scores'
}

export function PieChart({ scores }: PieChartProps) { // Renomeado de 'scoreSums' para 'scores'
  // --- FIM DA ALTERAÇÃO ---

  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const emotionColors = isDarkMode ? EMOTION_COLORS_DARK : EMOTION_COLORS_LIGHT;

  // --- ALTERAÇÃO AQUI ---
  const data = Object.entries(scores).map(([name, value]) => ({ name, value }));
  // --- FIM DA ALTERAÇÃO ---
  
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const radius = 60;
  const strokeWidth = 18;

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
  const centerValue = hoveredIdx !== null ? data[hoveredIdx]?.value ?? 0 : total;
  const centerLabel = hoveredIdx !== null ? data[hoveredIdx]?.name : "TOTAL";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut", delay: 0.1 }}
      className={`w-full flex flex-col rounded-3xl p-6 border shadow-2xl transition-all duration-300 ${
        isDarkMode
          ? "bg-zinc-900/50 border-none shadow-2xl shadow-purple-800/20"
          : "bg-white border-zinc-200 shadow-zinc-400/20"
      }`}
    >
      <h3 className={`text-lg font-bold mb-4 ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
        Distribuição de Emoções
      </h3>

      <div className="flex-1 flex items-center justify-center relative min-h-40 w-full">
        <svg width={radius * 2 + strokeWidth} height={radius * 2 + strokeWidth} className="transform -rotate-90">
          <g transform={`translate(${radius + strokeWidth / 2},${radius + strokeWidth / 2})`}>
            {/* Trilha de fundo */}
            <circle
              cx={0}
              cy={0}
              r={radius}
              fill="transparent"
              stroke={isDarkMode ? "#ffffff1a" : "#00000010"}
              strokeWidth={strokeWidth}
            />

            {/* Arcos das emoções */}
            {data.map((emoc, i) => {
              const percent = emoc.value / total;
              const { d } = getArc(percent, lastEnd);
              const isHovered = hoveredIdx === i;
              lastEnd += percent * Math.PI * 2;
              
              // Garante que a cor é encontrada (ex: 'happy' vs 'Alegria')
              const colorKey = emoc.name.toLowerCase();

              return (
                <motion.path
                  key={emoc.name}
                  d={d}
                  stroke={emotionColors[colorKey]}
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth={isHovered ? strokeWidth + 2 : strokeWidth}
                  style={{
                    filter: isHovered ? `drop-shadow(0 0 8px ${emotionColors[colorKey]})` : "none",
                    cursor: "pointer",
                  }}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.8, delay: 0.1 * i, type: "spring", bounce: 0 }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </g>
        </svg>

        <AnimatePresence mode="wait">
          <motion.div
            key={hoveredIdx === null ? "total" : data[hoveredIdx].name}
            className="absolute left-1/2 top-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 select-none"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.15 }}
          >
            <span
              className="text-3xl font-extrabold"
              style={{
                color: hoveredIdx !== null
                  ? emotionColors[data[hoveredIdx].name.toLowerCase()] // Chave em minúsculas
                  : isDarkMode
                  ? "#FFF"
                  : "#1C1D22",
              }}
            >
              {/* O valor agora é 0-1, então * 100 é a % correta */}
              {hoveredIdx !== null ? `${Math.round(centerValue * 100)}%` : total.toFixed(2)}
            </span>
            <span className={`text-xs font-semibold tracking-wide uppercase ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>
              {centerLabel}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap gap-2 w-full justify-center mt-4">
        {data.map(({ name, value }, idx) => {
          const colorKey = name.toLowerCase();
          return (
            <div
              key={name}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border transition-all duration-200"
              style={{
                borderColor: emotionColors[colorKey] + "80",
                backgroundColor: hoveredIdx === idx ? emotionColors[colorKey] + "30" : "transparent",
                cursor: "pointer",
              }}
              onMouseEnter={() => setHoveredIdx(idx)}
              onMouseLeave={() => setHoveredIdx(null)}
            >
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: emotionColors[colorKey] }} />
              <span className={`text-xs font-medium capitalize ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                {name}
              </span>
              <span className={`text-xs font-bold ${isDarkMode ? "text-white" : "text-zinc-900"}`}>
                {/* O valor agora é 0-1, então * 100 é a % correta */}
                {Math.round(value * 100)}%
              </span>
            </div>
          );
        })}
      </div>
    </motion.div>
  );
}
