const API_URL = "http://localhost:8000";

export interface SessionResponse {
  session_uuid: string;
}

export interface EmotionAnalysisPayload {
  session_uuid: string;
  image_base64: string;
}


export interface EmotionAnalysis {
  dominant_emotion: string;
  emotions: {
    angry: number;
    disgust: number;
    fear: number;
    happy: number;
    sad: number;
    surprise: number;
    neutral: number;
  };
}


export const startSession = async (): Promise<SessionResponse> => {
  const response = await fetch(`${API_URL}/start-session`, {
    method: "POST",
  });

  if (!response.ok) {
   
    throw new Error("Falha ao iniciar a sessão com a API.");
  }

  return response.json();
};


export const analyzeEmotion = async (payload: EmotionAnalysisPayload): Promise<EmotionAnalysis> => {
  const response = await fetch(`${API_URL}/analyze-emotion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("Erro da API de análise:", errorBody);
    throw new Error(`Falha ao analisar a emoção: ${errorBody}`);
  }

  return response.json();
};