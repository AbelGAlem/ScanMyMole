import os
import torch
import numpy as np
from transformers import AutoImageProcessor, AutoConfig
from sklearn.preprocessing import OneHotEncoder
from huggingface_hub import hf_hub_download, list_repo_files

from fastapi import Request

from .state import app_state
from .models import SkinCancerConfig, SkinCancerViT
from .utils import load_json


def load_model():
    """Load and initialize the model and related components from Hugging Face."""
    print(f"Loading model from Hugging Face: {app_state.HF_REPO_ID}")
    
    try:
        # Download and load label maps from HF
        print("Loading label maps...")
        label2id_path = hf_hub_download(repo_id=app_state.HF_REPO_ID, filename="label2id.json")
        id2label_path = hf_hub_download(repo_id=app_state.HF_REPO_ID, filename="id2label.json")
        
        app_state.label2id = load_json(label2id_path)
        id2label_raw = load_json(id2label_path)
        app_state.id2label.update({int(k): v for k, v in id2label_raw.items()})
        print(f"Loaded {len(app_state.id2label)} classes")

        # Download and load encoder categories
        print("Loading encoder categories...")
        cats_path = hf_hub_download(repo_id=app_state.HF_REPO_ID, filename="loc_encoder_categories.npy")
        cats = np.load(cats_path, allow_pickle=True)
        app_state.loc_encoder = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
        app_state.loc_encoder.fit(np.array(cats).reshape(-1, 1))
        app_state.valid_localizations[:] = list(cats.tolist())
        print(f"Loaded {len(app_state.valid_localizations)} localizations")

        # Tabular dim = one-hot length + 1 (age)
        app_state.tab_dim = app_state.loc_encoder.transform(np.array(["unknown"]).reshape(-1, 1)).shape[1] + 1
        print(f"Tabular dimension: {app_state.tab_dim}")

        # Download and load age stats
        age_stats_path = hf_hub_download(repo_id=app_state.HF_REPO_ID, filename="age_stats.json")
        app_state.age_stats.update(load_json(age_stats_path))
        print(f"Age stats: {app_state.age_stats}")

        # Download and read the HF config to get the vision backbone name
        print("Loading model config...")
        config_path = hf_hub_download(repo_id=app_state.HF_REPO_ID, filename="best_model/config.json")
        cfg_json = load_json(config_path)
        app_state.vision_ckpt = cfg_json.get("vision_model_checkpoint", app_state.vision_ckpt)
        print(f"Vision checkpoint: {app_state.vision_ckpt}")
        
        app_state.image_processor = AutoImageProcessor.from_pretrained(app_state.vision_ckpt)
        print("Image processor loaded")

        # Build model config
        print("Building model config...")
        sc_cfg = SkinCancerConfig(
            vision_model_checkpoint=app_state.vision_ckpt,
            tabular_dim=app_state.tab_dim,
            num_labels=len(app_state.id2label),
            id2label=app_state.id2label,
            label2id=app_state.label2id,
            age_min=app_state.age_stats["age_min"],
            age_max=app_state.age_stats["age_max"],
            age_mean=app_state.age_stats["age_mean"]
        )
        
        # Initialize empty model with our config
        print("Initializing model...")
        model_init = SkinCancerViT(sc_cfg)
        
        # Load weights from HF
        print("Loading model weights from Hugging Face...")
        try:
            # Try to load from safetensors first
            model_path = hf_hub_download(repo_id=app_state.HF_REPO_ID, filename="best_model/model.safetensors")
            from safetensors.torch import load_file as safe_load
            print(f"Loading from safetensors: {model_path}")
            state = safe_load(model_path)
        except Exception as e:
            print(f"Safetensors not found, trying pytorch_model.bin: {e}")
            model_path = hf_hub_download(repo_id=app_state.HF_REPO_ID, filename="best_model/pytorch_model.bin")
            state = torch.load(model_path, map_location="cpu")

        # Remove training-only keys like loss_fct.weight
        to_drop = [k for k in list(state.keys()) if k.startswith("loss_fct.")]
        for k in to_drop:
            state.pop(k, None)

        # Load with strict=False to ignore harmless mismatches
        missing, unexpected = model_init.load_state_dict(state, strict=False)
        if unexpected:
            print("Ignored unexpected keys:", unexpected)
        if missing:
            print("Missing keys:", missing)

        print(f"Using device: {app_state.device}")
        model_init.to(app_state.device)
        model_init.eval()
        app_state.model = model_init
        print("Model loaded successfully from Hugging Face!")

        # Patch size / grid (if available from vision config)
        try:
            app_state.vit_patch_size = getattr(model_init.vision.config, "patch_size", app_state.vit_patch_size)
            # For square inputs (224×224) with non-overlapping patches
            size = app_state.image_processor.size
            if isinstance(size, dict):
                h = size.get("height", 224)
                w = size.get("width", 224)
            else:
                h = w = size
            app_state.vit_grid = (h // app_state.vit_patch_size, w // app_state.vit_patch_size)
            print(f"ViT grid: {app_state.vit_grid}")
        except Exception as e:
            print(f"Error setting ViT grid: {e}")
            app_state.vit_patch_size, app_state.vit_grid = app_state.DEFAULT_VIT_PATCH_SIZE, app_state.DEFAULT_VIT_GRID
            
    except Exception as e:
        print(f"Error loading model from Hugging Face: {e}")
        raise


async def get_client_ip(request: Request) -> str:
    # First hop of X-Forwarded-For is original client. Fall back to direct socket IP.
    xff = request.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return request.client.host