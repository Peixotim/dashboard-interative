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

// --- Funções de Requisição ---

/**
 * Inicia uma nova sessão de análise com o backend.
 * @returns Uma promessa que resolve com os dados da sessão.
 */
export const startSession = async (): Promise<SessionResponse> => {
  const response = await fetch(`${API_URL}/start-session`, {
    method: "POST",
  });

  if (!response.ok) {
    // Se a resposta não for 2xx, lança um erro
    throw new Error("Falha ao iniciar a sessão com a API.");
  }

  return response.json();
};

/**
 * Envia um frame para análise de emoção.
 * @param payload Os dados contendo o UUID da sessão e a imagem em base64.
 * @returns Uma promessa que resolve com os resultados da análise.
 */
export const analyzeEmotion = async (payload: EmotionAnalysisPayload): Promise<EmotionAnalysis> => {
  const response = await fetch(`${API_URL}/analyze-emotion`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    // Tenta ler a mensagem de erro da API
    const errorBody = await response.text();
    console.error("Erro da API de análise:", errorBody);
    throw new Error(`Falha ao analisar a emoção: ${errorBody}`);
  }

  return response.json();
};