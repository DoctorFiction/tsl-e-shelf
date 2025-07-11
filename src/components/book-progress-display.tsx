"use client";

import { Typography } from "./ui/typography";

interface BookProgressDisplayProps {
  bookTitle: string | null;
  currentPage: number;
  currentChapterTitle: string | null;
}

export function BookProgressDisplay({ bookTitle, currentPage, currentChapterTitle }: BookProgressDisplayProps) {
  return (
    <div className="flex flex-row justify-between absolute bottom-0.5 z-50 text-center w-full px-12">
      <Typography variant="body2" className="text-muted-foreground">
        {bookTitle}
      </Typography>
      <Typography variant="body2">{currentPage}</Typography>
      <Typography variant="body2" className="text-muted-foreground">
        {currentChapterTitle}
      </Typography>
    </div>
  );
}
