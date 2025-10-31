"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Pause, Play, AlertTriangle, Loader2, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useTheme } from "next-themes";

interface WebcamCaptureProps {
  onCapture?: (imgBase64: string) => void;
  autoStart?: boolean;
  captureInterval?: number;
}

export function WebcamCapture({
  onCapture,
  autoStart = false,
  captureInterval = 2000,
}: WebcamCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [started, setStarted] = useState(autoStart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [frames, setFrames] = useState<string[]>([]);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  // Inicia a câmera
  async function startCamera() {
    setLoading(true);
    setError(null);

    // ✅ Checagem de suporte à API
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setLoading(false);
      setError("Seu navegador não suporta acesso à câmera ou não está usando HTTPS/localhost.");
      return;
    }

    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setStarted(true);
    } catch (err) {
      console.error(err);
      setError(
        "Não foi possível acessar a câmera. Verifique as permissões e se o site está em HTTPS ou localhost."
      );
    } finally {
      setLoading(false);
    }
  }

  // Para a câmera
  function stopCamera() {
    if (stream) stream.getTracks().forEach((t) => t.stop());
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStream(null);
    setStarted(false);
  }

  // Captura periódica de frames
  useEffect(() => {
    if (!started || !videoRef.current) return;

    intervalRef.current = setInterval(() => {
      const video = videoRef.current!;
      if (!video.videoWidth) return;

      const canvas = document.createElement("canvas");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const frame = canvas.toDataURL("image/jpeg", 0.8);

      setFrames((prev) => (prev.length >= 30 ? [...prev.slice(1), frame] : [...prev, frame]));

      onCapture?.(frame);
    }, captureInterval);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [started, captureInterval, onCapture]);

  return (
    <motion.div
      layout
      className={`w-full max-w-lg mx-auto flex flex-col gap-4 rounded-3xl p-4 shadow-2xl transition-all duration-300
        ${isDarkMode ? "bg-zinc-900/50 border-white/10 shadow-indigo-900/20" : "bg-white border-zinc-200 shadow-zinc-400/20"}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Vídeo */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden group">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className={`w-full h-full object-cover transition-opacity duration-500 ${
            stream ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Overlays */}
        <AnimatePresence>
          {(!started || loading || error) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`absolute inset-0 flex flex-col items-center justify-center p-4 text-center rounded-2xl
                ${isDarkMode ? "bg-zinc-950/50" : "bg-white/40 backdrop-blur-sm"}`}
            >
              {loading && (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                  <span className={`mt-3 text-sm font-medium ${isDarkMode ? "text-zinc-300" : "text-zinc-800"}`}>
                    Conectando à câmera...
                  </span>
                </>
              )}
              {error && (
                <div className="flex flex-col items-center gap-3">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                  <p className="font-semibold text-red-500 text-sm">{error}</p>
                  <Button variant="outline" size="sm" onClick={startCamera}>
                    Tentar novamente
                  </Button>
                </div>
              )}
              {!started && !loading && !error && (
                <div className="flex flex-col items-center gap-3">
                  <Camera className={`h-12 w-12 ${isDarkMode ? "text-zinc-400" : "text-zinc-600"}`} />
                  <p className={`text-sm font-medium ${isDarkMode ? "text-zinc-300" : "text-zinc-700"}`}>
                    Sua câmera está pronta para a análise emocional.
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Barra de status */}
        {started && !error && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: isHovered ? 0 : 20, opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute bottom-0 left-0 right-0 p-3 flex justify-between items-center bg-gradient-to-t from-black/60 to-transparent rounded-b-2xl"
          >
            <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-medium text-white ring-1 ring-white/10">
              <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <CircleDot className="h-3 w-3 text-emerald-400" />
              </motion.div>
              Analisando
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 rounded-full bg-black/50 backdrop-blur-md hover:bg-white/20 text-white ring-1 ring-white/10"
              onClick={stopCamera}
            >
              <Pause className="h-6 w-6" />
            </Button>
          </motion.div>
        )}
      </div>

      {/* Controle inferior */}
      <div className="w-full min-h-[60px] flex items-center justify-center px-2">
        <AnimatePresence mode="wait">
          {!started && !error && (
            <motion.div key="start-button" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full">
              <motion.div animate={{ scale: [1, 1.02, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}>
                <Button
                  className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold h-12 rounded-xl shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 flex items-center gap-2 text-base"
                  onClick={startCamera}
                  disabled={loading}
                >
                  <Play className="h-5 w-5" />
                  Iniciar Análise
                </Button>
              </motion.div>
            </motion.div>
          )}

          {started && !error && (
            <motion.div key="frames-strip" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="w-full">
              <div className={`flex flex-wrap gap-2 items-center p-2 justify-center rounded-xl border ${isDarkMode ? "border-white/10 bg-zinc-950/50 shadow-inner" : "border-zinc-200 bg-white/40 shadow-inner"}`}>
                {frames.slice(-7).map((f, i) => (
                  <Image
                    key={i}
                    src={f}
                    alt={`Captura ${i}`}
                    unoptimized
                    width={32}
                    height={32}
                    className="w-8 h-8 rounded-md object-cover border-2 border-zinc-700/50"
                  />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
