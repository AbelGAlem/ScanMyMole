import io
import numpy as np
import torch
from PIL import Image
from fastapi import APIRouter, Depends, File, UploadFile, Form, HTTPException
from fastapi.responses import JSONResponse
from typing import Optional

from ..state import app_state
from ..utils import normalize_age

from fastapi_limiter.depends import RateLimiter

from app.config import RATE_TIMES, RATE_SECONDS

router = APIRouter()

@router.get("/health")
def health():
    return {
        "status": "ok", 
        "device": str(app_state.device), 
        "classes": app_state.id2label, 
        "model_loaded": app_state.is_model_loaded()
    }


@router.post("/predict", dependencies=[Depends(RateLimiter(times=RATE_TIMES, seconds=RATE_SECONDS))],)
async def predict(
    file: UploadFile = File(..., description="RGB lesion image"),
    age: Optional[float] = Form(None),
    localization: Optional[str] = Form("unknown"),
    top_k: Optional[int] = Form(3),
):
    if not app_state.is_model_loaded():
        raise HTTPException(status_code=503, detail="Model not loaded yet")

    # Read image
    try:
        img_bytes = await file.read()
        img = Image.open(io.BytesIO(img_bytes)).convert("RGB")
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

    # Preprocess image
    px = app_state.image_processor(img, return_tensors="pt")["pixel_values"].to(app_state.device)

    # Tabular vector
    loc = (localization or "unknown").strip().lower()
    loc_oh = app_state.loc_encoder.transform(np.array([loc]).reshape(-1, 1))  # (1, L)
    norm_age = normalize_age(age, app_state.age_stats["age_min"], app_state.age_stats["age_max"], app_state.age_stats["age_mean"])
    tab = np.concatenate([loc_oh, np.array([[norm_age]])], axis=1).astype("float32")
    tab_t = torch.tensor(tab, dtype=torch.float32, device=app_state.device)

    # Forward
    with torch.no_grad():
        logits = app_state.model(pixel_values=px, tabular_features=tab_t)
        probs = torch.softmax(logits, dim=-1).cpu().numpy()[0]

    # Top-k
    k = max(1, min(int(top_k or 3), len(probs)))
    idxs = np.argsort(-probs)[:k]
    top = [{"label": app_state.id2label[int(i)], "probability": float(probs[i])} for i in idxs]
    dist = {app_state.id2label[int(i)]: float(p) for i, p in enumerate(probs)}

    payload = {
        "top": top
        # "distribution": dist,
        # "accepted_localizations_example": app_state.valid_localizations[:10]
    }

    return JSONResponse(content=payload)
