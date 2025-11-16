import { Router } from "express";
import { analyzeConversation } from "../services/analysisService";

export const analyzeRouter = Router();

analyzeRouter.post("/", async (req, res) => {
  try {
    const { text, title, relationshipType } = req.body as {
      text?: string;
      title?: string;
      relationshipType?: string;
    };

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: 'Missing "text" in request body' });
    }

    const result = await analyzeConversation(text, title, relationshipType);
    return res.json(result);
  } catch (err) {
    console.error("Error in /analyze route:", err);
    return res.status(500).json({ error: "Failed to analyze conversation" });
  }
});
