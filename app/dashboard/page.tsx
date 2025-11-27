"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";
import { Users, Car, Building2, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RecentRegistrationsTable from "@/components/dashboard/recent-registrations";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<any | null>(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      setLoading(true);
      try {
        const token =
          typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${API_BASE}/user/admin/dashboard`, {
          method: "GET",
          headers: {
            "content-type": "application/json",
            ...(token ? { authorization: token } : {}),
          },
        });
        const json = await res.json().catch(() => ({}));
        const code = json?.code ?? (res.ok ? 200 : res.status);
        if (code === 200 && json?.data) {
          setData(json.data);
        } else {
          console.error(
            "Failed to fetch dashboard",
            json?.message || "Unknown error"
          );
        }
      } catch (e) {
        console.error("Network error", "Could not fetch dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = [
    {
      title: "Total Users",
      value: data ? String(data.totalUsers ?? "-") : "-",
      icon: Users,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Total Cars",
      value: data ? String(data.totalCars ?? "-") : "-",
      icon: Car,
      color: "from-purple-500 to-purple-600",
    },
    {
      title: "Active Companies",
      value: data ? String(data.activeCompanies ?? "-") : "-",
      icon: Building2,
      color: "from-emerald-500 to-emerald-600",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 12 },
    },
  };

  return (
    <div className="space-y-6 md:space-y-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
          Admin Dashboard Overview
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-2">
          A quick overview of the platform's core entities.
        </p>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4 lg:gap-6"
      >
        {stats.map((stat, index) => {
          const Icon = stat.icon as any;

          return (
            <motion.div
              key={stat.title}
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <Card className="relative overflow-hidden">
                <CardHeader className="pb-2 md:pb-3">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-xs md:text-sm font-medium text-muted-foreground">
                      {stat.title}
                    </CardTitle>
                    <div
                      className={`p-2 rounded-lg bg-linear-to-br ${stat.color}`}
                    >
                      <Icon className="text-white" size={16} />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-xl md:text-2xl lg:text-3xl font-bold text-foreground">
                      {stat.value}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </motion.div>

      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.4 }}
      >
        <RecentRegistrationsTable
          recentUsers={data?.recentUsers}
          loading={loading}
        />
      </motion.div>
    </div>
  );
}
