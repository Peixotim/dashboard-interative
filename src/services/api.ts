export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

export type StartSessionOut = { session_uuid: string };

export async function startSession(payload: { device_info?: any; consent?: any }): Promise<StartSessionOut> {
  const res = await fetch(`${API_URL}/session/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload || {}),
  });
  if (!res.ok) throw new Error(`startSession failed: ${res.status}`);
  return res.json();
}

export type AnalyzeFrameOut = {
  status: string;
  received_at: number;
  dominant?: string;
  intensity?: number;
  scores?: Record<string, number>;
};

export async function analyzeFrame(payload: {
  session_uuid: string;
  timestamp: number;
  frame_base64: string;
}): Promise<AnalyzeFrameOut> {
  const res = await fetch(`${API_URL}/analyze/frame`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(`analyzeFrame failed: ${res.status}`);
  return res.json();
}
