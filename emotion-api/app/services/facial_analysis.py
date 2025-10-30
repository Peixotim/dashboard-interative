import base64
import time
from typing import Dict

import numpy as np

try:
    import cv2  # type: ignore
except Exception:  # pragma: no cover
    cv2 = None

# DeepFace é opcional no MVP. Se não instalado, a função retorna mock.
try:  # pragma: no cover
    from deepface import DeepFace  # type: ignore
    _HAS_DEEPFACE = True
except Exception:  # pragma: no cover
    _HAS_DEEPFACE = False


def _decode_base64_image(frame_base64: str):
    if "," in frame_base64:
        data = frame_base64.split(",", 1)[1]
    else:
        data = frame_base64
    img_bytes = base64.b64decode(data)
    arr = np.frombuffer(img_bytes, np.uint8)
    if cv2 is None:
        return None
    img = cv2.imdecode(arr, cv2.IMREAD_COLOR)
    return img


def analyze_face(frame_base64: str) -> Dict:
    """Analisa emoção facial.
    - Se DeepFace estiver disponível, usa-o.
    - Caso contrário, retorna um mock estável (para testes locais).
    """
    ts = int(time.time() * 1000)
    if _HAS_DEEPFACE and cv2 is not None:
        try:
            img = _decode_base64_image(frame_base64)
            if img is None:
                raise RuntimeError("OpenCV indisponível para decodificar frame.")
            out = DeepFace.analyze(img, actions=["emotion"], enforce_detection=False)
            # DeepFace pode retornar list ou dict conforme versão
            if isinstance(out, list) and out:
                out = out[0]
            emotion_scores = out.get("emotion", {})
            dominant = out.get("dominant_emotion") or max(emotion_scores, key=emotion_scores.get, default="neutral")
            intensity = float(emotion_scores.get(dominant, 0)) / 100.0 if emotion_scores else 0.0
            return {
                "timestamp": ts,
                "dominant": dominant,
                "intensity": intensity,
                "scores": emotion_scores,
            }
        except Exception:
            # fallback mock, não interrompe fluxo
            pass

    # MOCK determinístico e suave para desenvolvimento
    return {
        "timestamp": ts,
        "dominant": "neutral",
        "intensity": 0.12,
        "scores": {
            "joy": 0.08,
            "sadness": 0.05,
            "anger": 0.03,
            "fear": 0.04,
            "surprise": 0.06,
            "disgust": 0.02,
            "neutral": 0.72,
        },
    }


