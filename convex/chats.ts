import { mutation,query } from "./_generated/server";
import { v } from "convex/values";


// Mutation to create a chat

/*export const createChat = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Convert userId to Id<"users"> using ctx.db.id
    //const userId = ctx.db.id("users", identity.subject);

    const chat = await ctx.db.insert("chats", {
      title: args.title,
      userId:identity.subject,
      createdAt: Date.now(),
    });
    return chat;
  },
});*/








export const createChat = mutation({
  args: {
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    
    // Log the identity to the console
    console.log("User Identity:", identity);

    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Convert userId to Id<"users"> using ctx.db.id
    // const userId = ctx.db.id("users", identity.subject);

    const chat = await ctx.db.insert("chats", {
      title: args.title,
      userId: identity.subject,
      createdAt: Date.now(),
    });
    return chat;
  },
});



// Mutation to delete a chat
export const deleteChat = mutation({
  args: { id: v.id("chats") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Retrieve the chat to ensure the user owns it
    const chat = await ctx.db.get(args.id);
    if (!chat || chat.userId !== identity.subject) {
      throw new Error("Unauthorized");
    }

    // Delete all messages associated with the chat
    const messages = await ctx.db
      .query("messages")
      .withIndex("by_chat", (q) => q.eq("chatId", args.id))
      
      .collect();

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    // Delete the chat itself
    await ctx.db.delete(args.id);
  },
})


// Query to list chats for a user
 export const listChats = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Convert userId to Id<"users"> using ctx.db.id
    //const userId = ctx.db.id("users", identity.subject);

    const chats = await ctx.db
      .query("chats")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    return chats;
  },
});


