"""
Image and Video Frame Preprocessing Module using Kornia and Torchvision
"""
import torch
import torchvision.transforms as T
import kornia as K
from PIL import Image
import numpy as np
from typing import Tuple, Union


class ProducePreprocessor:
    def __init__(self, target_size: Tuple[int, int] = (640, 640), device: str = "cpu"):
        self.target_size = target_size
        self.device = torch.device(device if torch.cuda.is_available() and device == "cuda" else "cpu")

        # Deterministic inference transformation (no random augmentations during inference)
        self.torchvision_transform = T.Compose([
            T.Resize(self.target_size, interpolation=T.InterpolationMode.BILINEAR),
            T.ToTensor(),
            T.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
        ])

    def preprocess_image(self, image: Union[Image.Image, np.ndarray]) -> torch.Tensor:
        """
        Preprocesses a single PIL or NumPy image into a normalized PyTorch tensor.
        Uses Kornia tensor manipulation for GPU-accelerated pipeline consistency.
        """
        if isinstance(image, np.ndarray):
            image = Image.fromarray(image)

        # Ensure RGB format
        if image.mode != "RGB":
            image = image.convert("RGB")

        tensor = self.torchvision_transform(image).unsqueeze(0).to(self.device)
        return tensor

    def apply_kornia_normalization(self, tensor_bchw: torch.Tensor) -> torch.Tensor:
        """
        Applies Kornia color space normalization and affine alignment.
        """
        # Ensure values are within [0, 1] range before standard ImageNet normalization
        mean = torch.tensor([0.485, 0.456, 0.406], device=tensor_bchw.device).view(1, 3, 1, 1)
        std = torch.tensor([0.229, 0.224, 0.225], device=tensor_bchw.device).view(1, 3, 1, 1)
        return K.enhance.normalize(tensor_bchw, mean, std)
