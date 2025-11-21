import { type User, type InsertUser, type Feedback, type InsertFeedback, users, feedback } from "@shared/schema";
import { db } from "./db";
import { desc, lt, eq } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  createFeedback(data: InsertFeedback): Promise<Feedback>;
  getFeedback(limit: number, cursor?: string): Promise<Feedback[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
    return result[0];
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const result = await db.select().from(users).where(eq(users.username, username)).limit(1);
    return result[0];
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const result = await db.insert(users).values(insertUser).returning();
    return result[0];
  }

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
