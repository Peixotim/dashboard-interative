"use client";
import { useEffect, useRef, useState } from "react";
import { generateMockEmotionData, EmotionData } from "@/services/emotionService";

export function useEmotionData() {
  const [data, setData] = useState<EmotionData[]>([]);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    function fetchAndUpdate() {
      const novo = generateMockEmotionData();
      setData((old) => [...old.slice(-29), novo]); // máximo 30
      setLastUpdate(new Date().toLocaleTimeString("pt-BR"));
    }
    // inicia com um ponto para evitar layout vazio
    fetchAndUpdate();
    intervalRef.current = setInterval(fetchAndUpdate, 30000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  function ingest(fromApi: { timestamp: number; dominant: string; intensity?: number; scores?: Record<string, number> }) {
    const mapped: EmotionData = {
      timestamp: new Date(fromApi.timestamp).toISOString(),
      dominant: capitalize(fromApi.dominant || "Neutro"),
      intensity: typeof fromApi.intensity === "number" ? fromApi.intensity : 0.0,
      scores: normalizeScores(fromApi.scores || {}),
    };
    setData((old) => [...old.slice(-29), mapped]);
    setLastUpdate(new Date().toLocaleTimeString("pt-BR"));
  }

  return {
    data,
    lastUpdate,
    loading: data.length === 0,
    ingest,
  };
}

function capitalize(s: string) {
  if (!s) return "";
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function normalizeScores(scores: Record<string, number>) {
  // Garante números entre 0..1
  const out: Record<string, number> = {};
  Object.entries(scores).forEach(([k, v]) => {
    out[k] = v > 1 ? v / 100 : v;
  });
  return out;
}
