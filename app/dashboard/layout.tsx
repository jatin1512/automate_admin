"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import DashboardSidebar from "@/components/ui/dashboard-sidebar";
import toast from "react-hot-toast";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      const token = localStorage.getItem("token");
      const userRaw = localStorage.getItem("user");
      const user = userRaw ? JSON.parse(userRaw) : null;
      if (!token || !user || user.type !== "Admin") {
        toast.error("Access denied: Please sign in as Admin");
        window.location.href = "/";
      }
    } catch (e) {
      window.location.href = "/";
    }
  }, []);

  return (
    <div className="flex h-screen flex-col lg:flex-row bg-background">
      <DashboardSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        pathname={pathname}
      />

      <div className="flex-1 flex flex-col overflow-hidden w-full bg-[#f5f7fa]">
        <div className="lg:hidden p-3 border-b border-border bg-background">
          <div className="max-w-6xl mx-auto">
            <button
              onClick={() => setSidebarOpen(true)}
              className="inline-flex items-center justify-center rounded-md p-2 text-muted-foreground hover:bg-secondary"
              aria-label="Open sidebar"
            >
              <Menu size={20} />
            </button>
          </div>
        </div>
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex-1 overflow-auto p-4 md:p-6 lg:p-8"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}
