"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  TwitterShareButton,
  FacebookShareButton,
  RedditShareButton,
} from "react-share";
import { Copy, Check } from "lucide-react";

interface ShareModalProps {
  url: string;
  title: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

// Pixel-perfect SVG paths for matching screenshot style
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
  </svg>
);

const FacebookIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const RedditIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M24 11.5c0-1.65-1.35-3-3-3-.96 0-1.86.48-2.42 1.24-1.64-1-3.75-1.64-5.99-1.72l1.23-3.87 3.93.83c.01.95.8 1.72 1.76 1.72 1.02 0 1.85-.83 1.85-1.85s-.83-1.85-1.85-1.85c-.75 0-1.4.45-1.69 1.1l-4.47-.94c-.21-.04-.42.08-.49.29L10.37 7.9c-2.31.06-4.5.71-6.19 1.73C3.62 8.87 2.76 8.5 1.85 8.5c-1.65 0-3 1.35-3 3 0 1.12.6 2.08 1.48 2.6-.05.29-.08.59-.08.89 0 3.86 4.49 7 10 7s10-3.14 10-7c0-.3-.03-.6-.08-.89.88-.52 1.48-1.48 1.48-2.6zM6 11.5c0-1.1.9-2 2-2s2 .9 2 2-.9 2-2 2-2-.9-2-2zm10.99 4.97c-1.04 1.04-3.01 1.13-3.99 1.13-.98 0-2.95-.09-3.99-1.13-.15-.15-.15-.39 0-.54.15-.15.39-.15.54 0 .82.82 2.5 1.02 3.45 1.02.95 0 2.63-.2 3.45-1.02.15-.15.39-.15.54 0 .15.15.15.39 0 .54zM16 13.5c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 00-4.885-1.515.074.074 0 00-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 00-5.487 0 12.64 12.64 0 00-.617-1.25.077.077 0 00-.079-.037A19.736 19.736 0 004.67 3.89a.072.072 0 00-.033.028C.533 10.048-.485 16.07.19 22.025a.077.077 0 00.03.056c2.58 1.9 4.995 3.06 7.353 3.79a.078.078 0 00.084-.027c.561-.767 1.066-1.583 1.505-2.446a.077.077 0 00-.042-.108c-.8-.305-1.564-.673-2.288-1.1a.078.078 0 01-.008-.13c.15-.113.3-.23.445-.35a.077.077 0 01.08-.01c4.833 2.21 10.05 2.21 14.814 0a.077.077 0 01.08.01c.145.12.295.237.445.35a.078.078 0 01-.007.13c-.725.427-1.488.795-2.29 1.1a.078.078 0 00-.041.108c.44.863.943 1.68 1.505 2.446a.078.078 0 00.085.027c2.36-.73 4.775-1.89 7.353-3.79a.077.077 0 00.03-.056c.744-6.906-1.258-12.894-4.833-18.107a.077.077 0 00-.032-.028zm-8.873 11.502c-1.17 0-2.13-1.077-2.13-2.404 0-1.328.95-2.405 2.13-2.405 1.19 0 2.14 1.077 2.13 2.405 0 1.327-.95 2.404-2.13 2.404zm6.6 0c-1.17 0-2.13-1.077-2.13-2.404 0-1.328.95-2.405 2.13-2.405 1.19 0 2.14 1.077 2.13 2.405 0 1.327-.956 2.404-2.13 2.404z" />
  </svg>
);

export const ShareModal = ({
  url,
  title,
  isOpen,
  onOpenChange,
}: ShareModalProps) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [discordFeedback, setDiscordFeedback] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  const handleDiscordClick = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setDiscordFeedback(true);
      setTimeout(() => setDiscordFeedback(false), 3000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[400px] sm:max-w-[400px] w-full bg-white border border-zinc-200 rounded-3xl p-8 shadow-none focus:outline-none">
        <DialogHeader className="p-0 border-none">
          <DialogTitle className="text-2xl font-bold text-zinc-900 leading-tight">
            Share
          </DialogTitle>
        </DialogHeader>

        {/* Social Platforms Row */}
        <div className="grid grid-cols-4 gap-2 mt-6 w-full min-w-0">
          {/* Twitter Button */}
          <TwitterShareButton
            url={url}
            title={title}
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-zinc-900 active:scale-95">
              <TwitterIcon />
            </div>
            <span className="text-xs font-semibold text-zinc-500 mt-2 group-hover:text-zinc-900 transition-colors">
              Twitter
            </span>
          </TwitterShareButton>

          {/* Facebook Button */}
          <FacebookShareButton
            url={url}
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-zinc-900 active:scale-95">
              <FacebookIcon />
            </div>
            <span className="text-xs font-semibold text-zinc-500 mt-2 group-hover:text-zinc-900 transition-colors">
              Facebook
            </span>
          </FacebookShareButton>

          {/* Reddit Button */}
          <RedditShareButton
            url={url}
            title={title}
            className="group flex flex-col items-center focus:outline-none"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-zinc-900 active:scale-95">
              <RedditIcon />
            </div>
            <span className="text-xs font-semibold text-zinc-500 mt-2 group-hover:text-zinc-900 transition-colors">
              Reddit
            </span>
          </RedditShareButton>

          {/* Discord Button (Copies link & displays dynamic prompt) */}
          <button
            onClick={handleDiscordClick}
            className="group flex flex-col items-center focus:outline-none cursor-pointer"
          >
            <div className="w-14 h-14 rounded-full flex items-center justify-center bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 transition-all text-zinc-900 active:scale-95">
              <DiscordIcon />
            </div>
            <span className="text-xs font-semibold text-zinc-500 mt-2 group-hover:text-zinc-900 transition-colors">
              Discord
            </span>
          </button>
        </div>

        {/* Dynamic Discord Feedback */}
        {discordFeedback && (
          <div className="mt-4 p-2 bg-blue-50 text-[#0066FF] text-xs font-medium rounded-full text-center animate-fade-in">
            Link copied! Send it to your friends on Discord.
          </div>
        )}

        {/* Page Link Box */}
        <div className="mt-6 flex flex-col gap-2 w-full min-w-0">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Page Link
          </span>
          <div className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-zinc-50 border border-zinc-200 rounded-full select-all overflow-hidden">
            <span className="text-xs font-medium text-zinc-500 truncate flex-1 min-w-0 select-all pr-2">
              {url}
            </span>
            <button
              onClick={handleCopyLink}
              className="text-zinc-400 hover:text-zinc-600 active:scale-95 transition-all focus:outline-none cursor-pointer p-1"
              aria-label="Copy page link"
            >
              {copiedLink ? (
                <div className="flex items-center gap-1.5 text-xs text-[#0066FF] font-semibold">
                  <span>Copied</span>
                  <Check className="w-4 h-4 text-[#0066FF]" />
                </div>
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
