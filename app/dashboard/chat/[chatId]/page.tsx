import React from 'react'
import {Id} from "@/convex/_generated/dataModel"
import {auth} from "@clerk/nextjs/server";
import {redirect} from "next/navigation"
import ChatInterface from '@/components/ChatInterface';
import { api } from '@/convex/_generated/api';
import { getConvexClient } from '@/lib/convex';


interface ChatPageProps{
    params: Promise<{
        chatId: Id<"chats">;
    }>
}
async function ChatPage({params}:ChatPageProps){
    const {chatId}= await params;

    //get user authentication 
    const { userId } =await auth();
    if(!userId){
        redirect("/");
    }
    try{
  // Get Convex client and fetch chat and messages
const convex= getConvexClient();
//Get messages
const initialMessages= await convex.query(api.messages.list,{chatId})
return (<div className="flex-1 overflow-hidden">
    
    <ChatInterface chatId={chatId} initialMessages={initialMessages}/>
</div>
)
    } catch (error) {
  console.error("Error loading chat:", error);
  redirect("/dashboard");
    }

}
export default ChatPage