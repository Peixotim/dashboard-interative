export type EmotionData = {
  timestamp: string;
  dominant: string;
  intensity: number;
  scores: Record<string, number>;
};


const emotions = [
  "Alegria", "Tristeza", "Raiva", "Surpresa", "Medo", "Nojo", "Neutro",
];

function randomScoreWeights() {
  const raw = emotions.map(() => Math.random());
  const total = raw.reduce((acc, v) => acc + v, 0);
  return raw.map((v) => +(v / total).toFixed(2));
}

export function generateMockEmotionData(): EmotionData {
  const idx = Math.floor(Math.random() * emotions.length);
  const [dominant, weights] = [emotions[idx], randomScoreWeights()];
  const intensity = +(weights[idx]).toFixed(2);
  const scores: Record<string, number> = {};
  emotions.forEach((e, i) => {
    scores[e.toLowerCase()] = weights[i];
  });

  return {
    timestamp: new Date().toISOString(),
    dominant,
    intensity,
    scores,
  };
}
