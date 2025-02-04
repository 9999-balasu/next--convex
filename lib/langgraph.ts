



/*import { ChatAnthropic } from "@langchain/anthropic";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import wxflows from "@wxflows/sdk/langchain";
import { Workflow } from "lucide-react";

import { Graph } from "@langchain/langgraph";

import {
    END,
    MemorySaver, // Fixed typo: "MemorySaser" -> "MemorySaver"
    MessagesAnnotation,
    START,
    StateGraph,
} from "@langchain/langgraph";
import SYSTEM_MESSAGE from "@/constants/systemMessage"; // Fixed typo: "costants" -> "constants"
import {
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    trimMessages,
} from "@langchain/core/messages";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";

// Trimmer Configuration
const trimmer = trimMessages({
    maxTokens: 10,
    strategy: "last",
    tokenCounter: (messages: BaseMessage[]) =>
        messages.reduce((count, msg) => count + (msg.content?.length || 0), 0), // Adjust for BaseMessage type
    includeSystem: true,
    allowPartial: false,
    startOn: "human",
});

// Connect to wxflows
const toolClient = new wxflows({
    endpoint: process.env.WXFLOWS_ENDPOINT || "",
    apikey: process.env.WXFLOWS_APIKEY,
});

// Retrieve the tools
const tools = await toolClient.lcTools;

const toolNode = new ToolNode(tools);

// Initializing the Model
const initialiseModel = () => {
    const model = new ChatAnthropic({
        modelName: "claude",
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        temperature: 0.7,
        maxTokens: 4096,
        streaming: true,
        clientOptions: {
            defaultHeaders: {
                "anthropic-beta": "prompt-caching-2024-07-31",
            },
        },
        callbacks: [
            {
                handleLLMStart: async () => {
                   // console.log("starting LLM call");
                },
                handleLLMEnd: async (output) => {
                    //console.log("End LLM call, output");
                    const usage = output.llmOutput?.usage;
                    if (usage) {
                        // Handle usage if necessary
                    }
                },
            },
        ],
    }).bindTools(tools);

    return model;
};

// Define the function that determines whether to continue or not
function shouldContinue(state: typeof MessagesAnnotation.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    if (lastMessage.content && lastMessage._getType() === "tool") {
        return "agent";
    }

    return END;
}

// Create workflow
const createWorkflow = async () => {
    const model = initialiseModel(); // Corrected the typo from initialisModel to initialiseModel

    const stateGraph = new StateGraph(MessagesAnnotation)
        .addNode(
            "agent",
            async (state) => {
                const systemContent = SYSTEM_MESSAGE; // Assuming SYSTEM_MESSAGE is defined somewhere
                // Create the prompt template with system message and messages placeholder
                const promptTemplate = ChatPromptTemplate.fromMessages([
                    new SystemMessage(systemContent, {
                        cache_control: { type: "ephemeral" },
                    }),
                    new MessagesPlaceholder("messages"),
                ]);

                // Trim the messages to manage conversation history
                const trimmedMessages = await trimmer.invoke(state.messages); // Fixed typo here
                // Format the prompt with the current messages
                const prompt = await promptTemplate.invoke({ messages: trimmedMessages });

                // Get response
                const response = await model.invoke(prompt);
                return { messages: [response] };
            }
        )
        .addEdge(START, "agent")
        .addNode("tools", toolNode)
        .addConditionalEdges("agent", shouldContinue)
        .addEdge("tools", "agent");

    return stateGraph;
};

function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
    if (!messages.length) return messages; // Fixed typo: "messages,length" -> "messages.length"
    const cachedMessages = [...messages];

    // Helper to add cache control
    const addCache = (message: BaseMessage) => {
        message.content = [
            {
                type: "text",
                text: message.content as string,
                cache_control: { type: "ephemeral" },
            },
        ];
    };

    addCache(cachedMessages.at(-1)!);
    let humanCount = 0; // Initialize humanCount variable
    for (let i = 0; i < cachedMessages.length; i++) {
        if (cachedMessages[i] instanceof HumanMessage) {
            humanCount++;
            if (humanCount === 2) {
                addCache(cachedMessages[i]);
                break;
            }
        }
    }

    return cachedMessages;
}

// Placeholder for the submitQuestion function
export async function submitQuestion(messages: BaseMessage[], chatId: string) {
    const cachedMessages = addCachingHeaders(messages);
    const workflow = await createWorkflow(); // Corrected: Await the workflow creation

    const checkpointer = new MemorySaver(); // Fixed typo: "new MemorySaser" -> "new MemorySaver"
    const app = workflow.compile({ checkpointer }); // Fixed: "comile" -> "compile"

    console.log("Messages:", cachedMessages);
    //const workflow = createWorkflow();
    // Run the graph and stream
    const stream = await app.streamEvents(
        {
            messages: cachedMessages,
        },
        {
            variation: "v2", // Fixed typo: "vartion" -> "variation"
            configurable: {
                thread_id: chatId,
            },
            streamMode: "messages",
            runId: chatId,
        } as any
    );
    return stream;
}
*/


import { ChatAnthropic } from "@langchain/anthropic";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import wxflows from "@wxflows/sdk/langchain";



