import clientPromise from '../../src/lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("wastewise");

    const { type, description, location, userId, imageUrl } = req.body;

    if (!type || !description) {
      return res.status(400).json({
        success: false,
        message: 'Type and description are required'
      });
    }

    const newItem = {
      type,
      description,
      location: location || null,
      userId: userId || null,
      imageUrl: imageUrl || null,
      createdAt: new Date(),
      status: 'pending'
    };

    const result = await db.collection("waste_items").insertOne(newItem);

    res.status(201).json({
      success: true,
      message: 'Waste item added successfully',
      data: { ...newItem, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add waste item',
      error: error.message
    });
  }
}