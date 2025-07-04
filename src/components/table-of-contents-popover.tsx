import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Typography } from "@/components/ui/typography";
import { NavItem } from "epubjs";
import { List } from "lucide-react";

type EnhancedNavItem = NavItem & {
  page?: number;
  subitems?: EnhancedNavItem[];
};

interface TableOfContentsPopoverProps {
  toc: EnhancedNavItem[];
  goToHref: (href: string) => void;
}

export function TableOfContentsPopover({
  toc,
  goToHref,
}: TableOfContentsPopoverProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="ml-2 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border-2 border-gray-200 dark:border-gray-600 shadow-md hover:shadow-lg transition-all duration-75 rounded-lg"
          aria-label="Table of Contents"
          type="button"
        >
          <List className="w-4 h-4 text-black dark:text-white" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4" align="end" side="bottom">
        <div className="flex items-center justify-between mb-2">
          <Typography variant="body1" className="font-bold">
            Table of Contents
          </Typography>
        </div>
        <ul className="max-h-64 overflow-y-auto pr-2">
          {toc && toc.length > 0 ? (
            (toc as EnhancedNavItem[]).map((chapter, i) => (
              <Card
                key={i}
                className="flex flex-col px-4 py-2 gap-0.5 cursor-pointer hover:bg-muted transition mb-1"
                onClick={() => {
                  goToHref(chapter.href);
                }}
              >
                <div className="flex items-center justify-between">
                  <Typography variant="body2" className="font-medium flex-1">
                    {chapter.label}
                  </Typography>
                  {chapter.page && (
                    <Typography variant="caption" className="text-muted-foreground ml-2">
                      {chapter.page}
                    </Typography>
                  )}
                </div>
                {/* {chapter.subitems && chapter.subitems.length > 0 && (
              <div className="ml-4 mt-1">
                {(chapter.subitems as EnhancedNavItem[]).map((subchapter, j) => (
                  <div
                    key={j}
                    className="py-1 cursor-pointer hover:bg-muted/50 transition rounded px-2 flex items-center justify-between"
                    onClick={(e) => {
                      e.stopPropagation();
                      goToHref(subchapter.href);
                    }}
                  >
                    <Typography variant="caption" className="text-muted-foreground flex-1">
                      {subchapter.label}
                    </Typography>
                    {subchapter.page && (
                      <Typography variant="caption" className="text-muted-foreground/70 ml-2 text-xs">
                        {subchapter.page}
                      </Typography>
                    )}
                  </div>
                ))}
              </div>
            )} */}
              </Card>
            ))
          ) : (
            <Typography variant="body2" className="text-gray-400">
              No table of contents available.
            </Typography>
          )}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
