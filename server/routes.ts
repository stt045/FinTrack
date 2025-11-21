import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertFeedbackSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Feedback routes
  app.post("/api/feedback", async (req, res) => {
    try {
      const validatedData = insertFeedbackSchema.parse(req.body);
      const feedback = await storage.createFeedback(validatedData);
      res.json(feedback);
    } catch (error) {
      res.status(400).json({ error: "Invalid feedback data" });
    }
  });

  app.get("/api/feedback", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 20;
      const cursor = req.query.cursor as string | undefined;
      const feedbackList = await storage.getFeedback(limit, cursor);
      res.json(feedbackList);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch feedback" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
