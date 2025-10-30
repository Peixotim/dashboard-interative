"use client";
import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Camera, Pause, Play, AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  const [frames, setFrames] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Iniciar câmera
  async function startCamera() {
    setLoading(true);
    setError(null);
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(s);
      if (videoRef.current) videoRef.current.srcObject = s;
      setStarted(true);
    } catch (err) {
      console.error(err);
      setError("Não foi possível acessar a câmera. Permissão negada ou indisponível.");
    } finally {
      setLoading(false);
    }
  }

  // Parar câmera
  function stopCamera() {
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
      setStream(null);
    }
    if (intervalRef.current) clearInterval(intervalRef.current);
    setStarted(false);
  }

  // Captura periódica
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
      className="w-full flex flex-col items-center gap-6 rounded-2xl p-6 bg-gradient-to-b from-zinc-900/70 to-zinc-950/50 border border-zinc-800 shadow-[0_0_25px_rgba(99,102,241,0.15)] backdrop-blur-xl"
    >
      <div className="relative flex justify-center">
        <motion.div
          animate={
            started
              ? { boxShadow: ["0 0 0 0 rgba(99,102,241,0.6)", "0 0 0 10px rgba(99,102,241,0)"] }
              : {}
          }
          transition={started ? { duration: 1.5, repeat: Infinity, ease: "easeInOut" } : {}}
          className="rounded-2xl p-[3px] bg-gradient-to-r from-indigo-500/60 to-purple-600/60"
        >
          <div className="relative w-[240px] h-[180px] sm:w-[300px] sm:h-[220px] rounded-2xl overflow-hidden bg-black/70">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover rounded-2xl"
            />
            <AnimatePresence>
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 gap-2 text-zinc-300"
                >
                  <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                  <span className="text-xs">Ativando câmera...</span>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-red-300 gap-2 text-sm font-semibold text-center p-3"
                >
                  <AlertTriangle className="h-5 w-5" />
                  {error}
                </motion.div>
              )}

              {!started && !loading && !error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 text-white/80 gap-2"
                >
                  <Camera className="h-9 w-9 text-indigo-300" />
                  <span className="text-xs font-medium">Webcam pronta para uso</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <div className="flex items-center gap-4">
        {!started ? (
          <Button
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-indigo-500/30 hover:scale-[1.03] transition-all"
            onClick={startCamera}
            disabled={loading}
          >
            <Play className="mr-2 h-4 w-4" /> Iniciar Análise
          </Button>
        ) : (
          <Button
            variant="destructive"
            onClick={stopCamera}
            className="px-6 py-2 rounded-xl shadow-md hover:scale-[1.03] transition-all"
          >
            <Pause className="mr-2 h-4 w-4" /> Pausar
          </Button>
        )}
        <motion.span
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="text-xs text-zinc-400"
        >
          {started ? "Analisando... (captura a cada 2s)" : "Inativa"}
        </motion.span>
      </div>

      <AnimatePresence>
        {started && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-wrap gap-1 items-center bg-zinc-900/40 rounded-xl p-3 justify-center border border-zinc-800 max-w-[90vw]"
          >
            {frames.slice(-6).map((f, i) => (
              <img
                key={i}
                src={f}
                alt="captura"
                className="w-8 h-8 rounded-md object-cover border border-zinc-700"
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
