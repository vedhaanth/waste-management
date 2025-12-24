import clientPromise from './mongodb.js';

export default async function handler(req, res) {
  try {
    const client = await clientPromise;
    const db = client.db("wastewise");

    // Test the connection
    const collections = await db.collections();
    const collectionNames = collections.map(col => col.collectionName);

    res.status(200).json({
      success: true,
      message: 'MongoDB connected successfully!',
      collections: collectionNames
    });
  } catch (error) {
    console.error('MongoDB connection error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to connect to MongoDB',
      error: error.message
    });
  }
}