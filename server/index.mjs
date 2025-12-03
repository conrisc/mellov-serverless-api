import express from 'express';
import { Platform, Innertube } from 'youtubei.js';
import { pipeline } from 'node:stream/promises';

const app = express();
const port = process.env.PORT || 3000;

if (!process.env.ALLOWED_ORIGINS) {
  console.error("ALLOWED_ORIGINS environment variable is not set.");
  process.exit(1);
}

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim());

Platform.shim.eval = async (data, env) => {
  const properties = [];

  if(env.n) {
    properties.push(`n: exportedVars.nFunction("${env.n}")`)
  }

  if (env.sig) {
    properties.push(`sig: exportedVars.sigFunction("${env.sig}")`)
  }

  const code = `${data.output}\nreturn { ${properties.join(', ')} }`;

  return new Function(code)();
}

let innertubeInstance = null;

async function initializeInnertube() {
  if (!innertubeInstance) {
    console.log('Initializing Innertube instance');
    innertubeInstance = await Innertube.create({ location: 'PL' });
  }
  return innertubeInstance;
}

// Audio streaming endpoint
app.get('/audio', async (req, res) => {
  if (req.header('Origin') && allowedOrigins.includes(req.header('Origin'))) {
    res.setHeader('Access-Control-Allow-Origin', req.header('Origin'));
  } else {
    console.warn("Unknown origin:", req.header('Origin'));
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const videoId = req.query.videoId;

    if (!videoId) {
      console.warn("No videoId provided in request");
      return res.status(400).json({ error: 'videoId is required' });
    }

    const yt = await initializeInnertube();

    const logTime = new Date().toISOString();
    console.log(`[${logTime}] Starting download for videoId: ${videoId}`);
    const options = {
      type: 'audio',
      quality: 'best',
      format: 'any',
      client: 'TV',
      codec: 'opus', // TODO: should be commented to allow any codec,
      // but it requires to find out what's the mime type of the stream to pass it in the response header
    };

    // const info = await yt.getBasicInfo(videoId);
    // const format = info.chooseFormat(options);
    // const stream = await info.download(options);
    const stream = await yt.download(videoId, options);
    const mimeType = 'audio/webm; codecs="opus"'; // should be format.mime_type

    // Set response headers for streaming
    res.setHeader('Content-Type', mimeType);
    res.setHeader('Content-Type', 'audio/webm; codecs="opus"');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream the audio data
    await pipeline(stream, res);

  } catch (error) {
    console.error('Streaming error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(port, () => {
  console.log(`Audio streaming server running on port ${port}`);
});

export default app;