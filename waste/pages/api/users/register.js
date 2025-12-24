import clientPromise from '../../src/lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("wastewise");

    const { email, name, location } = req.body;

    if (!email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Email and name are required'
      });
    }

    // Check if user already exists
    const existingUser = await db.collection("users").findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    const newUser = {
      email,
      name,
      location: location || null,
      createdAt: new Date(),
      totalReports: 0
    };

    const result = await db.collection("users").insertOne(newUser);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { ...newUser, _id: result.insertedId }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to register user',
      error: error.message
    });
  }
}