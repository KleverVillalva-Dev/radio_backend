import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  if (req.method !== 'GET') {
    return res.status(405).end(); // Only GET allowed
  }

  try {
    const result = await cloudinary.search
      .expression('resource_type:image')
      .sort_by('created_at', 'desc')
      .max_results(100)
      .execute();

    const urls = result.resources.map(img => img.secure_url);
    res.status(200).json(urls);
  } catch (error) {
    console.error('Cloudinary Error:', error);
    res.status(500).json({ error: 'No se pudieron obtener las imágenes' });
  }
}
