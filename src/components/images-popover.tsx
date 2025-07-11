"use client";

import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { Image as ImageIcon } from "lucide-react";
import { Typography } from "./ui/typography";
import { BookImage } from "@/hooks/use-epub-reader";

interface ImagesPopoverProps {
  images: BookImage[];
  goToCfiAction: (cfi: string) => void;
}

export function ImagesPopover({ images, goToCfiAction }: ImagesPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Images">
          <ImageIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <Typography variant="h6">Book Images</Typography>
        </div>
        <div className="p-4 pt-0">
          {images.length === 0 ? (
            <Typography variant="body2" className="text-center text-muted-foreground">
              No images found in this book.
            </Typography>
          ) : (
            images.map((image, index) => (
              <div key={index} className="flex items-center gap-4 p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer" onClick={() => goToCfiAction(image.cfi)}>
                <div>
                  <Typography variant="body2" className="font-medium">
                    {image.description || "No description"}
                  </Typography>
                  <Typography variant="caption">
                    {image.chapter && `${image.chapter} - `}Page {image.page}
                  </Typography>
                </div>
              </div>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
