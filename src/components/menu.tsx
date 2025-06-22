"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { menuItems } from "../lib/menu-config";

export function Menu() {
  const pathname = usePathname();
  return (
    <>
      {menuItems.map((item) => (
        <li key={item.href}>
          <Button variant="link" className={`px-4 py-2 rounded-sm font-bold ${pathname === item.href ? "underline underline-offset-8 text-blue-700 dark:text-blue-300" : ""}`}>
            <Link href={item.href}>{item.label}</Link>
          </Button>
        </li>
      ))}
    </>
  );
}
