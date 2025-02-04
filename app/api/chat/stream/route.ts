/*import {getConvexClient} from "@/lib/convex"
import {ChatRequestBody} from "@/lib/types"
import {auth} from "@clerk/nextjs/server"
import{NextResponse} from "next/server"


export async function post(req:Request){
    try{
 const(userId)=await auth();
 if(!userId){
    return new Response("Unauthorized"{status:401});
 }
 const body=(await req.json()) as ChatRequestBody;
 const{messages,newMessage,chatId}= body ;
 const convex=getConvexClient();

 // create stream with larger queue strategy for better performance 
 const stream=new TransformStream({},{highWaterMark: 1024})
 const writer=stream.writable.getWriter();

 const response=new Response(stream.readable,{
   headers:{
      "Content-Type": "text/event-stream",
      Connection:"keep-alive"
      "X-Accel-Buffering": "no",
   }
 })
 const starStream=(async()=>{
   try{
await sendSSEMessage(writer, {type:StreamMessageType.Connected})
   }catch(error){
      console.error("Error in chat API:",error);
      return NextResponse.json(
         {error: "Failed to process chat request"} as const, {status:500}
      )
   }
 })
 startStream();
 return response;
    }catch(error){
console.error("Error in chat API:",error);
return NextResponse.json(
   {error:"Failed to process chat request"} as const,
   {status:500}
)
    }
}  */


   /* import { getConvexClient } from "@/lib/convex";
import { ChatRequestBody,StreamMessage } from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

function sendSSEMessage(
    write:WritableStreamDefaultWriter<UnintBArray>,
    data:StreamMessage
){
    const encoder=new TextEncoder();
    return write(
        encoder.encode(
            `${SSE_DATE_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`
        )
    )
}

export async function post(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = (await req.json()) as ChatRequestBody;
        const { messages, newMessage, chatId } = body;
        const convex = getConvexClient();

        const stream = new TransformStream({}, { highWaterMark: 1024 });
        const writer = stream.writable.getWriter();

        const response = new Response(stream.readable, {
            headers: {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });

   const starSteam= (async () => {
            try {
                await sendSSEMessage(writer, { type: StreamMessageType.Connected });
                // send user message to Convex
                await convex.mutation(api.messages.send,{
                  chatId,
                  cotent: newMessage,  
                })
            } catch (error) {
                console.error("Error in chat API:", error);
                await writer.abort(error);
            }
        })();

        startStream();
        return response;
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}*/




/*
import {api} from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { submitQuestion } from "@/lib/langgraph";
import {
    ChatRequestBody,
    SSE_DATA_PREFIX,
    SSE_LINE_DELIMITER,
    StreamMessage,
    StreamMessageType,
} from "@/lib/types";
import {auth} from "@clerk/nextjs/server";
import {AIMessage,HumanMessage,ToolMessage} from "@langchain/core/messages";
import { NextResponse } from "next/server";




function sendSSEMessage(
    writer: WritableStreamDefaultWriter<Uint8Array>,
    data: StreamMessage
) {
    const encoder = new TextEncoder();
    return writer.write(
        encoder.encode(
            `${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`
        )
    );
}

export async function post(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = (await req.json()) as ChatRequestBody;
        const { messages, newMessage, chatId } = body;
        const convex = getConvexClient();

        const stream = new TransformStream({}, { highWaterMark: 1024 });
        const writer = stream.writable.getWriter();

        const response = new Response(stream.readable, {
            headers: {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });

        // Function to start streaming messages
        const startStream = async () => {
            try {
                // Send a "connected" message
                await sendSSEMessage(writer, { type: StreamMessageType.Connected });

                // Send the user message to Convex
                await convex.mutation("api.messages.send", {
                    chatId,
                    content: newMessage, // Fixed typo from `cotent` to `content`
                });
//convert messages to LangChain format
const langChainMessages = [
    ...messages.map((msg)=>
    msg.role === "user"
? new HumanMessage(msg.content)
:new AIMessage(msg.content)
    )
    new HumanMessage(newMessage),
try{
const eventStream = await submitQuestion(langChainMessages, chatId);
for await(const event of eventStream){
    if(event.event==="on_chat_model_stream"){
 const token = event.data.chunk;

 const text = token.content.at(0)?.["text"];
 if(text){
    await sendSSEMessage(writer,{
        type:StreamMessageType.Token,
        token:text,
    })
 }
    } else if (event.event === "on_tool_start"){

        await sendSSEMessage(writer,{
            type:StreamMessageType.ToolStar,
            tool: event.name || "unknow",
            input: event.data.input,
        })
    }  else if (event.event === "on_tool_end"){
        const toolMessage = new ToolMessage(event.data.output);

        await sendSSEMessage(writer,{
            type:StreamMessageType.ToolEnd,
         tool:toolMessage.lc_kwargs.name || "unknown",
         output:event.data.output,   
        });
    }
    //send completion message without storing the response
    await sendSSEMessage(writer, {
        type:StreamMessageType.Done})
}
} catch(streamError){
console.error("Error in event stream:", streamError);
await sendSSEMessage(writer,{
    type:StreamMessageType.Error'errorerror:
})
}
    
} finally{
    try{
  await writer.close();
    } catch(error){

    }
}
startStream();
return response ;
        } catch(error){
            console.error("Error in chat API:",error);
            return NextResponse.json(
                {error: "Failed to process chat request"} as const,
                {status:500}
                // Send a "done" message after completion
                await sendSSEMessage(writer, { type: StreamMessageType.Done });
            } catch (error) {
                console.error("Error in chat API:", error);
                await writer.abort(error); // Abort the writer on error
            } finally {
                writer.close(); // Ensure the writer is closed
            }
        };

        startStream();
        return response;
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}

*/






