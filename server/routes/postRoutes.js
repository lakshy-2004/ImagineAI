import express from 'express';
import * as dotenv from 'dotenv';
import { v2 as cloudinary } from 'cloudinary';
import rateLimit from 'express-rate-limit';

import Post from '../mongodb/models/post.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//max 10 posts per IP per hour 
const postLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: { success: false, error: 'Too many posts, please try again later.' },
});

//   pagination
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 30;


router.get('/get', async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || DEFAULT_PAGE, 1);
    const limit = Math.min(parseInt(req.query.limit) || DEFAULT_LIMIT, 50); // cap at 50
    const skip = (page - 1) * limit;


    const [total, posts] = await Promise.all([
      Post.countDocuments(),
      Post.find({})
        .sort({ _id: -1 })          
        .skip(skip)
        .limit(limit)
        .select('name prompt photo createdAt') 
        .lean(),                         
    ]);

    res.status(200).json({
      success: true,
      data: posts,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total,
      },
    });

  } catch (error) {
    console.error('GET /post/get error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to fetch posts' });
  }
});


router.post('/add', postLimiter, async (req, res) => {
  const { name, prompt, photo } = req.body;


  if (!name || !prompt || !photo) {
    return res.status(400).json({ success: false, error: 'name, prompt, and photo are all required' });
  }
  if (typeof name !== 'string' || name.trim().length < 2) {
    return res.status(400).json({ success: false, error: 'Name must be at least 2 characters' });
  }
  if (typeof prompt !== 'string' || prompt.trim().length < 3) {
    return res.status(400).json({ success: false, error: 'Prompt must be at least 3 characters' });
  }
  if (!photo.startsWith('data:image/')) {
    return res.status(400).json({ success: false, error: 'Invalid image format' });
  }

  try {
    
    const uploadResult = await cloudinary.uploader.upload(photo, {
      folder: 'text-to-image',
      resource_type: 'image',
      timeout: 60000,
      transformation: [
        { width: 1024, height: 1024, crop: 'limit' }, 
        { quality: 'auto', fetch_format: 'auto' },    
      ],
    });

    const newPost = await Post.create({
      name: name.trim(),
      prompt: prompt.trim(),
      photo: uploadResult.secure_url,
    });

    res.status(201).json({ success: true, data: newPost });

  } catch (error) {
    
    if (error.http_code === 400) {
      return res.status(400).json({ success: false, error: 'Invalid image, could not upload' });
    }
    if (error.http_code === 499) {
      return res.status(504).json({ success: false, error: 'Image upload timed out, please try again' });
    }
    console.error('POST /post/add error:', error.message);
    res.status(500).json({ success: false, error: 'Failed to save post' });
  }
});

export default router;