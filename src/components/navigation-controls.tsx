import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationControlsProps {
  goPrev: () => void;
  goNext: () => void;
}

export function NavigationControls({ goPrev, goNext }: NavigationControlsProps) {
  return (
    <div className="flex gap-4 mx-auto">
      <Button
        onClick={goPrev}
        className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-75 rounded-lg px-4 py-2 font-medium flex items-center gap-2"
      >
        <ChevronLeft className="w-4 h-4" />
        Prev
      </Button>
      <Button
        onClick={goNext}
        className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-75 rounded-lg px-4 py-2 font-medium flex items-center gap-2"
      >
        Next
        <ChevronRight className="w-4 h-4" />
      </Button>
    </div>
  );
}
