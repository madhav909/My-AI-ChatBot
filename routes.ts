import { Router } from "express";
import { db } from "./db";
import { v4 as uuid } from "uuid";
import { generateReply } from "./llm";

export const router = Router();

router.post("/chat/message", async (req, res) => {
    try {
        const { message, sessionId } = req.body;

        if (!message || message.trim() === "") {
            return res.status(400).json({ error: "Message cannot be empty" });
        }

        const conversationId = sessionId ?? uuid();

        if (!sessionId) {
            db.prepare(
                "INSERT INTO conversations VALUES (?, ?)"
            ).run(conversationId, new Date().toISOString());
        }

        db.prepare(
            "INSERT INTO messages VALUES (?, ?, ?, ?, ?)"
        ).run(uuid(), conversationId, "user", message, new Date().toISOString());

        const pastMessages = db.prepare(
            "SELECT text FROM messages WHERE conversationId = ?"
        ).all(conversationId).map((m: any) => m.text);

        const reply = await generateReply(pastMessages, message);

        db.prepare(
            "INSERT INTO messages VALUES (?, ?, ?, ?, ?)"
        ).run(uuid(), conversationId, "ai", reply, new Date().toISOString());

        res.json({ reply, sessionId: conversationId });
    } catch (err) {
        console.error("LLM ERROR:", err);
        res.status(500).json({ reply: "AI service is temporarily unavailable." });
    }
});