//import { Graph } from "@langchain/langgraph";

import {
    END,
    MemorySaver,
    MessagesAnnotation,
    START,
    StateGraph,
} from "@langchain/langgraph";
import SYSTEM_MESSAGE from "@/constants/systemMessage"; 
import {
    AIMessage,
    BaseMessage,
    HumanMessage,
    SystemMessage,
    trimMessages,
} from "@langchain/core/messages";
import {
    ChatPromptTemplate,
    MessagesPlaceholder,
} from "@langchain/core/prompts";

// Trimmer Configuration
/*const trimmer = trimMessages({
    maxTokens: 10,
    strategy: "last",
    tokenCounter: (messages: BaseMessage[]) =>
        messages.reduce((count, msg) => count + (msg.content?.length || 0), 0),
    includeSystem: true,
    allowPartial: false,
    startOn: "human",
});*/

const trimmer = trimMessages({
    maxTokens: 10,
    strategy: "last",
    tokenCounter: (msgs) => msgs.length,
     includeSystem: true,
    allowPartial: false,
    startOn: "human",
});

// Connect to wxflows
const toolClient = new wxflows({
    endpoint: process.env.WXFLOWS_ENDPOINT || "",
    apikey: process.env.WXFLOWS_APIKEY,
});

// Retrieve the tools
const tools = await toolClient.lcTools;

const toolNode = new ToolNode(tools);

// Initializing the Model
export const initialiseModel = () => {
    const model = new ChatAnthropic({
        modelName: "claude-3-5-sonnet-20240620 ",
        anthropicApiKey: process.env.ANTHROPIC_API_KEY,
        temperature: 0.3,
        maxTokens:1000,
        streaming: true,
    
      clientOptions:{
        defaultHeaders:{
      "anthropic-beta": "prompt-caching"
        }
        },
    
        callbacks: [
            {
                handleLLMStart: async () => {
                    // Log when the LLM starts
                    console.log("Starting LLM call...");
                },
                handleLLMEnd: async (output) => {
                    console.log("End LLM call", output);
                    const usage = output.llmOutput?.usage;
                    if (usage) {
                        // Handle usage if necessary
                    }
                },
            },
        ],
    }).bindTools(tools);

    return model;
};













// Define the function that determines whether to continue or not
function shouldContinue(state: typeof MessagesAnnotation.State) {
    const messages = state.messages;
    const lastMessage = messages[messages.length - 1] as AIMessage;

    if (lastMessage.tool_calls?.length) {
        return "tools";
    }
    if (lastMessage.content && lastMessage._getType() === "tool") {
        return "agent";
    }

    return END;
}

// Create workflow
const createWorkflow = async () => {
    const model = initialiseModel(); 

    const stateGraph = new StateGraph(MessagesAnnotation)
        .addNode(
            "agent",
            async (state) => {
                const systemContent = SYSTEM_MESSAGE; // Assuming SYSTEM_MESSAGE is defined somewhere
                // Create the prompt template with system message and messages placeholder
                const promptTemplate = ChatPromptTemplate.fromMessages([
                    new SystemMessage(systemContent, {
                        cache_control: { type: "ephemeral" },
                    }),
                    new MessagesPlaceholder("messages"),
                ]);

                // Trim the messages to manage conversation history
                const trimmedMessages = await trimmer.invoke(state.messages);
                // Format the prompt with the current messages
                const prompt = await promptTemplate.invoke({ messages: trimmedMessages });

                // Get response from model
                const response = await model.invoke(prompt);
                
                return { messages: [response] };
            }
        )
        .addEdge(START, "agent")
        .addNode("tools", toolNode)
        .addConditionalEdges("agent", shouldContinue)
        .addEdge("tools", "agent");

    return stateGraph;
};

function addCachingHeaders(messages: BaseMessage[]): BaseMessage[] {
    if (!messages.length) return messages;
    const cachedMessages = [...messages];

    // Helper to add cache control
    const addCache = (message: BaseMessage) => {
        message.content = [
            {
                type: "text",
                text: message.content as string,
                cache_control: { type: "ephemeral" },
            },
        ];
    };

    addCache(cachedMessages.at(-1)!);
    let humanCount = 0;
    for (let i = cachedMessages.length -1; i>=0; i--) {
        if (cachedMessages[i] instanceof HumanMessage) {
            humanCount++;
            if (humanCount === 2) {
                addCache(cachedMessages[i]);
                break;
            }
        }
    }

    return cachedMessages;
}


export async function submitQuestion(messages: BaseMessage[], chatId: string) {
    const cachedMessages = addCachingHeaders(messages);
    console.log("Messages:", cachedMessages);
    const workflow = await createWorkflow(); // Wait for workflow creation

// create a checkpoint to save the stste of the conversation
    const checkpointer = new MemorySaver();
    const app = workflow.compile({ checkpointer });
    console.log("Messages:", messages) ;

    // Run the graph and stream 
    console.log("Exports from langgraph.ts:", { submitQuestion });

    const stream = await app.streamEvents(

{
    messages
},
 {
      version: 'v2',
      configurable: { // Fixed typo here
        thread_id: chatId
      },
      streamMode: "messages",
      runId: chatId,
    }

);
return stream;
}
  



