"use client";

import { BookImage } from "@/hooks/use-epub-reader";
import { Image as ImageIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Typography } from "./ui/typography";

interface ImagesPopoverProps {
  images: BookImage[];
  goToCfiAction: (cfi: string) => void;
}

export function ImagesPopover({ images, goToCfiAction }: ImagesPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
          aria-label="Kitap Resimleri"
          type="button"
        >
          <ImageIcon className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <div className="p-4">
          <Typography variant="h6">Kitap Resimleri</Typography>
        </div>
        <div className="max-h-48 overflow-y-auto p-4 pt-0">
          {images.length === 0 ? (
            // TODO: Book images popover no images message should be left aligned
            <Typography variant="body2" className="text-muted-foreground">
              Bu kitapta resim bulunamadı.
            </Typography>
          ) : (
            images.map((image, index) => (
              <div key={index} className="flex items-center gap-4 p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer" onClick={() => goToCfiAction(image.cfi)}>
                <div>
                  <Typography variant="body2" className="font-medium">
                    {image.description || "Açıklama yok"}
                  </Typography>
                  <Typography variant="caption">
                    {image.chapter && `${image.chapter} - `}Sayfa {image.page}
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
