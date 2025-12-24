import clientPromise from '../../src/lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("wastewise");

    // Get all waste items
    const wasteItems = await db.collection("waste_items").find({}).toArray();

    res.status(200).json({
      success: true,
      data: wasteItems
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch waste items',
      error: error.message
    });
  }
}