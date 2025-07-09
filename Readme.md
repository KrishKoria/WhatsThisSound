# WhatsThisSound - Audio Classification System

A comprehensive audio classification system that uses a Convolutional Neural Network (CNN) to classify sounds from the ESC-50 dataset. The project includes model training, inference API, and a web-based visualization frontend.

## Project Overview

This project implements an end-to-end audio classification pipeline that:

- Trains a ResNet-inspired CNN on the ESC-50 dataset (50 sound classes)
- Provides a Modal-hosted inference API for real-time predictions
- Features a Next.js frontend for audio upload and visualization
- Visualizes model feature maps and spectrograms for interpretability

## Architecture

### Backend Components

#### 1. Model Architecture (`model.py`)

- **AudioCNN**: ResNet-inspired architecture with residual blocks
- **ResidualBlock**: Custom implementation with feature map extraction
- Supports both inference and feature visualization modes
- 4 main layers with increasing channel depths (64→128→256→512)

#### 2. Training Pipeline (`train.py`)

- Uses ESC-50 dataset (Environmental Sound Classification)
- Implements data augmentation (MixUp, SpecAugment)
- Features label smoothing and OneCycleLR scheduling
- Trains on Modal cloud infrastructure with GPU support
- Includes TensorBoard logging for training monitoring

#### 3. Inference API (`main.py`)

- Modal-hosted FastAPI endpoint for real-time inference
- Processes WAV files uploaded as base64 strings
- Returns top-3 predictions with confidence scores
- Extracts and returns feature maps for visualization
- Automatically resamples audio to 44.1kHz for consistency

### Frontend Components (`frontend/`)

#### 1. Main Application (`src/app/page.tsx`)

- File upload interface for WAV files
- Real-time prediction display with confidence scores
- Feature map visualization grid
- Waveform and spectrogram display

#### 2. Visualization Components

- **FeatureMap** (`src/components/FeatureMap.tsx`): Renders feature maps as heatmaps
- **Waveform** (`src/components/Waveform.tsx`): Audio waveform visualization
- **ColorScale** (`src/components/ColorScale.tsx`): Color legend for feature maps
- **Progress** (`src/components/ui/progress.tsx`): Confidence score bars

## Technical Details

### Audio Processing Pipeline

1.  **Input**: WAV files (any sample rate, mono/stereo)
2.  **Preprocessing**:
    - Convert to mono if stereo
    - Resample to 44.1kHz
    - Generate Mel spectrogram (128 mel bins, 1024 FFT)
    - Convert to dB scale
3.  **Model Input**: (1, 128, time_frames) tensor
4.  **Output**: 50-class probability distribution

### Model Training Features

- **Data Augmentation**:
  - MixUp (β=0.2) for improved generalization
  - SpecAugment (frequency/time masking)
- **Regularization**:
  - Label smoothing (0.1)
  - Dropout (0.5)
  - L2 weight decay (0.01)
- **Optimization**:
  - AdamW optimizer
  - OneCycleLR scheduler
  - 100 epochs with early stopping

## Setup and Installation

### Prerequisites

- Python 3.8+
- Node.js 18+
- Modal account (for cloud deployment)
- pnpm (for frontend dependencies)

### Backend Setup

1.  **Install Python dependencies**:

    ```bash
    pip install -r requirements.txt
    ```

2.  **Configure Modal**:

    ```bash
    modal token new
    ```

3.  **Train the model**:

    ```bash
    modal run train.py
    ```

4.  **Deploy inference API**:
    ```bash
    modal deploy main.py
    ```

### Frontend Setup

1.  **Navigate to frontend directory**:

    ```bash
    cd frontend
    ```

2.  **Install dependencies**:

    ```bash
    pnpm install
    ```

3.  **Configure environment**:

    ```bash
    cp .env.example .env
    ```

    Update `NEXT_PUBLIC_INFERENCE_URL` with your Modal endpoint URL

4.  **Start development server**:
    ```bash
    pnpm dev
    ```

## Usage

### Training a New Model

```bash
modal run train.py
```

- Downloads ESC-50 dataset automatically
- Trains for 100 epochs with validation
- Saves best model to Modal volume
- Logs training metrics to TensorBoard

### Running Inference

```bash
modal run main.py
```

- Tests inference with a sample audio file
- Returns predictions and feature visualizations

### Using the Web Interface

1.  Start the frontend development server
2.  Navigate to `http:localhost:3000`
3.  Upload a WAV file using the file picker
4.  View predictions, feature maps, and spectrograms

## Dataset Information

### ESC-50 Dataset

- **Classes**: 50 sound categories
- **Samples**: 2000 audio clips (40 per class)
- **Duration**: 5 seconds per clip
- **Format**: 44.1kHz WAV files
- **Split**: Fold 5 used for validation, folds 1-4 for training

### Sound Categories Include:

- Animals (dog, cat, bird, etc.)
- Natural sounds (rain, wind, fire)
- Human sounds (crying, laughing, coughing)
- Interior/domestic sounds (door, vacuum, clock)
- Exterior/urban sounds (car, siren, engine)

## Model Performance

- **Architecture**: Custom ResNet-inspired CNN
- **Parameters**: ~11M trainable parameters
- **Expected Accuracy**: 85-90% on ESC-50 validation set
- **Inference Time**: <100ms per audio file
- **Input**: 5-second audio clips (or shorter)

## API Reference

### Inference Endpoint

**POST** `/inference`

**Request Body**:

```json
{
  "data": "base64_encoded_wav_file"
}
```

**Response**:

```json
{
  "predictions": [
    {"class": "dog", "confidence": 0.85},
    {"class": "cat", "confidence": 0.12},
    {"class": "bird", "confidence": 0.03}
  ],
  "visualization": {
    "layer1": {"shape": [64, 32, 87], "values": [[...]]},
    "layer2": {"shape": [128, 16, 44], "values": [[...]]}
  },
  "input_spectrogram": {
    "shape": [128, 173],
    "values": [[...]]
  },
  "waveform": {
    "values": [...],
    "sample_rate": 44100,
    "duration": 5.0
  }
}
```

## File Structure

```
WhatsThisSound/
├── train.py              # Model training script
├── main.py               # Inference API server
├── model.py              # CNN model architecture
├── requirements.txt      # Python dependencies
├── Readme.md            # This file
└── frontend/            # Next.js web application
    ├── src/
    │   ├── app/
    │   │   ├── layout.tsx    # App layout
    │   │   └── page.tsx      # Main application page
    │   ├── components/
    │   │   ├── FeatureMap.tsx   # Feature map visualization
    │   │   ├── Waveform.tsx     # Audio waveform display
    │   │   ├── ColorScale.tsx   # Color scale legend
    │   │   └── ui/              # UI components
    │   ├── lib/
    │   │   ├── utils.ts         # Utility functions
    │   │   └── colors.ts        # Color mapping functions
    │   └── styles/
    │       └── globals.css      # Global styles
    ├── package.json
    └── next.config.js
```

## Technologies Used

### Backend

- **PyTorch**: Deep learning framework
- **torchaudio**: Audio processing
- **Modal**: Cloud infrastructure and deployment
- **FastAPI**: REST API framework
- **librosa**: Audio analysis
- **soundfile**: Audio I/O

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Accessible UI components
- **T3 Stack**: Type-safe full-stack development
- 
