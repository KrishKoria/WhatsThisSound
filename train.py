import modal
import torchaudio
from torch.utils.data import Dataset
from pathlib import Path
import pandas as pd
import torch
import torch.nn as nn
import torchaudio.transforms as T
app = modal.App(name="WhatsThisSound")
image = (modal.Image.debian_slim().pip_install_from_requirements("requirements.txt").apt_install(["wget", "unzip", "ffmpeg", "libsndfile1"]).run_commands(["cd /tmp && wget https://github.com/karolpiczak/ESC-50/archive/master.zip -O esc50.zip", "cd /tmp && unzip esc50.zip","mkdir -p /opt/esc50-data", "cp -r /tmp/ESC-50-master/* /opt/esc50-data/", "rm -rf /tmp/ESC-50-master /tmp/esc50.zip"]).add_local_python_source("model"))

volume = modal.Volume.from_name("esc-50-data", create_if_missing=True)
model_volume = modal.Volume.from_name("esc-model", create_if_missing=True)

class ESC50Dataset(Dataset):
    def __init__(self, data, metadata, split="train", transform=None):
        super().__init__()
        self.data_dir = Path(data)
        self.metadata = pd.read_csv(metadata)
        self.split = split
        self.transform = transform

        if split == "train":
            self.metadata = self.metadata[self.metadata["fold"] != 5]
        else:
            self.metadata = self.metadata[self.metadata["fold"] == 5]
        self.classes = sorted(self.metadata["category"].unique())
        self.class_to_idx = {cls: idx for idx, cls in enumerate(self.classes)}
        self.metadata["label"] = self.metadata["category"].map(self.class_to_idx)

    def __len__(self):
        return len(self.metadata)

    def __getitem__(self, idx):
        row = self.metadata.iloc[idx]
        audio_path = self.data_dir / "audio" / row["filename"]
        waveform, sample_rate = torchaudio.load(audio_path)
        if waveform.shape[0] > 1:
            waveform = torch.mean(waveform, dim=0, keepdim=True)
        if self.transform:
            spectrogram = self.transform(waveform)
        else:
            spectrogram = waveform
        return spectrogram, row["label"]

@app.function(image=image, volumes={"/data": volume, "/models": model_volume}, gpu="A10G", timeout=3600 * 3)
def train():
    esc50_dir = Path("/opt/esc50-data")
    train_transform = nn.Sequential(
        T.MelSpectrogram(
            sample_rate=22050,
            n_fft=1024,
            hop_length=512,
            n_mels=128,
            f_min=0,
            f_max=11025
        ),
        T.AmplitudeToDB(),
        T.FrequencyMasking(freq_mask_param=30),
        T.TimeMasking(time_mask_param=80)
    )
    val_transform = nn.Sequential(
        T.MelSpectrogram(
            sample_rate=22050,
            n_fft=1024,
            hop_length=512,
            n_mels=128,
            f_min=0,
            f_max=11025
        ),
        T.AmplitudeToDB()
    )

    train_dataset = ESC50Dataset(
        data=esc50_dir, metadata=esc50_dir / "meta" / "esc50.csv", split="train", transform=train_transform)

    val_dataset = ESC50Dataset(
        data=esc50_dir, metadata=esc50_dir / "meta" / "esc50.csv", split="test", transform=val_transform)

    print(f"Training samples: {len(train_dataset)}")
    print(f"Val samples: {len(val_dataset)}")


@app.local_entrypoint()
def main():
    train.remote()
