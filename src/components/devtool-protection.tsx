"use client";

import { useEffect } from "react";
import disableDevtool from "disable-devtool";

interface DevtoolProtectionProps {
  children: React.ReactNode;
}

/**
 * Wrapper component that disables developer tools using disable-devtool package
 * This provides comprehensive protection against console access in the reader
 */
export function DevtoolProtection({ children }: DevtoolProtectionProps) {
  useEffect(() => {
    // Only enable in production or if explicitly enabled in development
    const isProduction = process.env.NODE_ENV === "production";
    const isEnabled = process.env.NEXT_PUBLIC_ENABLE_DEVTOOL_PROTECTION === "true";

    if (!isProduction && !isEnabled) {
      return;
    }

    // Initialize disable-devtool with configuration
    disableDevtool({
      // Redirect immediately when devtools detected
      url: "/books/local",

      // Disable right-click context menu
      disableMenu: true,

      // Clear console when devtools are opened
      clearLog: true,
    });
  }, []);

  return <>{children}</>;
}
