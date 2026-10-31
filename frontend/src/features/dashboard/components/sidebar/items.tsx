import { IoFolderOutline, IoStarOutline } from "react-icons/io5";

export const sidebarItems = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: IoFolderOutline,
  },
  {
    id: "videos",
    label: "Videos",
    href: "/videos",
    icon: IoStarOutline,
    badge: "3",
  },
];

export const sections = [
  {
    title: "Files",
    items: sidebarItems,
  },
];
