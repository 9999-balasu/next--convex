/*import {v} from "convex/values"
import {mutation,query} from "./_generated/server";




export const list=query({
    args:{chatId:v.id("chats")},
    handler:async(ctx,args)=>{
        const messages=await ctx.db 
        .query("messages")
        .withIndex("by_chat",(q)=>q.eq("chatId",args.chatId))
        .order("asc")
        .collect();

       
      
        return messages ;
    }
})

export const send=mutation({
    args:{
       chatId:v.id("chats") ,
       content: v.string(),
    },
    handler:async(ctx,args)=>{
        const messgeId=await ctx.db.insert("messages",{
            chatId:args.chatId,
            content:args.content.replace(/\n/g, "\\n"),
            role:"user",
            createdAt: Date.now(),
        })
        return messgeId;
    }
})

export const store=mutation({
    args:{
        chatId:v.id("chats"),
        content:v.string(),
        role:v.union(v.literal("user"),v.literal("assistant")),

    },
    handler: async(convexToJson, args) =>{
        if(SHOW_COMMENTS){
            console.log("Storing message:",{
                chatId: args.chatId,
                role:args.role,
                contentLength: args.content.length,
            })
        }
    }
})

export const getLastMessage=query({
    args:{chatId: v.id("chats")},
    handler:async(ctx,args)=>{
        const identity=await ctx.auth.getUserIdentity();
        if(!identity){
            throw new Error ("Not authenticated");
        }
        const chat=await ctx.db.get(args.chatId);
        if(!chat || chat.userId !== identity.subject){
            throw new Error("Unauthorized");
        }
        const lastMessage = await ctx.db 
        .query("messages")
        .withIndex("by_chat", (q)=> q.eq("chatId",args.chatId))
        .order("desc")
        .first();
        return lastMessage ;
    }
})
*/





/*import { v } from "convex/values";
import { mutation, query } from "./_generated/server";




// List messages for a specific chat
export const list = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
            .order("asc")
            .collect();

        return messages;
    },
});

// Send a new message
export const send = mutation({
    args: {
        chatId: v.id("chats"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("messages", {
            chatId: args.chatId,
            content: args.content.replace(/\n/g, "\\n"),
            role: "user",
            createdAt: Date.now(),
        });
        return messageId;
    },
});

// Store a new message (with optional comments logging)
export const store = mutation({
    args: {
        chatId: v.id("chats"),
        content: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
    },
    handler: async (ctx, args) => {
        // Log messages for debugging (ensure SHOW_COMMENTS is defined in your environment)
        const messageId = await ctx.db.insert("messages", {
            chatId: args.chatId,
            content: args.content
            .replace(/\n/g, "\\n")
            .replace(/\\/g, "\\\\"),
            role: args.role,
            createdAt: Date.now(),
        });
        return messageId;
        }

        // Insert message into database
      

// Get the last message for a specific chat
export const getLastMessage = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const chat = await ctx.db.get(args.chatId);
        if (!chat || chat.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        const lastMessage = await ctx.db
            .query("messages")
            .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
            .order("desc")
            .first();

        return lastMessage;
    },
})*/


import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// List messages for a specific chat
export const list = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
            .order("asc")
            .collect();
        return messages;
    },
});

// Send a new message
export const send = mutation({
    args: {
        chatId: v.id("chats"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("messages", {
            chatId: args.chatId,
            content: args.content.replace(/\n/g, "\\n"),
            role: "user",
            createdAt: Date.now(),
        });
        return messageId;
    },
});

// Store a new message (with optional comments logging)
export const store = mutation({
    args: {
        chatId: v.id("chats"),
        content: v.string(),
        role: v.union(v.literal("user"), v.literal("assistant")),
    },
    handler: async (ctx, args) => {
        const messageId = await ctx.db.insert("messages", {
            chatId: args.chatId,
            content: args.content.replace(/\n/g, "\\n").replace(/\\/g, "\\\\"),
            role: args.role,
            createdAt: Date.now(),
        });
        return messageId;
    },
});

// Get the last message for a specific chat
export const getLastMessage = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Not authenticated");
        }
        const chat = await ctx.db.get(args.chatId);
        if (!chat || chat.userId !== identity.subject) {
            throw new Error("Unauthorized");
        }

        const lastMessage = await ctx.db
            .query("messages")
            .withIndex("by_chat", (q) => q.eq("chatId", args.chatId))
            .order("desc")
            .first();

        return lastMessage;
    },
});















/*import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const send = mutation({
    args: {
        chatId: v.id("chats"),
        content: v.string(),
        role: v.literal("user", "assistant"), // Restrict `role` to "user" or "assistant"
    },
    handler: async (ctx, args) => {
        const content = args.content
            .replace(/\n/g, "\\n") // Escaping newlines
            .replace(/\\/g, "\\\\"); // Escaping backslashes

        const messageId = await ctx.db.insert("messages", {
            chatId: args.chatId,
            content, // Use the processed content
            role: args.role, // Guaranteed to be either "user" or "assistant"
            createdAt: Date.now(),
        });

        return messageId;
    },
});*/



/*
import { v } from "convex/values";
import { mutation } from "./_generated/server";

export const send = mutation({
    args: {
        chatId: v.id("chats"), // Enforces chatId is a valid ID of type "chats"
        content: v.string(),   // Content is a required string
        role: v.literal("user", "assistant"), // Role is restricted to "user" or "assistant"
    },
    handler: async (ctx, args) => {
        const { chatId, content, role } = args;

        try {
            // Insert the message into the "messages" table
            const messageId = await ctx.db.insert("messages", {
                chatId,
                content,  // Store raw content unless further processing is necessary
                role,
                createdAt: Date.now(), // Timestamp for the message
            });

            return messageId; // Return the inserted message ID
        } catch (error) {
            console.error("Error inserting message:", error);
            throw new Error("Failed to send message");
        }
    },
});
*/


