"use client";
import { useState } from "react";
import { CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import type { EmotionData } from "./types/emotion";

const ranges = [
  { value: "30", label: "Últimos 1:30" },
  { value: "12", label: "Últimos 1:00" },
  { value: "6", label: "Últimos 0:30" },
];

function SegmentedControl({ options, value, onChange }: { options: typeof ranges; value: string; onChange: (val: string) => void }) {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  return (
    <div className={`flex items-center gap-1 p-1 rounded-lg border ${isDarkMode ? "bg-zinc-800/50 border-zinc-700" : "bg-white/50 border-zinc-200"}`}>
      {options.map(opt => (
        <button
          key={opt.value}
          onClick={() => onChange(opt.value)}
          className={`relative px-3 py-1 text-xs font-medium transition-colors duration-300 ${
            value === opt.value
              ? isDarkMode
                ? "text-white"
                : "text-zinc-900"
              : isDarkMode
              ? "text-zinc-400 hover:text-white"
              : "text-zinc-500 hover:text-zinc-900"
          }`}
        >
          {value === opt.value && (
            <motion.div
              layoutId="segmented-control-active-bg"
              className={`absolute inset-0 rounded-md shadow-md ${isDarkMode ? "bg-indigo-600" : "bg-indigo-400/50"}`}
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
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const chartData = data.slice(-parseInt(range));

  const strokeColor = isDarkMode ? "#818CF8" : "#4F46E5";
  const gradientStart = isDarkMode ? "#818CF8" : "#A5B4FC"; // azul suave no light-mode
  const gradientStop = isDarkMode ? "#818CF8" : "#C7D2FE";

  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.55, type: "spring", bounce: 0.33 }}
      className={`w-full h-full flex flex-col gap-4 rounded-3xl p-6
                  ${isDarkMode ? "bg-zinc-900/50 shadow-2xl shadow-indigo-900/20" : "bg-white shadow-md border border-zinc-200 shadow-zinc-400/20"}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-col">
          <h3 className={`text-lg font-bold ${isDarkMode ? "text-zinc-100" : "text-zinc-900"}`}>Variação de Intensidade</h3>
          <p className={`text-sm ${isDarkMode ? "text-zinc-400" : "text-zinc-500"}`}>Em tempo real</p>
        </div>
        <SegmentedControl options={ranges} value={range} onChange={setRange} />
      </div>

      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
            <defs>
              <linearGradient id="areaIntensidade" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={gradientStart} stopOpacity={0.4} />
                <stop offset="95%" stopColor={gradientStop} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="1 5" stroke={isDarkMode ? "#ffffff1a" : "#00000010"} vertical={false} />
            <XAxis
              dataKey="timestamp"
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tickFormatter={(t) => new Date(t).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
              style={{ fontSize: 12, fill: isDarkMode ? "#a1a1aa" : "#52525B" }}
            />
            <YAxis
              domain={[0, 1]}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v * 100}%`}
              style={{ fontSize: 12, fill: isDarkMode ? "#a1a1aa" : "#52525B" }}
            />
            <Tooltip
              cursor={{ stroke: strokeColor, strokeWidth: 1, strokeDasharray: "3 3" }}
              content={({ payload, label }) => {
                if (!payload?.length) return null;
                const y = payload[0].value as number;
                return (
                  <div className={`rounded-xl px-3 py-2 border shadow-lg text-xs backdrop-blur-md ${isDarkMode ? "bg-zinc-800/80 border-zinc-700" : "bg-white/80 border-zinc-200"}`}>
                    <div className={`${isDarkMode ? "text-zinc-300" : "text-zinc-700"} pb-0.5`}>
                      {new Date(label as string).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </div>
                    <div className={`font-bold ${isDarkMode ? "text-indigo-400" : "text-indigo-600"}`}>{Math.round(y*100)}% de intensidade</div>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="intensity"
              stroke={strokeColor}
              strokeWidth={3}
              fill="url(#areaIntensidade)"
              dot={false}
              isAnimationActive
              animationDuration={500}
              activeDot={{
                r: 6,
                stroke: isDarkMode ? "#18181b" : "#ffffff",
                strokeWidth: 2,
                fill: isDarkMode ? "#c7d2fe" : "#818CF8",
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
}


