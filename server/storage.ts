import { type User, type UpsertUser, type Feedback, type InsertFeedback, users, feedback } from "@shared/schema";
import { db } from "./db";
import { desc, lt, eq } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Feedback operations
  createFeedback(data: InsertFeedback): Promise<Feedback>;
  getFeedback(limit: number, cursor?: string): Promise<Feedback[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations (required for Replit Auth)
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Feedback operations
  async createFeedback(data: InsertFeedback): Promise<Feedback> {
    const result = await db.insert(feedback).values(data).returning();
    return result[0];
  }

  async getFeedback(limit: number = 20, cursor?: string): Promise<Feedback[]> {
    let query = db.select().from(feedback).orderBy(desc(feedback.createdAt)).limit(limit);
    
    if (cursor) {
      query = query.where(lt(feedback.createdAt, new Date(cursor)));
    }
    
    return await query;
  }
}

export const storage = new DatabaseStorage();
