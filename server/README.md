# Mellov Audio Server

A self-hosted Node.js server for streaming audio from YouTube.

## Features

- Stream audio from YouTube videos
- CORS enabled for web applications
- Health check endpoint
- Dockerized for easy deployment

## Usage

### Running locally

1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
npm start
```

### Using the audio endpoint

Make a GET request to:
```
http://localhost:3000/audio?videoId=YOUTUBE_VIDEO_ID
```

Example with curl:
```bash
curl -o audio.webm "http://localhost:3000/audio?videoId=dQw4w9WgXcQ"
```

### Health check

```
GET http://localhost:3000/health
```

## Docker Deployment

### Build the image

```bash
docker build -t mellov-audio-server .
```

### Run the container

```bash
docker run -p 3000:3000 mellov-audio-server
```

### Using environment variables

The server supports the following environment variables:

- `PORT` (default: 3000)

Example with custom port:

```bash
docker run -p 8080:8080 -e PORT=8080 mellov-audio-server
```

## API Reference

### GET /audio

Streams audio from a YouTube video.

**Query Parameters:**
- `videoId` (required): YouTube video ID

**Response:**
- Success: Audio stream with Content-Type: audio/mpeg
- Error: JSON error message

### GET /health

Health check endpoint.

**Response:**
- JSON object with status and timestamp