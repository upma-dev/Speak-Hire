"use client";

import { SidebarProvider as ContextProvider } from "@/context/SidebarContext";
import { AppSidebar } from "./_components/AppSidebar";
import { useSidebarState } from "@/context/SidebarContext";

function MainContent({ children }) {
  const { collapsed } = useSidebarState();

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar (optional) */}
      <AppSidebar />

      {/* MAIN CONTENT (FIXED - NO EXTRA SPACE) */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  );
}

export default function LayoutWrapper({ children }) {
  return (
    <ContextProvider>
      <MainContent>{children}</MainContent>
    </ContextProvider>
  );
}
