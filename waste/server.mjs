import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { MongoClient, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
const port = process.env.PORT || 4000;

const mongoUri = process.env.MONGODB_URI;
const jwtSecret = process.env.JWT_SECRET || "dev-secret-change-me";

if (!mongoUri) {
  console.error("MONGODB_URI is not set. Please add it to a .env file.");
  process.exit(1);
}

app.use(cors());
app.use(bodyParser.json());

const client = new MongoClient(mongoUri);
let db;

async function initDb() {
  await client.connect();
  db = client.db(); // uses DB from URI, or default
  console.log("Connected to MongoDB");
}

function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing token" });
  }
  const token = authHeader.slice("Bearer ".length);
  try {
    const payload = jwt.verify(token, jwtSecret);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "Invalid token" });
  }
}

app.post("/api/auth/signup", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  const users = db.collection("users");
  const existing = await users.findOne({ email });
  if (existing) {
    return res.status(409).json({ error: "User already exists" });
  }
  const passwordHash = await bcrypt.hash(password, 10);
  const result = await users.insertOne({
    email,
    passwordHash,
    createdAt: new Date(),
  });
  const token = jwt.sign({ userId: result.insertedId.toString(), email }, jwtSecret, {
    expiresIn: "7d",
  });
  res.json({ token });
});

app.post("/api/auth/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }
  const users = db.collection("users");
  const user = await users.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) {
    return res.status(401).json({ error: "Invalid credentials" });
  }
  const token = jwt.sign({ userId: user._id.toString(), email }, jwtSecret, {
    expiresIn: "7d",
  });
  res.json({ token });
});

app.get("/api/history", authMiddleware, async (req, res) => {
  const { userId } = req.user;
  const history = await db
    .collection("history")
    .find({ userId: new ObjectId(userId) })
    .sort({ createdAt: -1 })
    .toArray();
  res.json(history);
});

app.post("/api/history", authMiddleware, async (req, res) => {
  const { userId } = req.user;
  const { category, status, ticketNumber, address, type } = req.body;
  if (!category || !type) {
    return res.status(400).json({ error: "category and type required" });
  }
  const doc = {
    userId: new ObjectId(userId),
    type, // "scan" or "report"
    category,
    status: status || (type === "scan" ? "completed" : "pending"),
    ticketNumber: ticketNumber || null,
    address: address || null,
    createdAt: new Date(),
  };
  const result = await db.collection("history").insertOne(doc);
  res.status(201).json({ _id: result.insertedId, ...doc });
});

app.get("/api/admin/reports", authMiddleware, async (req, res) => {
  // Ideally check for admin role here
  const reports = await db
    .collection("history")
    .find({ type: "report" }) // Only fetch reports, not scans
    .sort({ createdAt: -1 })
    .toArray();
  res.json(reports);
});

initDb().then(() => {
  app.listen(port, () => {
    console.log(`API server running on http://localhost:${port}`);
  });
});


