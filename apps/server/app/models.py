import torch
import torch.nn as nn
from transformers import PreTrainedModel, PretrainedConfig, AutoModel


class SkinCancerConfig(PretrainedConfig):
    model_type = "vit_tabular_skin_cancer"
    
    def __init__(self,
                 vision_model_checkpoint="google/vit-base-patch16-224-in21k",
                 tabular_dim=0,
                 num_labels=7,
                 id2label=None, 
                 label2id=None,
                 age_min=0.0, 
                 age_max=100.0, 
                 age_mean=50.0,
                 **kwargs):
        super().__init__(**kwargs)
        self.vision_model_checkpoint = vision_model_checkpoint
        self.tabular_dim = tabular_dim
        self.num_labels = num_labels
        self.id2label = id2label
        self.label2id = label2id
        self.age_min = age_min
        self.age_max = age_max
        self.age_mean = age_mean


class SkinCancerViT(PreTrainedModel):
    config_class = SkinCancerConfig
    
    def __init__(self, config):
        super().__init__(config)
        self.vision = AutoModel.from_pretrained(config.vision_model_checkpoint)
        hdim = self.vision.config.hidden_size

        self.tabular = nn.Sequential(
            nn.Linear(config.tabular_dim, 128),
            nn.ReLU(),
            nn.Dropout(0.1),
            nn.Linear(128, 64),
            nn.ReLU()
        )
        self.classifier = nn.Linear(hdim + 64, config.num_labels)
        self.post_init()

    def forward(self, pixel_values, tabular_features):
        vout = self.vision(pixel_values=pixel_values, output_hidden_states=False, return_dict=True)
        if getattr(vout, "pooler_output", None) is not None:
            vfeat = vout.pooler_output
        else:
            vfeat = vout.last_hidden_state[:, 0, :]  # CLS
        tfeat = self.tabular(tabular_features.float())
        feats = torch.cat([vfeat, tfeat], dim=-1)
        logits = self.classifier(feats)
        return logits
