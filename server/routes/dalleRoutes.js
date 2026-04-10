import express from 'express';
import axios from 'axios';
import * as dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

dotenv.config();

const router = express.Router();

// avoid duplicate API calls 
const cache = new Map();

// max 5 requests per IP per minute 
const imageLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 5,
  message: { error: 'Too many requests, please wait a minute.' },
});

router.post('/text-to-image', imageLimiter, async (req, res) => {
  const { prompt } = req.body;


  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }
  if (prompt.trim().length < 3) {
    return res.status(400).json({ error: 'Prompt is too short' });
  }
  if (prompt.length > 1000) {
    return res.status(400).json({ error: 'Prompt must be under 1000 characters' });
  }

  const cacheKey = prompt.toLowerCase().trim();
  if (cache.has(cacheKey)) {
    return res.json({ base64: cache.get(cacheKey), cached: true });
  }

  const options = {
    method: 'POST',
    url: 'https://ai-text-to-image-generator-flux-free-api.p.rapidapi.com/aaaaaaaaaaaaaaaaaiimagegenerator/quick.php',
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'ai-text-to-image-generator-flux-free-api.p.rapidapi.com',
      'Content-Type': 'application/json',
    },
    data: {
      prompt: prompt.trim(),   
      style_id: 4,
      size: '1-1',
    },
    timeout: 30000,           
  };

  try {
    const response = await axios.request(options);


    const resultArray = response.data?.final_result;
    if (!resultArray || !resultArray[0]?.origin) {
      return res.status(502).json({ error: 'Unexpected response from image API' });
    }

    const imageUrl = resultArray[0].origin;

    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer',
      timeout: 20000,          
    });

    const base64Image = `data:image/webp;base64,${Buffer.from(imageResponse.data, 'binary').toString('base64')}`;

    // cache auto-expire after 1 hour 
    cache.set(cacheKey, base64Image);
    setTimeout(() => cache.delete(cacheKey), 60 * 60 * 1000);

    res.json({ base64: base64Image });

  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({ error: 'Image generation timed out, please try again' });
    }
    if (error.response?.status === 429) {
      return res.status(429).json({ error: 'RapidAPI quota exceeded' });
    }
    console.error('Image generation error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image' });
  }
});

export default router;