import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    title: v.string(),
    userId: v.string(),
    createdAt: v.number(),
   // Add the userId field which references the "users" table
  }).index("by_user", ["userId"]),  // Create the index on the userId field

  messages: defineTable({
    chatId: v.id("chats"), // Reference to the "chats" table
    content: v.string(),
    role: v.union(v.literal("user"), v.literal("assistant")),
    createdAt: v.number(),
  }).index("by_chat", ["chatId"])  // Create the index on the chatId field
});





