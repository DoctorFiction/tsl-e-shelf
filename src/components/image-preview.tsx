"use client";

import Image from "next/image";
import { Typography } from "./ui/typography";
import { Button } from "./ui/button";

interface ImagePreviewProps {
  imagePreview: { src: string; description: string } | null;
  setImagePreviewAction: (image: { src: string; description: string } | null) => void;
}

export function ImagePreview({ imagePreview, setImagePreviewAction }: ImagePreviewProps) {
  if (!imagePreview) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm" onClick={() => setImagePreviewAction(null)}>
      <div
        className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-lg bg-background p-4 shadow-lg"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the dialog
      >
        <div className="flex justify-end pb-2">
          <Button variant="ghost" size="icon" onClick={() => setImagePreviewAction(null)}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-4 w-4"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center">
          <Image width={800} height={600} src={imagePreview.src} alt={imagePreview.description} className="max-w-full max-h-[calc(90vh-100px)] object-contain" />
          <Typography variant="body1" className="text-center italic">
            {imagePreview.description}
          </Typography>
        </div>
      </div>
    </div>
  );
}
