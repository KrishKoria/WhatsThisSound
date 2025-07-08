 # WhatsThisSound Frontend - Audio Classification Visualization Interface

 A modern Next.js web application that provides an interactive interface for uploading audio files and visualizing CNN model predictions and feature maps in real-time.

 ## Overview

 This frontend application serves as the user interface for the WhatsThisSound audio classification system. It allows users to upload WAV files, view real-time predictions, and explore the internal workings of the CNN model through interactive visualizations.

 ## Features

 ### Core Functionality
 - **Audio Upload**: Drag-and-drop or click-to-upload interface for WAV files
 - **Real-time Predictions**: Display top-3 sound classifications with confidence scores
 - **Feature Map Visualization**: Interactive heatmaps showing CNN layer activations
 - **Spectrogram Display**: Visual representation of input audio frequency content
 - **Waveform Visualization**: Time-domain representation of uploaded audio

 ### User Experience
 - **Responsive Design**: Works seamlessly across desktop and mobile devices
 - **Loading States**: Clear feedback during audio processing
 - **Error Handling**: User-friendly error messages for upload failures
 - **Progress Indicators**: Visual progress bars for prediction confidence
 - **Emoji Icons**: Intuitive sound category representation

 ## Tech Stack

 ### Core Framework
 - **Next.js 14**: React framework with App Router
 - **TypeScript**: Type-safe JavaScript development
 - **React 18**: Modern React with hooks and concurrent features

 ### Styling & UI
 - **Tailwind CSS**: Utility-first CSS framework
 - **Radix UI**: Accessible, unstyled UI components
 - **Custom CSS Variables**: Consistent theming system
 - **Class Variance Authority**: Type-safe component variants

 ### Development Tools
 - **ESLint**: Code linting with TypeScript rules
 - **Prettier**: Automated code formatting
 - **pnpm**: Fast, disk space efficient package manager
 - **T3 Env**: Type-safe environment variable validation

 ## Project Structure

 ```
 frontend/
 ├── src/
 │   ├── app/                    # Next.js App Router
 │   │   ├── layout.tsx         # Root layout component
 │   │   └── page.tsx           # Main application page
 │   ├── components/            # Reusable UI components
 │   │   ├── ColorScale.tsx     # Color legend for heatmaps
 │   │   ├── FeatureMap.tsx     # CNN feature map visualization
 │   │   ├── Waveform.tsx       # Audio waveform display
 │   │   └── ui/                # Base UI components
 │   │       ├── badge.tsx      # Status badges
 │   │       ├── button.tsx     # Interactive buttons
 │   │       ├── card.tsx       # Content containers
 │   │       └── progress.tsx   # Progress bars
 │   ├── lib/                   # Utility functions
 │   │   ├── colors.ts          # Color mapping for visualizations
 │   │   └── utils.ts           # Common utilities
 │   ├── styles/
 │   │   └── globals.css        # Global styles and CSS variables
 │   └── env.js                 # Environment variable validation
 ├── public/
 │   └── favicon.ico            # Application icon
 ├── .env.example               # Environment variable template
 ├── package.json               # Dependencies and scripts
 ├── tsconfig.json              # TypeScript configuration
 ├── next.config.js             # Next.js configuration
 ├── tailwind.config.js         # Tailwind CSS configuration
 ├── eslint.config.js           # ESLint configuration
 ├── prettier.config.js         # Prettier configuration
 └── components.json            # Radix UI components configuration
 ```

 ## Component Architecture

 ### Main Application (`src/app/page.tsx`)
 - **File Upload Handler**: Processes WAV files and converts to base64
 - **API Integration**: Communicates with Modal inference endpoint
 - **State Management**: Manages loading, error, and visualization states
 - **Layout Orchestration**: Coordinates all visualization components

 ### Visualization Components

 #### FeatureMap (`src/components/FeatureMap.tsx`)
 - Renders 2D arrays as SVG heatmaps
 - Supports different display modes (main, internal, spectrogram)
 - Normalizes values and applies color mapping
 - Responsive sizing with aspect ratio preservation

 #### Waveform (`src/components/Waveform.tsx`)
 - Displays audio time-domain data as SVG paths
 - Handles data normalization and scaling
 - Includes center line and axis labels
 - Responsive design with max dimensions

 #### ColorScale (`src/components/ColorScale.tsx`)
 - Provides visual legend for heatmap colors
 - Linear gradient from orange to white to blue
 - Configurable min/max values and dimensions

 ### UI Components (`src/components/ui/`)
 - **Card**: Content containers with consistent styling
 - **Button**: Interactive elements with multiple variants
 - **Badge**: Status indicators for predictions and metadata
 - **Progress**: Confidence score visualization bars

 ## API Integration

 ### Inference Endpoint Communication
 ```typescript
  API request format
 {
   data: string;  Base64 encoded WAV file
 }

  API response format
 {
   predictions: Array<{
     class: string;
     confidence: number;
   }>;
   visualization: {
     [layerName: string]: {
       shape: number[];
       values: number[][];
     };
   };
   input_spectrogram: {
     shape: number[];
     values: number[][];
   };
   waveform: {
     values: number[];
     sample_rate: number;
     duration: number;
   };
 }
 ```

 ### Environment Configuration
 ```bash
 NEXT_PUBLIC_INFERENCE_URL=https:your-modal-endpoint.modal.run
 ```

 ## Setup and Installation

 ### Prerequisites
 - Node.js 18.17 or later
 - pnpm 8.0 or later
 - Active Modal inference endpoint

 ### Installation Steps

 1. **Navigate to frontend directory**:
    ```bash
    cd frontend
    ```

 2. **Install dependencies**:
    ```bash
    pnpm install
    ```

 3. **Configure environment variables**:
    ```bash
    cp .env.example .env
    ```
    Edit `.env` and set:
    ```bash
    NEXT_PUBLIC_INFERENCE_URL=your_modal_endpoint_url
    ```

 4. **Start development server**:
    ```bash
    pnpm dev
    ```

 5. **Open application**:
    Navigate to `http:localhost:3000`

 ## Available Scripts

 ```bash
 # Development
 pnpm dev          # Start development server
 pnpm build        # Build for production
 pnpm start        # Start production server
 pnpm lint         # Run ESLint
 pnpm type-check   # Run TypeScript compiler
 ```

 ## Usage Guide

 ### Uploading Audio Files
 1. Click the "Choose File" button or drag a WAV file
 2. Wait for the analysis to complete (indicated by loading state)
 3. View results in the organized sections below

 ### Understanding Visualizations

 #### Predictions Section
 - Shows top 3 most likely sound categories
 - Includes emoji icons for visual recognition
 - Progress bars indicate confidence levels
 - Highest confidence prediction highlighted

 #### Input Spectrogram
 - Frequency representation of uploaded audio
 - Time on X-axis, frequency on Y-axis
 - Color intensity represents magnitude
 - Helps understand what the model "sees"

 #### Audio Waveform
 - Time-domain representation of audio signal
 - Shows amplitude changes over time
 - Includes duration and sample rate information

 #### Convolutional Layer Outputs
 - Feature maps from each CNN layer
 - Shows how model processes audio features
 - Expandable sections for detailed layer inspection
 - Color scale legend for value interpretation

 ## Styling System

 ### Design Tokens
 - **Color Palette**: Stone-based neutral colors with accent colors
 - **Typography**: Geist font family with consistent sizing
 - **Spacing**: 8px base unit with Tailwind scale
 - **Borders**: Consistent radius and color scheme

 ### Theme Support
 - Light theme (default)
 - Dark theme support via CSS variables
 - Accessible contrast ratios
 - Consistent component styling

 ### Responsive Design
 - Mobile-first approach
 - Flexible grid layouts
 - Responsive typography
 - Touch-friendly interactions

 ## Sound Categories & Emojis

 The application includes emoji mappings for all 50 ESC-50 sound categories:
 - **Animals**: 🐕 dog, 🐱 cat, 🐦 birds, 🐸 frog, etc.
 - **Natural Sounds**: 🌧️ rain, 🌊 sea waves, ⛈️ thunderstorm, 💨 wind
 - **Human Sounds**: 👶 crying baby, 😂 laughing, 👏 clapping, 👣 footsteps
 - **Mechanical**: 🚗 car horn, 🚂 train, ✈️ airplane, 🚁 helicopter
 - **Domestic**: 🚪 door knock, 🧹 vacuum, ⏰ clock alarm, 🚽 toilet flush

 ## Error Handling

 ### Client-Side Validation
 - File type validation (WAV only)
 - File size limits
 - Network connectivity checks

 ### User Feedback
 - Loading states during processing
 - Error messages for failed uploads
 - Success indicators for completed analysis
 - Graceful fallbacks for missing data

 ## Performance Optimizations

 ### Bundle Optimization
 - Tree shaking for unused code elimination
 - Code splitting with Next.js automatic optimization
 - Optimized imports for Radix UI components

 ### Runtime Performance
 - Efficient SVG rendering for visualizations
 - Memoized components to prevent unnecessary re-renders
 - Optimized image and font loading

 ### Data Processing
 - Client-side base64 encoding
 - Efficient array operations for visualization data
 - Responsive image sizing

 ## Browser Support

 - Chrome 88+
 - Firefox 85+
 - Safari 14+
 - Edge 88+

 ## Accessibility Features

 - **Keyboard Navigation**: Full keyboard support for all interactions
 - **Screen Reader Support**: Semantic HTML and ARIA labels
 - **Color Contrast**: WCAG AA compliant color schemes
 - **Focus Management**: Visible focus indicators
 - **Alternative Text**: Descriptive labels for visualizations

 ## Contributing

 ### Development Guidelines
 1. Follow TypeScript best practices
 2. Use existing UI components when possible
 3. Maintain consistent styling patterns
 4. Add proper error handling
 5. Include loading states for async operations

 ### Code Style
 - Use Prettier for formatting
 - Follow ESLint rules
 - Prefer functional components with hooks
 - Use TypeScript interfaces for type safety

 ## Troubleshooting

 ### Common Issues

 #### "Failed to fetch" error
 - Check NEXT_PUBLIC_INFERENCE_URL in .env
 - Verify Modal endpoint is running
 - Check network connectivity

 #### Audio file not processing
 - Ensure file is in WAV format
 - Check file size (should be reasonable)
 - Verify audio file is not corrupted

 #### Visualizations not displaying
 - Check browser console for JavaScript errors
 - Verify API response contains expected data structure
 - Ensure SVG rendering is supported

 ### Debug Mode
 Enable verbose logging by setting:
 ```bash
 NODE_ENV=development
 ```