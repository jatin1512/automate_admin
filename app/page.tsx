"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/dashboard";
      return null;
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/user/signin`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const json = await res.json();
      const code = json?.code ?? (res.ok ? 200 : res.status);
      if (code === 200 && json?.data?.user) {
        const user = json.data.user;
        if (user.type !== "Admin") {
          toast.error("Only Admin users can sign in");
          setIsLoading(false);
          return;
        }

        try {
          localStorage.setItem("token", json.data.token);
        } catch (e) {}
        try {
          localStorage.setItem("user", JSON.stringify(user));
        } catch (e) {}
        toast.success(json.message || "Signed in");
        window.location.href = "/dashboard";
      } else {
        toast.error(json?.message || "Sign in failed");
      }
    } catch (err) {
      toast.error("Network error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col lg:flex-row">
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="hidden lg:flex w-full lg:w-1/2 bg-linear-to-br from-slate-50 to-slate-100 flex-col justify-center items-center p-8 md:p-12"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
        >
          <img src="/logo.png" alt="Automate Logo" className="w-56 mb-6" />
        </motion.div>
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground mb-4 md:mb-6 text-center"
        >
          <span className="text-blue-600">Automate</span> Your Gateway to <br />
          Mastering Car Knowledge.
        </motion.h1>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full lg:w-1/2 flex flex-col justify-center items-center p-6 md:p-8 lg:p-12"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full max-w-md"
        >
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-bold text-foreground mb-2">
              Admin Login
            </h2>
            <p className="text-sm md:text-base text-muted-foreground">
              Please enter your credentials to continue.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-sm"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <label className="block text-xs md:text-sm font-medium text-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pr-10 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex items-center space-x-2"
            >
              <Checkbox id="remember" />
              <label
                htmlFor="remember"
                className="text-xs md:text-sm text-muted-foreground cursor-pointer"
              >
                Remember me
              </label>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 md:py-6 text-base md:text-lg font-semibold"
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </motion.div>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}
