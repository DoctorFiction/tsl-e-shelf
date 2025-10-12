import React from "react";

interface NobelApiStatusProps {
  isNobelBook: boolean;
  isLoading?: boolean;
  lastAction?: string;
}

export function NobelApiStatus({ isNobelBook, isLoading, lastAction }: NobelApiStatusProps) {
  if (!isNobelBook) {
    return null;
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-300 rounded-lg p-3 text-sm z-50">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
        <span className="font-medium text-blue-800">Nobel API Connected</span>
      </div>
      {isLoading && <div className="text-blue-600 mt-1">Loading...</div>}
      {lastAction && <div className="text-blue-600 mt-1 text-xs">Last: {lastAction}</div>}
    </div>
  );
}
