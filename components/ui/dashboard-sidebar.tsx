"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  Building2,
  Calendar,
  Car,
  Zap,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Users", href: "/dashboard/users", icon: Users },
  { name: "Companies", href: "/dashboard/companies", icon: Building2 },
  { name: "Year", href: "/dashboard/years", icon: Calendar },
  { name: "Car", href: "/dashboard/cars", icon: Car },
  { name: "Car Models", href: "/dashboard/car-models", icon: Zap },
  { name: "Car Sub Models", href: "/dashboard/car-sub-models", icon: Zap },
];

export default function DashboardSidebar({
  sidebarOpen,
  setSidebarOpen,
  pathname,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
  pathname: string | null;
}) {
  const [userName, setUserName] = useState<string | undefined>(undefined);
  const [userEmail, setUserEmail] = useState<string | undefined>(undefined);

  useEffect(() => {
    try {
      const raw =
        typeof window !== "undefined" ? localStorage.getItem("user") : null;
      if (raw) {
        const u = JSON.parse(raw);
        if (u.first_name || u.last_name)
          setUserName(
            `${u.first_name || ""} ${u.last_name || ""}`.trim() ||
              u.email ||
              undefined
          );
        else if (u.name) setUserName(u.name);
        if (u.email) setUserEmail(u.email);
      }
    } catch (e) {}
  }, []);

  const handleLogout = async () => {
    let token = null;
    try {
      token =
        typeof window !== "undefined" ? localStorage.getItem("token") : null;
    } catch (e) {}

    try {
      const res = await fetch(`${API_BASE}/user/logout`, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(token ? { authorization: token } : {}),
        },
        body: JSON.stringify({ token }),
      });
      const json = await res.json().catch(() => ({}));
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200) {
        toast.success("Signed out");
      } else {
        toast.error("Sign out failed");
      }
    } catch (e) {
      toast.error("Network error: Could not reach server");
    } finally {
      try {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      } catch (e) {}
      if (typeof window !== "undefined") window.location.href = "/";
    }
  };

  const getIsActive = (itemHref: string) => {
    if (!pathname) return false;

    const normalize = (p: string) => {
      if (!p) return "";
      const noQuery = p.split(/[?#]/)[0];
      if (noQuery.length > 1 && noQuery.endsWith("/"))
        return noQuery.slice(0, -1);
      return noQuery;
    };

    const currentPath = normalize(pathname);
    const itemPath = normalize(itemHref);

    return currentPath === itemPath;
  };

  const renderNavigation = () => (
    <nav className="flex-1 overflow-y-auto py-4 md:py-6 px-2 md:px-3">
      <div className="space-y-1">
        {navigation.map((item, index) => {
          const isActive = getIsActive(item.href);
          const Icon = item.icon as any;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => {
                if (sidebarOpen) setSidebarOpen(false);
              }}
            >
              <Link href={item.href}>
                <motion.button
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm md:text-base font-medium ${
                    isActive
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-muted-foreground hover:bg-secondary/60 hover:text-foreground"
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.name}</span>
                </motion.button>
              </Link>
            </motion.div>
          );
        })}
      </div>
    </nav>
  );

  const renderUserSection = () => (
    <div className="p-4 md:p-6 border-t border-border bg-card/50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex items-center gap-3 p-3 md:p-4 rounded-lg mb-4"
      >
        <div className="w-10 h-10 bg-linear-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
          {userName?.charAt(0)?.toUpperCase() ?? "U"}
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm text-foreground truncate">
            {userName || "User"}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {userEmail || ""}
          </p>
        </div>
      </motion.div>

      <Button
        variant="outline"
        className="w-full justify-start gap-2 text-sm md:text-base hover:bg-red-50 hover:text-red-600 hover:border-red-200"
        onClick={handleLogout}
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  );

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            />

            <motion.aside
              initial={{ x: -280, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -280, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50 lg:hidden shadow-xl"
            >
              <div className="pt-6 pb-4 border-b border-border bg-card/80 backdrop-blur-sm">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1, type: "spring" }}
                  className="flex items-center justify-center"
                >
                  <img
                    src="/logo.png"
                    alt="Automate Logo"
                    className="w-32 h-auto"
                  />
                </motion.div>
              </div>

              {renderNavigation()}
              {renderUserSection()}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:relative lg:h-screen bg-card border-r border-border shadow-sm">
        <div className="pt-6 pb-4 border-b border-border bg-card/80 backdrop-blur-sm">
          <div className="flex items-center justify-center px-4">
            <img src="/logo.png" alt="Automate Logo" className="w-32 h-auto" />
          </div>
        </div>

        {renderNavigation()}
        {renderUserSection()}
      </aside>
    </>
  );
}
