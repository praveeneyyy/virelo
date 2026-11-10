# Stage 1: Build Frontend React SPA
FROM node:22-alpine AS frontend-builder
WORKDIR /build
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# Stage 2: Production Python Backend with FFmpeg
FROM python:3.12-slim
WORKDIR /app

# Install system utilities & FFmpeg
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    nodejs \
    ca-certificates \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install Python requirements
COPY backend/requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

# Copy Backend Application
COPY backend/ /app/backend/

# Copy built frontend assets from Stage 1 into frontend/dist
COPY --from=frontend-builder /build/dist /app/frontend/dist

# Create download and database directories
RUN mkdir -p /app/downloads /app/data

# Environment variables
ENV HOST=0.0.0.0
ENV PORT=8000
ENV DOWNLOADS_PATH=/app/downloads
ENV DB_PATH=/app/data/virelo.db
ENV PYTHONUNBUFFERED=1

EXPOSE 8000

CMD ["python", "-m", "uvicorn", "backend.app.main:app", "--host", "0.0.0.0", "--port", "8000"]
