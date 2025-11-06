# Doctor Face Recognition Attendance System

A real-time face recognition system for tracking doctor attendance using webcam and DeepFace technology.

## Features

- **Real-time Face Recognition**: Uses DeepFace with Facenet512 model for accurate face detection
- **Automatic Attendance Tracking**: Marks ENTRY/EXIT based on doctor presence
- **Photo Capture**: Automatically saves photos for each attendance event
- **Multiple Output Formats**: CSV, JSONL, and optional API integration
- **Manual Override**: Keyboard controls for manual ENTRY/EXIT marking
- **Cooldown Protection**: Prevents duplicate entries within configurable time window

## Dataset Structure

The system expects the following folder structure:

```
dataset/
  D101_Dr_Rahul_Cardiologist/
    1.jpg
    2.jpg
  D102_Dr_Priya_Dermatologist/
    1.jpg
    2.jpg
  D103_Dr_Arjun_Surgeon/
    1.jpg
    2.jpg
  D104_Dr_Anita_Pediatrician/
    1.jpg
    2.jpg
```

**Folder naming convention**: `{DoctorID}_{DoctorName}_{Specialization}`

## Installation

### 1. Create Virtual Environment

```bash
python -m venv .venv
.venv\Scripts\activate  # Windows
# or
source .venv/bin/activate  # Linux/Mac
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment

Copy `.env.example` to `.env` and modify as needed:

```bash
cp .env.example .env
```

## Configuration

Edit `.env` file to configure the system:

```env
# Face Recognition Settings
MODEL_NAME=Facenet512
DETECTOR=retinaface
THRESHOLD=0.35

# Camera Settings
CAM_INDEX=0

# API Settings (optional)
API_URL=
API_TOKEN=

# File Paths
DATA_DIR=./Dataset_image
EMB_PATH=./storage/embeddings.npz
META_PATH=./storage/meta.json
ATT_CSV=./storage/attendance.csv
ATT_JSONL=./storage/attendance.jsonl
PHOTO_DIR=./storage/photos
```

## Usage

### 1. Generate Face Embeddings

First, generate face embeddings from your dataset:

```bash
python embed.py --data-dir ./Dataset_image
```

This will:
- Process all images in the dataset
- Generate 512-dimensional face embeddings
- Save embeddings to `storage/embeddings.npz`
- Save metadata to `storage/meta.json`

### 2. Run Attendance System

Start the real-time attendance system:

```bash
python run.py
```

The system will:
- Open webcam
- Detect faces in real-time
- Recognize doctors and mark attendance
- Save photos and records automatically

### 3. Verify Single Image

Test recognition on a single image:

```bash
python verify.py --image path/to/photo.jpg
```

## Keyboard Controls

When running the attendance system:

- **Q**: Quit the system
- **E**: Force EXIT mode
- **I**: Force ENTRY mode

## Output Files

### Attendance Records

The system generates the following files:

- **CSV**: `storage/attendance.csv` - Tabular attendance data
- **JSONL**: `storage/attendance.jsonl` - JSON records for each event
- **Photos**: `storage/photos/` - Captured photos for each event

### Record Format

Each attendance record contains:

```json
{
  "timestamp": "2024-01-15 09:30:00",
  "doctor_id": "D101",
  "name": "Dr_Rahul",
  "type": "Cardiologist",
  "event": "entry",
  "similarity": "0.91",
  "photo_path": "storage/photos/D101_entry_20240115_093000_abc12345.jpg"
}
```

## API Integration

If you have a backend API, configure `API_URL` and `API_TOKEN` in `.env`. The system will automatically send attendance events to your API.

## Troubleshooting

### Common Issues

1. **Camera not working**: Check `CAM_INDEX` in `.env` file
2. **No faces detected**: Ensure good lighting and clear face visibility
3. **Low accuracy**: Adjust `THRESHOLD` value in `.env`
4. **Import errors**: Make sure virtual environment is activated

### Performance Tips

- Use GPU if available for faster processing
- Reduce image resolution for better performance
- Adjust `COOLDOWN_TIME` to prevent spam detection

## Requirements

- Python 3.8+
- Webcam
- Good lighting conditions
- Sufficient RAM (4GB+ recommended)

## Dependencies

- `deepface`: Face recognition engine
- `opencv-python`: Computer vision and camera handling
- `numpy`: Numerical computations
- `scikit-learn`: Similarity calculations
- `pandas`: Data handling
- `requests`: API communication
- `python-dotenv`: Environment configuration
- `tqdm`: Progress bars
- `Pillow`: Image processing

## License

This project is open source and available under the MIT License.

## Support

For issues and questions, please check the troubleshooting section or create an issue in the repository.
