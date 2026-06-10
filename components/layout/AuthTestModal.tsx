"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import { useJournalStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export function AuthTestModal() {
  const profile = useJournalStore((s) => s.profile);
  const isAuthLoaded = useJournalStore((s) => s.isAuthLoaded);
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!profile;

  useEffect(() => {
    if (isAuthLoaded && !isLoggedIn) {
      setIsOpen(true);
    }
  }, [isAuthLoaded, isLoggedIn]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    // Fetch the user's profile to determine role-based redirect
    const {
      data: { user },
    } = await supabase.auth.getUser();
    let destination = "/";

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

      if (profile?.role === "admin") {
        destination = "/dashboard/admin";
      } else if (profile?.role === "author") {
        destination = "/dashboard/author/posts";
      } else {
        // member or unknown → home
        destination = "/";
      }
    }

    // Allow explicit ?next= param to override (e.g. deep-linked pages)
    const params = new URLSearchParams(window.location.search);
    const next = params.get("next");
    if (next && next.startsWith("/") && !next.startsWith("/dashboard")) {
      destination = next;
    }

    // Use hard redirect for auth transitions to ensure clean state and correct RBAC hydration
    window.location.href = destination;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-[95vw] sm:max-w-[850px] w-full bg-white border-none rounded-3xl p-0 shadow-2xl focus:outline-none overflow-hidden">
        <div className="flex flex-col md:flex-row min-h-[500px]">
          {/* Left Side: Form */}
          <div className="flex-1 p-10 md:p-14 flex flex-col justify-center">
            <DialogHeader className="p-0 border-none text-left mb-8">
              <div className="flex items-center gap-2 mb-10">
                {/* Kwago Minimalist Logo Placeholder */}
                <div className="w-7 h-7 rounded-lg bg-[#0066FF] flex items-center justify-center shadow-[0_2px_0_0_#0047B3]">
                  <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
                </div>
                <span className="font-bold text-zinc-900 text-xl tracking-tight">Kwago</span>
              </div>
              <DialogTitle className="text-3xl font-bold text-zinc-900 tracking-tight leading-tight">
                Welcome to Kwago
              </DialogTitle>
              <p className="text-zinc-500 mt-2 text-base">
                Your minimalist collector's journal
              </p>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
              {error && (
                <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-zinc-50/50 border border-zinc-200 placeholder:text-zinc-400 focus-visible:ring-[#0066FF]"
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="bg-zinc-50/50 border border-zinc-200 placeholder:text-zinc-400 focus-visible:ring-[#0066FF]"
              />
              <Button 
                type="submit"
                disabled={loading}
                variant="primary"
                className="w-full mt-4 rounded-full shadow-[0_4px_0_0_#0047B3] active:translate-y-1 active:shadow-none transition-all h-12 text-base font-semibold"
              >
                {loading ? "Logging in..." : "Log in"}
              </Button>
            </form>
            
            <div className="mt-8 text-center text-sm text-zinc-500">
              Don't have an account? <button className="font-semibold text-[#0066FF] hover:underline hover:text-[#0047B3] transition-colors ml-1">Join Waitlist</button>
            </div>
          </div>

          {/* Right Side: Graphic */}
          <div className="hidden md:flex flex-1 bg-zinc-50 relative items-center justify-center min-h-[300px]">
            <Image 
              src="/auth-graphic.png" 
              alt="Minimalist abstract shape" 
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
