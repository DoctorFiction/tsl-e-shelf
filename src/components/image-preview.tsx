"use client";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import Image from "next/image";
import { Typography } from "./ui/typography";

interface ImagePreviewProps {
  imagePreview: { src: string; description: string } | null;
  setImagePreviewAction: (image: { src: string; description: string } | null) => void;
}

export function ImagePreview({ imagePreview, setImagePreviewAction }: ImagePreviewProps) {
  return (
    <Dialog open={!!imagePreview} onOpenChange={() => setImagePreviewAction(null)}>
      <DialogTitle>Image Preview</DialogTitle>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden p-0 flex flex-col">
        {imagePreview && <Image width={200} height={200} src={imagePreview.src} alt={imagePreview.description} className="w-full h-full object-contain flex-grow" />}
        {imagePreview?.description && (
          <Typography variant="body1" className="text-center p-4">
            {imagePreview.description}
          </Typography>
        )}
      </DialogContent>
    </Dialog>
  );
}
