"use client";

import React, { useState } from "react";
import { useJournalStore } from "@/lib/store";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/Button";

export function AuthTestModal() {
  const profile = useJournalStore((s) => s.profile);
  const [isOpen, setIsOpen] = useState(false);

  const isLoggedIn = !!profile;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger 
        render={
          <Button variant="outline" className="shadow-[0_4px_0_0_rgba(0,0,0,1)] hover:shadow-none hover:translate-y-1 transition-all rounded-full font-semibold px-6 py-2 h-auto text-sm" />
        }
      >
        Test Auth Modal ({isLoggedIn ? "Logged In" : "Guest"})
      </DialogTrigger>
      
      <DialogContent className="max-w-[400px] w-full bg-white border border-zinc-200 rounded-3xl p-8 shadow-none focus:outline-none">
        <DialogHeader className="p-0 border-none">
          <DialogTitle className="text-2xl font-bold text-zinc-900 leading-tight">
            Auth Status
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <p className="text-zinc-500 text-sm leading-relaxed">
            {isLoggedIn 
              ? `You are logged in as ${profile.display_name || profile.email}.`
              : "You are browsing as a guest. Please log in to continue."}
          </p>
        </div>

        <div className="mt-8 flex gap-4 w-full">
          <Button 
            variant="outline"
            className="w-full rounded-full shadow-none active:translate-y-0 active:shadow-none bg-white hover:bg-zinc-50 border-zinc-200"
            onClick={() => setIsOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            variant="primary"
            className="w-full rounded-full shadow-[0_4px_0_0_#0047B3]"
            onClick={() => setIsOpen(false)}
          >
            Action
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
