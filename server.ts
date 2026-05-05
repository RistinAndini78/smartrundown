import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import cors from "cors";
import morgan from "morgan";
import { WebSocketServer, WebSocket } from "ws";
import http from "http";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Firebase Config
const FIREBASE_API_KEY = "AIzaSyBgqsxDktCkAtTF3fzhx61WiE-u9B1jr0c";
const FIREBASE_PROJECT_ID = "smartdesigner-13d73";

async function startServer() {
  const app = express();
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(cors());
  app.use(morgan("dev"));
  app.use(express.json());

  // WebSocket Logic (Real-time Broadcast)
  wss.on("connection", (ws) => {
    ws.send(JSON.stringify({ type: "SYSTEM_NOTIFICATION", message: "Koneksi Cloud Supabase Aktif", variant: "success" }));
  });

  // API Admin: Create User in Firebase Auth
  app.post("/api/admin/create-user", async (req, res) => {
    try {
      const { email, password, name, role } = req.body;
      
      // 1. Create in Firebase Auth
      const authUrl = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
      const authRes = await fetch(authUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, returnSecureToken: true })
      });
      const authData = await authRes.json();
      
      if (!authRes.ok) throw new Error(authData.error.message);

      // 2. Save Profile to Firestore
      const firestoreUrl = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/users/${authData.localId}?key=${FIREBASE_API_KEY}`;
      const fields: any = {
        name: { stringValue: name },
        email: { stringValue: email },
        role: { stringValue: role || 'user' },
        createdAt: { stringValue: new Date().toISOString() }
      };

      await fetch(firestoreUrl, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fields })
      });

      res.status(201).json({ message: "User berhasil dibuat di Firebase Auth & Firestore", uid: authData.localId });
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: err.message || "Gagal membuat user" });
    }
  });

  // Update User Settings
  app.patch("/api/user", async (req, res) => {
    try {
      const { email, updates } = req.body;
      const response = await fetch(`${SUPABASE_URL}/rest/v1/users?email=eq.${email}`, {
        method: 'PATCH',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updates)
      });
      const data = await response.json();
      res.json({ message: "Pengaturan berhasil diperbarui", user: data[0] });
    } catch (err) {
      res.status(500).json({ message: "Gagal memperbarui pengaturan di cloud" });
    }
  });

  // REST API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", message: "REST API & WebSocket Server is running!" });
  });

  app.get("/api/stats", (req, res) => {
    res.json({
      admin: { totalRundowns: 1284, newUsers: 12, serverLoad: "42%", health: "99.9%" },
      user: { projects: 8, collaborators: 4, tasks: 156, drafts: 2 }
    });
  });

  // Rundown API via Supabase
  app.get("/api/rundowns", async (req, res) => {
    try {
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rundowns?select=*`, {
        headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
      });
      const rundowns = await response.json();
      res.json(rundowns);
    } catch (err) {
      res.status(500).json({ message: "Gagal mengambil data dari cloud" });
    }
  });

  app.post("/api/rundowns", async (req, res) => {
    try {
      const newRd = req.body;
      const response = await fetch(`${SUPABASE_URL}/rest/v1/rundowns`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(newRd)
      });
      const data = await response.json();
      
      // Broadcast via WebSocket
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ type: "RUNDOWN_CREATED", message: `Rundown baru di Cloud: ${newRd.title}` }));
        }
      });
      res.status(201).json(data[0]);
    } catch (err) {
      res.status(500).json({ message: "Gagal menyimpan ke cloud" });
    }
  });

  // Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 WebSocket enabled on ws://localhost:${PORT}`);
  });
}

startServer();
