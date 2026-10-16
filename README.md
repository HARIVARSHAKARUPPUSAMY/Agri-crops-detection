# AI-Based Universal Fruit and Vegetable Quality Grading System

A production-grade, multi-stage computer vision application for automated fruit and vegetable quality inspection, defect segmentation, grade classification, and downloadable audit report generation.

---

## 1. System Overview

The system processes optical imagery and conveyor video streams through a multi-stage pipeline:
1. **Input Validation & Frame Extraction**: File integrity, format, resolution, and frame clarity verification.
2. **Preprocessing (Kornia + Torchvision)**: GPU/CPU tensor normalization, bilinear resizing, and color space alignment.
3. **YOLO Segmentation**: Produce item localization and visible-defect boundary segmentation (bruises, fungal rot, cuts, scabs, blemishes).
4. **EfficientNet-B0 Classification**: Deep visual representation for quality categorization.
5. **Crop-Specific Rules Engine**: Strict threshold matching for **Grade A (Premium)**, **Grade B (Standard)**, **Grade C (Low Quality)**, and **Rejected (Non-Commercial)**.
6. **Defect Severity & Confidence Assessment**: Sub-millimeter area estimation, calibrated confidence scores, and automated human-review triggers.
7. **Automated PDF Inspection Certificates**: Downloadable reports with visual evidence overlays.

---

## 2. Project Architecture

```
├── server.ts                   # Fullstack Express API server & Vite middleware bridge
├── src/                        # Web Frontend (React + TypeScript + Tailwind CSS)
│   ├── components/             # Reusable UI components
│   │   ├── Navbar.tsx          # Top Bar with Dashboard Dropdown (Profile, Email, Settings, About, Help, Logout)
│   │   └── AnnotatedCanvas.tsx # Interactive YOLO bounding box & defect mask visualization
│   ├── context/                # AuthContext & SettingsContext (Theme, Speed, Model)
│   ├── pages/                  # Application screens
│   │   ├── AuthPage.tsx        # First Page: Login & Sign-Up (Organisation / Individual Person)
│   │   ├── DashboardPage.tsx   # Dashboard with New Grading CTA & Previous History
│   │   ├── NewGradingPage.tsx  # Image/Video upload, presets & scanning progress
│   │   ├── ResultsPage.tsx     # Quality Assessment & visual evidence
│   │   ├── ProfilePage.tsx     # Profile management
│   │   ├── SettingsPage.tsx    # Theme (Light/Dark/System), Speed, Model configuration
│   │   ├── AboutPage.tsx       # System specifications & responsible-use statement
│   │   └── HelpPage.tsx        # Guidelines, troubleshooting & support desk
│   ├── services/               # Grading rules engine & jsPDF report generator
│   └── types.ts                # Shared TypeScript definitions
├── backend/                    # Python FastAPI Backend
│   ├── main.py                 # FastAPI REST application
│   ├── requirements.txt        # Python dependencies (PyTorch, Kornia, YOLO, EfficientNet)
│   ├── db/                     # PostgreSQL schema and SQLAlchemy models
│   ├── pipeline/               # PyTorch Preprocessing, YOLO, EfficientNet, Crop Rules
│   └── tests/                  # Automated test suite
├── mobile/                     # Flutter Mobile Application
│   ├── pubspec.yaml            # Flutter project dependencies
│   └── lib/                    # Screens & services (Login, Dashboard, Grading, Results)
├── API_DOCUMENTATION.md        # Complete REST API reference
└── metadata.json               # Google AI Studio manifest
```

---

## 3. Getting Started & Running the Web App

### Prerequisites
- Node.js (v18+)
- npm

### Installation & Execution
```bash
# Install dependencies
npm install

# Start the full-stack server (runs on port 3000)
npm run dev
```

Open `http://localhost:3000` to access the application.

---

## 4. Running the Python FastAPI Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Run FastAPI server on port 8000
python main.py
```

### Running Automated Tests
```bash
pytest backend/tests/test_grading.py -v
```

---

## 5. Running the Flutter Mobile Client

```bash
cd mobile
flutter pub get
flutter run
```

---

## 6. PostgreSQL Database Setup

1. Create a PostgreSQL database:
   ```sql
   CREATE DATABASE agrigrade_db;
   ```
2. Apply the schema:
   ```bash
   psql -U postgres -d agrigrade_db -f backend/db/schema.sql
   ```

---

## 7. AI Model Weights Setup

The application supports real weight loading from checkpoints:
- **YOLO Segmentation**: Place your fine-tuned produce weights at `backend/models/yolov8_produce_seg.pt` or set `YOLO_SEG_WEIGHTS_PATH`.
- **EfficientNet-B0**: Place the trained PyTorch state dict at `backend/models/efficientnet_b0_quality.pt` or set `EFFICIENTNET_WEIGHTS_PATH`.

When model weights are not provided, the pipeline activates the development/demo configuration and logs the operational status clearly.

---

## 8. Responsible-Use Statement

The system assesses visible surface characteristics from images or videos. It does not independently certify food safety, chemical/pesticide residues, microbial contamination, or internal flesh quality. Results should be audited by a certified inspector when commercial disputes arise.