/*import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { submitQuestion } from "@/lib/langgraph";
import {
    ChatRequestBody,
    SSE_DATA_PREFIX,
    SSE_LINE_DELIMITER,
    StreamMessage,
    StreamMessageType,
} from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

function sendSSEMessage(
    writer: WritableStreamDefaultWriter<Uint8Array>,
    data: StreamMessage
) {
    const encoder = new TextEncoder();
    return writer.write(
        encoder.encode(
            `${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`
        )
    );
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = (await req.json()) as ChatRequestBody;
        const { messages, newMessage, chatId } = body;
        const convex = getConvexClient();

        const stream = new TransformStream({}, { highWaterMark: 1024 });
        const writer = stream.writable.getWriter();

        const response = new Response(stream.readable, {
            headers: {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });
        

        const startStream = async () => {
            try {
                // Send a "connected" message
                await sendSSEMessage(writer, { type: StreamMessageType.Connected });

                // Save the user's new message in the database
                await convex.mutation(api.messages.send, {
                    chatId,
                    content: newMessage,
                });

                // Convert messages to LangChain format
                const langChainMessages = [
                    ...messages.map((msg) =>
                        msg.role === "user"
                            ? new HumanMessage(msg.content)
                            : new AIMessage(msg.content)
                    ),
                    new HumanMessage(newMessage),
                ];

                try {
                    // Stream response from LangChain
                    const eventStream = await submitQuestion(langChainMessages, chatId);

                    for await (const event of eventStream) {
                        if (event.event === "on_chat_model_stream") {
                            const token = event.data.chunk;
                            const text = token.content.at[0]?.["text"];
                            if (text) {
                                await sendSSEMessage(writer, {
                                    type: StreamMessageType.Token,
                                    token: text,
                                });
                            }
                            }
                        } else if (event.event === "on_tool_start") {
                            await sendSSEMessage(writer, {
                                type: StreamMessageType.ToolStart,
                                tool: event.name || "unknown",
                                input: event.data.input,
                            });
                        } else if (event.event === "on_tool_end") {
                            const toolMessage = new ToolMessage(event.data.output);
                            await sendSSEMessage(writer, {
                                type: StreamMessageType.ToolEnd,
                                tool: toolMessage.lc_kwargs.name || "unknown",
                                output: event.data.output,
                            });
                        }
                    

                    // Send completion message
                    await sendSSEMessage(writer, { type: StreamMessageType.Done });
                }
                } catch (streamError) {
                    console.error("Error in event stream:", streamError);
                    await sendSSEMessage(writer, {
                        type: StreamMessageType.Error,
                        error: 
                          streamError instanceof Error 
                          ? streamError.message: 
                        : "Stream processing failed",
                    });
                }
          
        } catch (error) {

            await sendSSEMessage(writer,{
                type: StreamMessageType.Error,
                error: error instanceof Error ? error.message : "Unknow error",
                        });    
    }
} ;
   
startStream();
 
return response;
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" } as const,
            { status: 500 }
        ); 
    }
    
 

}*/


