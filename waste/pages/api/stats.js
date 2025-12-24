import clientPromise from '../../src/lib/mongodb.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const client = await clientPromise;
    const db = client.db("wastewise");

    // Get total waste items
    const totalItems = await db.collection("waste_items").countDocuments();

    // Get total users
    const totalUsers = await db.collection("users").countDocuments();

    // Get items by type
    const itemsByType = await db.collection("waste_items").aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray();

    // Get recent items (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentItems = await db.collection("waste_items")
      .find({ createdAt: { $gte: sevenDaysAgo } })
      .countDocuments();

    res.status(200).json({
      success: true,
      data: {
        totalItems,
        totalUsers,
        itemsByType,
        recentItems
      }
    });
  } catch (error) {
    console.error('Database error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
}