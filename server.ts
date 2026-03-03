import express from "express";
import { createServer as createViteServer } from "vite";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// --- MOCK DATABASE / QUEUE ---
// In a real app, this would be a SQL database (MySQL/PostgreSQL)
const DB_PATH = path.join(__dirname, "data.json");

interface QueuedEmail {
    id: string;
    to: string;
    subject: string;
    content: string;
    status: 'pending' | 'sent' | 'failed';
    createdAt: string;
    sentAt?: string;
    error?: string;
}

interface DB {
    queue: QueuedEmail[];
    sentCountThisHour: number;
    lastResetTime: string;
}

const loadDB = (): DB => {
    if (fs.existsSync(DB_PATH)) {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
    }
    return { queue: [], sentCountThisHour: 0, lastResetTime: new Date().toISOString() };
};

const saveDB = (db: DB) => {
    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2));
};

// --- EMAIL SENDER ---
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "localhost",
    port: parseInt(process.env.SMTP_PORT || "465"),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

// --- API ROUTES ---

// Health check
app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
});

// Add to queue
app.post("/api/email/queue", (req, res) => {
    const { recipients, subject, content } = req.body;
    
    if (!recipients || !Array.isArray(recipients) || !subject || !content) {
        return res.status(400).json({ error: "Invalid request data" });
    }

    const db = loadDB();
    const newEmails: QueuedEmail[] = recipients.map(email => ({
        id: Math.random().toString(36).substr(2, 9),
        to: email,
        subject,
        content,
        status: 'pending',
        createdAt: new Date().toISOString()
    }));

    db.queue.push(...newEmails);
    saveDB(db);

    res.json({ 
        message: `${newEmails.length} emails added to queue`,
        queueSize: db.queue.filter(e => e.status === 'pending').length
    });
});

// Get queue status
app.get("/api/email/status", (req, res) => {
    const db = loadDB();
    const pending = db.queue.filter(e => e.status === 'pending').length;
    const sent = db.queue.filter(e => e.status === 'sent').length;
    const failed = db.queue.filter(e => e.status === 'failed').length;

    res.json({
        pending,
        sent,
        failed,
        sentCountThisHour: db.sentCountThisHour,
        limit: parseInt(process.env.MAX_EMAILS_PER_HOUR || "80")
    });
});

// --- BACKGROUND WORKER (Simulated Cron Job) ---
// This runs every 30 seconds for the demo, but in production it would be hourly
const processQueue = async () => {
    const db = loadDB();
    const now = new Date();
    const lastReset = new Date(db.lastResetTime);
    
    // Reset hourly counter if an hour has passed
    if (now.getTime() - lastReset.getTime() > 3600000) {
        db.sentCountThisHour = 0;
        db.lastResetTime = now.toISOString();
    }

    const limit = parseInt(process.env.MAX_EMAILS_PER_HOUR || "80");
    const availableSlots = limit - db.sentCountThisHour;

    if (availableSlots <= 0) {
        console.log("[Queue Worker] Hourly limit reached. Waiting for next hour.");
        saveDB(db);
        return;
    }

    const pendingEmails = db.queue.filter(e => e.status === 'pending').slice(0, availableSlots);

    if (pendingEmails.length === 0) {
        return;
    }

    console.log(`[Queue Worker] Processing ${pendingEmails.length} emails...`);

    for (const email of pendingEmails) {
        try {
            // Only actually send if SMTP is configured
            if (process.env.SMTP_USER) {
                await transporter.sendMail({
                    from: process.env.SMTP_USER,
                    to: email.to,
                    subject: email.subject,
                    html: email.content
                });
            } else {
                console.log(`[Simulated Send] To: ${email.to}, Subject: ${email.subject}`);
            }
            
            email.status = 'sent';
            email.sentAt = new Date().toISOString();
            db.sentCountThisHour++;
        } catch (error: any) {
            console.error(`[Queue Worker] Failed to send to ${email.to}:`, error.message);
            email.status = 'failed';
            email.error = error.message;
        }
    }

    saveDB(db);
};

// Run worker every 30 seconds
setInterval(processQueue, 30000);

// --- VITE MIDDLEWARE ---
async function startServer() {
    if (process.env.NODE_ENV !== "production") {
        const vite = await createViteServer({
            server: { middlewareMode: true },
            appType: "spa",
        });
        app.use(vite.middlewares);
    } else {
        app.use(express.static(path.join(__dirname, "dist")));
        app.get("*", (req, res) => {
            res.sendFile(path.join(__dirname, "dist", "index.html"));
        });
    }

    app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();
