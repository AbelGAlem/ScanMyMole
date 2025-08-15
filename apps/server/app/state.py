import os
from typing import Dict, List, Optional
import torch
from transformers import AutoImageProcessor
from sklearn.preprocessing import OneHotEncoder

from .models import SkinCancerViT


class AppState:
    """Centralized state management for the application."""
    
    def __init__(self):
        # Hugging Face configuration
        # Hi there human. What you looking at.
        self.HF_REPO_ID = os.environ.get("HF_REPO_ID", "HelloWorld47474747/skin_vit_tabular")
        
        # Default settings
        self.DEFAULT_AGE_STATS = {"age_min": 0.0, "age_max": 100.0, "age_mean": 50.0}
        self.DEFAULT_VIT_PATCH_SIZE = 16
        self.DEFAULT_VIT_GRID = (14, 14)
        self.DEFAULT_VISION_CKPT = "google/vit-base-patch16-224-in21k"
        
        # Model state
        self.image_processor: Optional[AutoImageProcessor] = None
        self.model: Optional[SkinCancerViT] = None
        self.label2id: Dict[str, int] = {}
        self.id2label: Dict[int, str] = {}
        self.loc_encoder: Optional[OneHotEncoder] = None
        self.age_stats = self.DEFAULT_AGE_STATS.copy()
        self.tab_dim = 0
        self.valid_localizations: List[str] = []
        self.vit_patch_size = self.DEFAULT_VIT_PATCH_SIZE
        self.vit_grid = self.DEFAULT_VIT_GRID
        self.vision_ckpt = self.DEFAULT_VISION_CKPT
        
        # Device
        self.device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    
    def is_model_loaded(self) -> bool:
        """Check if the model is loaded."""
        return self.model is not None and self.image_processor is not None
    
    def get_device(self) -> torch.device:
        """Get the current device."""
        return self.device


# Global state instance
app_state = AppState()
