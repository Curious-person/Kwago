"use client";

import React, { useState, useEffect } from "react";
import { Share2 } from "lucide-react";
import { TwitterShareButton, LinkedinShareButton } from "react-share";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ShareModal } from "./ShareModal";

interface ShareButtonsProps {
  title: string;
}

export const ShareButtons = ({ title }: ShareButtonsProps) => {
  const [shareUrl, setShareUrl] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setShareUrl(window.location.href);
  }, []);

  // Hydration safety: ensure sharing buttons don't attempt standard clicks until URL is resolved on client
  const isReady = shareUrl !== "";

  return (
    <>
      <div className="mt-20 pt-10 border-t border-zinc-100 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">
            Share this
          </span>
          <div className="flex gap-2">
            {isReady ? (
              <TwitterShareButton url={shareUrl} title={title}>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 hover:bg-zinc-200 transition-colors shadow-none cursor-pointer"
                >
                  Twitter
                </Badge>
              </TwitterShareButton>
            ) : (
              <Badge variant="secondary" className="px-4 py-2 opacity-50 cursor-not-allowed">
                Twitter
              </Badge>
            )}

            {isReady ? (
              <LinkedinShareButton url={shareUrl}>
                <Badge
                  variant="secondary"
                  className="px-4 py-2 hover:bg-zinc-200 transition-colors shadow-none cursor-pointer"
                >
                  LinkedIn
                </Badge>
              </LinkedinShareButton>
            ) : (
              <Badge variant="secondary" className="px-4 py-2 opacity-50 cursor-not-allowed">
                LinkedIn
              </Badge>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="text-zinc-400 hover:text-zinc-600 cursor-pointer shadow-none p-2 flex items-center justify-center rounded-full"
          onClick={() => setIsModalOpen(true)}
          aria-label="Open sharing choices"
        >
          <Share2 size={16} />
        </Button>
      </div>

      <ShareModal
        url={shareUrl}
        title={title}
        isOpen={isModalOpen}
        onOpenChange={setIsModalOpen}
      />
    </>
  );
};
