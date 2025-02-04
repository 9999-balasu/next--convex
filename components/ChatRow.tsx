"use client";
import {Doc,Id} from "@/convex/_generated/dataModel";
import { NavigationContext } from "@/lib/NavigationProvider";
import {use} from "react";
//import { useRouter } from "next/router";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import { TrashIcon } from "@radix-ui/react-icons";
function ChatRow({
    chat,
    onDelete,
}:{
    chat:Doc<"chats">
    onDelete:(id: Id<"chats">) => void;
}){
    const router = useRouter();
    const{closeMobileNav}=use(NavigationContext);

    const handleClick=()=>{
        router.push(`/dashboard/chat/${chat._id}`);
        closeMobileNav()
       
    }

    return  (
      <div   
        className="group rounded-xl border border-r-gray-200/030 bg-white/50 backdrop-blur-sm 
    hover:bg-white/80/transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
     onClick={handleClick}
     >
      <div className="p-4">
        <div className="flex justify-between 
        items-start">Chat
       {/*} <Button 
        variant="ghost"
     size="icon"
     className="opacity-0 group-hover:opacity-100-mr-2 mt-2 ml-2 transition-opacity duration-200"
    onClick={(e)=>{
    e.stopPropagation();
    onDelete(chat._id);
}}>

<TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors"/>
</Button>*/}
<div className="group flex items-center">
    <Button 
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 mr-2 mt-2 ml-2 transition-opacity duration-200"
        onClick={(e) => {
            e.stopPropagation();
            onDelete(chat._id);
        }}
    >
        <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors"/>
    </Button>
</div>

        </div>
    {/*Last Message */}
{/*{lastMessage && (
    <p className="text-xs text-gray-400 mt-1.5 font-medium">
        <TimeAgo data={lastMessage.createdAt}/>
    </p>
)}*/} 

      </div>
       </div>
    )
    

{/*<Button variant="gost"
size="icon"
className="opacity-0 group-hover:opacity-100-mr-2 mt-2 ml-2 transition-opacity duration-200"
onClick={(e)=>{
    e.stopPropagation();
    ondeviceorientationabsolute(ChatRow._id)
}}>

    <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors"/>
</Button>
{/*Last Message */}
{/*{lastMessage && (
    <p className="text-xs text-gray-400 mt-1.5 font-medium">
        <TimeAgo data={lastMessage.createdAt}/>
    </p>
)} */}

        

}
export default ChatRow;


/*import { Doc, Id } from "@/convex/_generated/dataModel";
import { useRouter } from "next/router";
import { useContext } from "react";
import { NavigationContext } from "@/lib/NavigationProvider"; // Adjust import if needed

import { Button } from "./ui/button";
import { TrashIcon } from "lucide-react";

type ChatRowProps = {
  chat: Doc<"chats">;
  onDelete: (id: Id<"chats">) => void;
};

function ChatRow({
   chat,
    onDelete,
   }: ChatRowProps) {
  const router = useRouter();
  const { closeMobileNav } = useContext(NavigationContext);

  const handleClick = () => {
    router.push(`/dashboard/chat/${chat._id}`);
    closeMobileNav();
  };

  return (
    <div
      className="group rounded-xl border border-r-gray-200/30 bg-white/50 backdrop-blur-sm hover:bg-white/80 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
      onClick={handleClick}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <span>{chat.title}</span> {/* Display chat name or other info */
       /* </div>

        <Button
          variant="ghost"
          size="icon"
          className="opacity-0 group-hover:opacity-100 mr-2 mt-2 ml-2 transition-opacity duration-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(chat._id); // Corrected the onDelete logic
          }}
        >
          <TrashIcon className="h-4 w-4 text-gray-400 hover:text-red-500 transition-colors" />
        </Button>

        {/* Optionally add the last message */
        {/* {lastMessage && (
          <p className="text-xs text-gray-400 mt-1.5 font-medium">
            <TimeAgo date={lastMessage.createdAt} />
          </p>
        )} */}
      /*</div>
    </div>
  );
}

export default ChatRow;*/


