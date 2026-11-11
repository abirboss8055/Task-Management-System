"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Lock, User, AlertCircle, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/manager/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        redirect: false,
        username,
        password,
      });

      if (result?.error) {
        setError("Invalid username or password. Please verify your credentials.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
      router.refresh();
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-surface border-2 border-navy p-8">
      {/* Editorial Header */}
      <div className="border-b border-line pb-6 text-center">
        <div className="text-[11px] font-bold tracking-widest uppercase text-maroon mb-1">
          Comrades Legacy
        </div>
        <h1 className="text-2xl font-black uppercase tracking-tight text-navy">
          Operations Login
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Enter your credentials to access the internal task management system.
        </p>
      </div>

      {error && (
        <div className="mt-6 p-3 bg-red-50 border-l-4 border-maroon flex items-center space-x-2 text-xs text-maroon">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
            Username
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <User className="w-4 h-4" />
            </span>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. captain or employee"
              className="w-full pl-9 pr-3 py-2 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-navy mb-1.5">
            Password
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
              <Lock className="w-4 h-4" />
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-9 pr-3 py-2 text-xs bg-ivory border border-navy/30 focus:border-navy focus:outline-none text-navy placeholder:text-slate-400 font-medium"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-6 py-2.5 px-4 bg-maroon hover:bg-maroon-hover text-white text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center space-x-2 disabled:opacity-70"
        >
          <span>{loading ? "Verifying Credentials..." : "Authenticate"}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </form>

      <div className="mt-8 pt-4 border-t border-line text-center text-[10px] text-slate-400 uppercase tracking-wider">
        Secured with NextAuth.js v5 • Internal Staff Only
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-xs uppercase tracking-wider text-navy">Loading authentication...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
