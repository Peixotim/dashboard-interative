"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const emotionColors: Record<string, string> = {
  alegria: "#6366F1",
  tristeza: "#22D3EE",
  raiva: "#F87171",
  surpresa: "#a78bfa",
  medo: "#eab308",
  nojo: "#10B981",
  neutro: "#9ca3af",
};

interface PieChartProps {
  scoreSums: Record<string, number>;
}

export function PieChart({ scoreSums }: PieChartProps) {
  const data = Object.entries(scoreSums).map(([key, value]) => ({ name: key, value }));
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  const [hoveredIdx, setHoveredIdx] = useState<number|null>(null);
  const radius = 53;
  const stroke = 18;
  const centerValue = hoveredIdx !== null ? (data[hoveredIdx]?.value ?? 0) : total;
  const centerLabel = hoveredIdx !== null ? data[hoveredIdx]?.name : 'TOTAL';

  const getArc = (percent: number, startAngle: number) => {
    const endAngle = startAngle + percent * Math.PI * 2;
    const x1 = Math.cos(startAngle - Math.PI/2) * radius;
    const y1 = Math.sin(startAngle - Math.PI/2) * radius;
    const x2 = Math.cos(endAngle - Math.PI/2) * radius;
    const y2 = Math.sin(endAngle - Math.PI/2) * radius;
    const large = endAngle - startAngle > Math.PI ? 1 : 0;
    return { d: `M${x1} ${y1} A${radius} ${radius} 0 ${large} 1 ${x2} ${y2}` };
  };

  let lastEnd = 0;

  return (
    <div className="card-minimal w-full h-124 flex flex-col rounded-2xl p-5 gap-2 items-center justify-center">
      <h3 className="h3 font-semibold text-zinc-300 mb-1 mt-1">Distribuição de Emoções</h3>
      <div className="flex flex-1 items-center justify-center relative min-h-[177px] mb-3 w-full">
        <svg width={2*radius+24} height={2*radius+24}>
          <g transform={`translate(${radius+12},${radius+12})`}>
            {data.map((emoc, i) => {
              const percent = emoc.value / total;
              const { d } = getArc(percent, lastEnd);
              const isHovered = hoveredIdx === i;
              lastEnd += percent * Math.PI * 2;
              return (
                <motion.path key={emoc.name}
                  d={d}
                  stroke={emotionColors[emoc.name]||"#9ca3af"}
                  strokeLinecap="round"
                  fill="none"
                  strokeWidth={isHovered ? stroke+7 : stroke}
                  style={{filter: isHovered ? 'drop-shadow(0 2px 13px #23232966)' : undefined, cursor: 'pointer', opacity: isHovered ? 1 : 0.85}}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: .98, delay: .07*i, type:'spring' }}
                  onMouseEnter={() => setHoveredIdx(i)}
                  onMouseLeave={() => setHoveredIdx(null)}
                />
              );
            })}
          </g>
        </svg>
        <AnimatePresence mode="wait">
          <motion.div
            className="absolute left-1/2 top-1/2 flex flex-col items-center -translate-x-1/2 -translate-y-1/2 select-none"
            key={hoveredIdx===null?"total":"val"}
            initial={{ opacity:.4, scale:.79}} animate={{ opacity:1, scale:1}} exit={{opacity:.5, scale:.8}}
            transition={{ duration:.25 }}
          >
            <span className="text-zinc-400 font-semibold text-[11px] mb-[-4px] tracking-wide uppercase">{centerLabel}</span>
            <span style={{ color: hoveredIdx!==null ? emotionColors[data[hoveredIdx]?.name] : "#232329" }} className="text-xl font-extrabold font-[Outfit,sans] mt-1">
              {hoveredIdx!==null ? Math.round(centerValue*100)+"%" : total.toFixed(2)}
            </span>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex flex-wrap gap-x-2 gap-y-1 w-full justify-center">
        {data.map(({ name, value }, idx) => (
          <span key={name}
            className="badge-emotion"
            style={{borderColor: emotionColors[name], background: hoveredIdx===idx ? emotionColors[name]+"22" : undefined, color: hoveredIdx===idx ? emotionColors[name]:undefined}}
            onMouseEnter={() => setHoveredIdx(idx)}
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <span style={{ color: emotionColors[name], fontWeight: hoveredIdx===idx? 700:500 }}>
              {Math.round(value * 100)}%
            </span>
            <span className="capitalize ml-0.5">{name}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
