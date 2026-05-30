"use client";

import React from "react";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Send } from "lucide-react";

export const ContactForm = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would handle the Supabase or API submission here
    console.log("Form submitted");
  };

  return (
    <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="name"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400"
          >
            Name
          </label>
          <Input
            id="name"
            placeholder="John Doe"
            className="bg-[#F9FAFB] border-transparent focus:bg-white focus:border-zinc-200 transition-all"
          />
        </div>
        <div className="flex flex-col gap-2">
          <label
            htmlFor="email"
            className="text-xs font-bold uppercase tracking-widest text-zinc-400"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            className="bg-[#F9FAFB] border-transparent focus:bg-white focus:border-zinc-200 transition-all"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label
          htmlFor="message"
          className="text-xs font-bold uppercase tracking-widest text-zinc-400"
        >
          Message
        </label>
        <textarea
          id="message"
          rows={6}
          placeholder="What's on your mind?"
          className="w-full rounded-2xl bg-[#F9FAFB] border-transparent p-4 text-sm focus:outline-none focus:bg-white focus:border-zinc-200 transition-all resize-none"
        />
      </div>

      <Button className="w-full sm:w-fit px-10 py-6 text-base mt-2 flex items-center gap-2 group">
        Send Message
        <Send
          size={18}
          className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
        />
      </Button>
    </form>
  );
};
