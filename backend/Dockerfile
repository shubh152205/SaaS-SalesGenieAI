FROM python:3.11-slim

# Install system dependencies (ffmpeg required for Whisper STT audio conversion)
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    curl \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy requirements FIRST (Docker layer cache optimization)
# Render sets build context to the Root Directory (backend/), so paths are relative to backend/
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Pre-download and cache Whisper base model to prevent cold-start delays
RUN python3 -c "from faster_whisper import WhisperModel; WhisperModel('base', device='cpu', compute_type='int8')"

# Copy all backend source code
COPY . .

# Ensure uploads directory exists
RUN mkdir -p uploads

ENV PORT=8000
EXPOSE 8000

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
