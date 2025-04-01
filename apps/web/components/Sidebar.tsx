"use client";

import Link from "next/link";
import { Mail, Lock, Settings2, Logs } from "lucide-react";
import { Button } from "./ui/button";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import UserProfile from "./UserProfile";

const item = [
  {
    icon: <Mail />,
    title: "Email",
    link: "/emails",
  },
  {
    icon: <Lock />,
    title: "API keys",
    link: "/apikeys",
  },
  {
    icon: <Logs />,
    title: "Logs",
    link: "/logs",
  },
  {
    icon: <Settings2 />,
    title: "Settings",
    link: "/settings",
  }
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <>
      <div className="h-8">
        <Button variant={"secondary"}>Priyanshu Team</Button>
      </div>
      <nav className="mt-8 flex-1">
        <ul>
          {item.map((item) => (
            <li key={item.title}>
              <Link
                href={item.link}
                className={clsx("flex h-10 items-center my-2 gap-2 rounded-md px-2 text-sm text-slate-11 hover:bg-secondary/80", pathname === item.link && "bg-secondary/80")}
              >
                <div className="text-sm opacity-80 invert dark:invert-0 ">
                  {item?.icon}
                </div>
                {item.title}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <UserProfile/>
    </>
  );
}
