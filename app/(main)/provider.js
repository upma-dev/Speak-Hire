"use client";

import React from "react";
import {
  SidebarProvider as UISidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "./_components/AppSidebar";
import { SidebarProvider } from "@/context/SidebarContext";

function DashboardProvider({ children }) {
  return (
    <SidebarProvider>
      <UISidebarProvider>
        {/* MAIN APP LAYOUT */}
        <div className="flex h-screen w-full bg-[#0B1220] text-white overflow-hidden">
          {/* SIDEBAR */}
          <AppSidebar />

          {/* CONTENT AREA */}
          <main className="flex-1 flex flex-col overflow-y-auto">
            {/* TOP BAR */}
            <div className="h-14 flex items-center px-6 border-b border-white/10 backdrop-blur-xl bg-white/[0.02]">
              <SidebarTrigger className="mr-4" />

              <h1 className="text-sm text-gray-300">SpeakHire Dashboard</h1>
            </div>

            {/* PAGE CONTENT */}
            <div className="p-6 md:p-8">{children}</div>
          </main>
        </div>
      </UISidebarProvider>
    </SidebarProvider>
  );
}

export default DashboardProvider;
