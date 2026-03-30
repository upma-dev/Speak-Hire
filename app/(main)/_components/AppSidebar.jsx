"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";

import { SideBarOptions } from "@/services/Constants";
import { usePathname, useRouter } from "next/navigation";

import { ChevronLeft, Plus, LogOut, User as UserIcon } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useSidebarState } from "@/context/SidebarContext";
import { useUser } from "@/app/provider";
import { useState, useEffect } from "react";
import { supabase } from "@/services/supabaseClient";
import { toast } from "sonner"; // ✅ correct import

export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { collapsed, setCollapsed } = useSidebarState();
  const { user } = useUser();

  const [openProfile, setOpenProfile] = useState(false);

  // 🔥 logout
  const logout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logged out successfully!");
      router.replace("/");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // 🔥 outside click close
  useEffect(() => {
    const handleClick = () => setOpenProfile(false);
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <motion.div
      animate={{ width: collapsed ? 80 : 260 }}
      className="
h-screen
bg-[#0B0F19]
border-r border-white/10
flex flex-col
relative
z-50
overflow-visible
"
    >
      {/* Collapse Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="
absolute -right-3 top-6 z-50
bg-[#111827]
border border-white/10
rounded-full p-1
hover:bg-white/10
"
      >
        <ChevronLeft
          className={`transition ${collapsed && "rotate-180"}`}
          size={16}
        />{" "}
      </button>

      {/* HEADER */}
      <SidebarHeader className="p-5 flex flex-col items-center">
        <Image src="/logo.png" width={120} height={40} alt="logo" />

        {!collapsed && (
          <Link
            href="/dashboard/create-interview"
            className="
          mt-6 w-full
          flex items-center justify-center gap-2
          h-11 rounded-xl
          bg-gradient-to-r from-blue-600 to-purple-600
          text-white font-medium
          hover:scale-[1.03]
          transition
        "
          >
            <Plus size={16} />
            Create Interview
          </Link>
        )}
      </SidebarHeader>
      {/* MENU */}
      <SidebarContent className="px-3 mt-4 flex-1 overflow-y-auto">
        <div className="space-y-2">
          {SideBarOptions.map((item, i) => {
            const active = pathname === item.path;
            const Icon = item.icon;

            return (
              <Link key={i} href={item.path} className="relative group">
                {active && (
                  <motion.div
                    layoutId="activeSidebar"
                    className="
                  absolute inset-0 rounded-xl
                  bg-gradient-to-r from-blue-600/20 to-purple-600/20
                  border border-blue-500/20
                "
                  />
                )}

                <div
                  className={`
                relative flex items-center
                ${collapsed ? "justify-center" : "gap-3"}
                px-4 py-3 rounded-xl
                text-sm font-medium
                transition-all
                ${
                  active
                    ? "text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
                >
                  <Icon
                    className={`h-5 w-5 ${active ? "text-blue-400" : ""}`}
                  />

                  {!collapsed && <span>{item.name}</span>}
                </div>

                {/* Tooltip */}
                {collapsed && (
                  <span
                    className="
                  absolute left-full ml-3 top-1/2 -translate-y-1/2
                  bg-black text-xs px-2 py-1 rounded
                  opacity-0 group-hover:opacity-100
                  whitespace-nowrap
                "
                  >
                    {item.name}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </SidebarContent>
      {/* USER PROFILE */}
      <div className="relative p-4 border-t border-white/10">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setOpenProfile(!openProfile);
          }}
          className="
        flex items-center gap-3 cursor-pointer
        hover:bg-white/5 p-2 rounded-xl transition
      "
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
            {user?.name?.[0] || "U"}
          </div>

          {!collapsed && (
            <div>
              <p className="text-sm text-white font-medium">
                {user?.name || "User"}
              </p>
              <p className="text-xs text-gray-400">
                {user?.plan || "Free Plan"}
              </p>
            </div>
          )}
        </div>

        {/* DROPDOWN */}
        <AnimatePresence>
          {openProfile && !collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="
            absolute bottom-16 left-4 right-4
            bg-[#111827]
            border border-white/10
            rounded-xl p-2 space-y-1
            shadow-2xl z-50
          "
            >
              <Link
                href="/settings"
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-white/10 text-sm"
              >
                <UserIcon size={14} />
                Profile
              </Link>

              <button
                onClick={logout}
                className="
              flex items-center gap-2 px-3 py-2 rounded-lg
              hover:bg-red-500/20 text-sm text-red-400 w-full
            "
              >
                <LogOut size={14} />
                Logout
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
