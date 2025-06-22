export interface MenuItem {
  label: string;
  href: string;
}

export const menuItems: MenuItem[] = [
  {
    label: "Ana Sayfa",
    href: "/",
  },
  {
    label: "Kitaplar",
    href: "/books",
  },
];