import { api } from "@/convex/_generated/api";
import { getConvexClient } from "@/lib/convex";
import { submitQuestion } from "@/lib/langgraph";
import {
    ChatRequestBody,
    SSE_DATA_PREFIX,
    SSE_LINE_DELIMITER,
    StreamMessage,
    StreamMessageType,
} from "@/lib/types";
import { auth } from "@clerk/nextjs/server";
import { AIMessage, HumanMessage, ToolMessage } from "@langchain/core/messages";
import { NextResponse } from "next/server";

function sendSSEMessage(
    writer: WritableStreamDefaultWriter<Uint8Array>,
    data: StreamMessage
) {
    const encoder = new TextEncoder();
    return writer.write(
        encoder.encode(
            `${SSE_DATA_PREFIX}${JSON.stringify(data)}${SSE_LINE_DELIMITER}`
        )
    );
}

export async function POST(req: Request) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = (await req.json()) as ChatRequestBody;
        const { messages, newMessage, chatId } = body;
        const convex = getConvexClient();

        const stream = new TransformStream({}, { highWaterMark: 1024 });
        const writer = stream.writable.getWriter();

        const response = new Response(stream.readable, {
            headers: {
                "Content-Type": "text/event-stream",
                Connection: "keep-alive",
                "X-Accel-Buffering": "no",
            },
        });

        const startStream = async () => {
            try {
                // Send a "connected" message
                await sendSSEMessage(writer, { type: StreamMessageType.Connected });

                // Save the user's new message in the database
                await convex.mutation(api.messages.send, {
                    chatId,
                    content: newMessage,
                });

                // Convert messages to LangChain format
                const langChainMessages = [
                    ...messages.map((msg) =>
                        msg.role === "user"
                            ? new HumanMessage(msg.content)
                            : new AIMessage(msg.content)
                    ),
                    new HumanMessage(newMessage),
                ];

                try {
                    // Stream response from LangChain
                    const eventStream = await submitQuestion(langChainMessages, chatId);

                    for await (const event of eventStream) {
                        if (event.event === "on_chat_model_stream") {
                            const token = event.data.chunk;
                            const text = token.content?.[0]?.text;
                            if (text) {
                                await sendSSEMessage(writer, {
                                    type: StreamMessageType.Token,
                                    token: text,
                                });
                            }
                        } else if (event.event === "on_tool_start") {
                            await sendSSEMessage(writer, {
                                type: StreamMessageType.ToolStart,
                                tool: event.name || "unknown",
                                input: event.data.input,
                            });
                        } else if (event.event === "on_tool_end") {
                           
                            /*const toolMessage = new ToolMessage({
                                tool_call_id: (event.data as any).tool_call_id || "unknown",
                                name: event.name || "unknown",
                                content: event.data.output,
                            });
                              */

                            interface EventData {
                                tool_call_id?: string;
                                output: string;
                              }
                              
                              const toolMessage = new ToolMessage({
                                tool_call_id: (event.data as EventData).tool_call_id || "unknown",
                                name: event.name || "unknown",
                                content: event.data.output,
                              });
                              
                         

                            await sendSSEMessage(writer, {
                                type: StreamMessageType.ToolEnd,
                                tool: toolMessage.lc_kwargs.name || "unknown",
                                output: event.data.output,
                            });
                        }
                    }

                    // Send completion message
                    await sendSSEMessage(writer, { type: StreamMessageType.Done });
                } catch (streamError) {
                    console.error("Error in event stream:", streamError);
                    await sendSSEMessage(writer, {
                        type: StreamMessageType.Error,
                        error:
                            streamError instanceof Error
                                ? streamError.message
                                : "Stream processing failed",
                    });
                }
            } catch (error) {
                console.error("Error processing chat:", error);
                await sendSSEMessage(writer, {
                    type: StreamMessageType.Error,
                    error: error instanceof Error ? error.message : "Unknown error",
                });
            } finally {
                try{
              await writer.close();
                } catch(closeError){
                    console.error("Error closing writer:", closeError);
                }

            }
        };

        startStream();

        return response;
    } catch (error) {
        console.error("Error in chat API:", error);
        return NextResponse.json(
            { error: "Failed to process chat request" },
            { status: 500 }
        );
    }
}
