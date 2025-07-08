import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationControlsProps {
  goPrev: () => void;
  goNext: () => void;
}

export function NavigationControls({ goPrev, goNext }: NavigationControlsProps) {
  return (
    <div className="flex gap-2 sm:gap-4 mx-auto  px-3 sm:px-4 py-2 -lg ">
      <Button
        onClick={goPrev}
        size="sm"
        className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-75 rounded-full px-3 sm:px-4 py-2 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
      >
        <ChevronLeft className="w-3 h-3 sm:w-4 sm:h-4" />
        <span className="hidden sm:inline">Prev</span>
      </Button>
      <Button
        onClick={goNext}
        size="sm"
        className="bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 shadow-sm hover:shadow-md transition-all duration-75 rounded-full px-3 sm:px-4 py-2 font-medium flex items-center gap-1 sm:gap-2 text-xs sm:text-sm"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4" />
      </Button>
    </div>
  );
}
