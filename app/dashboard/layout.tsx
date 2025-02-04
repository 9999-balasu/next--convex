

/*"use client";

import { Authenticated } from "convex/react";
import { SignedIn } from "@clerk/nextjs";
import Header from "@/components/Header";
import { NavigationProvider } from "@/lib/NavigationProvider";
export default function DashboardLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return(
      <NavigationProvider>
        <div className="flex h-screen">
         <SignedIn>
        <h1>Sidebar</h1>
      </SignedIn>
 <div className="flex-1">
<Header/>
<main> {children}</main>
 </div>
 </div>
<NavigationProvider>
    );
       }*/
  
  
  
  
    "use client";

    import { Authenticated } from "convex/react";
    //import { SignedIn } from "@clerk/nextjs";
    import Header from "@/components/Header";
    import { NavigationProvider } from "@/lib/NavigationProvider";
    import Sidebar from "@/components/Sidebar";
    
    
    export default function DashboardLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
    
    
        <NavigationProvider>
          <div className="flex h-screen">
         
          <Authenticated>
          <Sidebar/>
          </Authenticated>
          
           
            <div className="flex-1">
           
            <Header />
           
              <main>{children}</main>
             
             
            </div>
          </div>
        </NavigationProvider>
    
        
      );
    }
    