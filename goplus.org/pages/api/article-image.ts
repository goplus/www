import { NextApiRequest, NextApiResponse } from 'next'
import fs from 'fs'
import path from 'path'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path: imagePath } = req.query

  if (!imagePath || typeof imagePath !== 'string') {
    return res.status(400).json({ error: 'Image path is required' })
  }

  const fullPath = path.join(process.cwd(), 'articles', imagePath)

  try {
    const imageBuffer = await fs.promises.readFile(fullPath)
    
    const ext = path.extname(fullPath).toLowerCase()
    const contentType = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    }[ext] || 'application/octet-stream'

    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.send(imageBuffer)
  } catch (error) {
    console.error('Error reading image:', error)
    res.status(404).json({ error: 'Image not found' })
  }
} 