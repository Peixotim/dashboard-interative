"use client";
import { useState } from "react";
// Assumindo que seus componentes estão em 'app/components/'
import { Header } from "@/components/Header";
import { EmotionCard } from "@/components/EmotionCard";
import { TimelineChart } from "@/components/TimelineChart";
import { PieChart } from "@/components/PieChart";
import { Heatmap } from "@/components/Heatmap";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { ConsentGate } from "@/components/ConsentGate";
import { WebcamCapture } from "@/components/WebcamCapture";

// Tipos para os dados da API (recebidos do WebcamCapture)
interface EmotionAnalysis {
  dominant_emotion: string;
  emotions: { [key: string]: number };
}

// Tipos para o formato de dados dos seus gráficos
interface EmotionSnapshot {
  dominant: string;
  intensity: number;
  scores: { [key: string]: number };
  timestamp: number;
}

type ConsentPrefs = {
  camera: boolean;
  mic: boolean;
  bio: boolean;
  storage: boolean;
};

export default function Home() {
  const [consentPrefs, setConsentPrefs] = useState<ConsentPrefs | null>(null);
  const consented = !!consentPrefs;

  // Estado local para o histórico de emoções
  const [emotionHistory, setEmotionHistory] = useState<EmotionSnapshot[]>([]);
  const [lastUpdate, setLastUpdate] = useState<number | null>(null);
  // O estado de loading agora começa como 'true'
  const [loading, setLoading] = useState(true);

  // Função que o <WebcamCapture /> chamará com novos dados
  const handleAnalysisUpdate = (data: EmotionAnalysis) => {
    if (data.dominant_emotion === "Nenhum rosto detectado") return;
    
    const newSnapshot: EmotionSnapshot = {
      dominant: data.dominant_emotion,
      intensity: data.emotions[data.dominant_emotion.toLowerCase()] || 0,
      scores: data.emotions,
      timestamp: Date.now(),
    };

    setEmotionHistory((prev) => [...prev, newSnapshot]);
    setLastUpdate(Date.now());
    // Esta é a linha chave: desativa o loading assim que o primeiro dado chega
    if (loading) setLoading(false);
  };

  // Cálculos para os gráficos
  const atual = emotionHistory.at(-1);
  const scoreSums: Record<string, number> = {};
  if (emotionHistory.length > 0) {
    emotionHistory.forEach((d) => {
      Object.entries(d.scores).forEach(([emo, val]) => {
        scoreSums[emo] = (scoreSums[emo] || 0) + val / emotionHistory.length;
      });
    });
  }

  return (
    <main className="w-full min-h-screen flex flex-col bg-transparent p-2 md:p-6 xl:p-10 gap-8 font-main relative">
      {!consented && <ConsentGate onAccept={prefs => setConsentPrefs(prefs)} />}
      {consented && <>
        <Header lastUpdate={lastUpdate} />
        
        {/* *** INÍCIO DA CORREÇÃO ***
          O grid principal agora é renderizado imediatamente.
          O <WebcamCapture> não está mais bloqueado pelo loader.
        */}
        <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-0">
            
          {/* Coluna 1: Câmera (Sempre visível) e Heatmap (Condicional) */}
          <div className="lg:col-span-1 flex flex-col gap-8">
            {consentPrefs?.camera && (
              // A Câmera agora está FORA do loader, e pode ser clicada
              <WebcamCapture onAnalysisUpdate={handleAnalysisUpdate} />
            )}

            {/* O Heatmap é substituído por um loader simples se os dados não existirem */}
            {loading || !atual ? (
              <div className="flex items-center justify-center p-4 border rounded-lg bg-white dark:bg-zinc-900 h-full min-h-[200px]">
                <span className="text-zinc-400 text-sm">Aguardando dados...</span>
              </div>
            ) : (
              <Heatmap data={emotionHistory} />
            )}
          </div>

          {/* Coluna 2: Outros Gráficos (com o loader principal) */}
          <div className="lg:col-span-2 flex flex-col gap-8">
            {/* O loader agora fica AQUI, envolvendo apenas os gráficos */}
            {loading || !atual ? (
              <div className="flex flex-1 h-[55vh] items-center justify-center">
                <motion.div initial={{ opacity: 0, scale: 0.93 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .55 }} className="flex flex-col items-center gap-3">
                  <Loader2 className="animate-spin w-11 h-11 text-zinc-500" />
                  <span className="font-medium text-zinc-400 tracking-wide text-lg">Aguardando câmera...</span>
                </motion.div>
              </div>
            ) : (
              // Quando os dados chegam, mostramos os gráficos
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="min-w-0">
                    <EmotionCard emotion={atual.dominant} intensity={atual.intensity} />
                  </div>
                  <div className="min-w-0">
                     <PieChart scoreSums={scoreSums} />
                  </div>
                </div>
             
                <div className="min-w-0 h-[400px]">
                  <TimelineChart data={emotionHistory} />
                </div>
              </>
            )}
          </div>
        </div>
        {/* *** FIM DA CORREÇÃO *** */}
      </>}
    </main>
  );
}