"use client";

import Link from "next/link";
import { Mail, Lock, Settings, Ellipsis } from "lucide-react";
import { Button } from "./ui/button";
import { useUser } from "@/context/userContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { usePathname } from "next/navigation";
import clsx from "clsx";

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
    icon: <Settings />,
    title: "Settings",
    link: "/settings",
  },
];

export default function Sidebar() {
  //Logged-in User Details
  const { user } = useUser();

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
      <Button
        variant={"secondary"}
        className="flex justify-between items-center"
      >
        <div className="flex gap-2 items-center">
          <div>
            <Avatar>
              <AvatarImage src={user?.userMetadata.avatarUrl} />
              <AvatarFallback className="uppercase text-white text-xl font-semibold">
                {user?.userMetadata.name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
          </div>
          <div>
            <span>{user?.userMetadata.name}</span>
          </div>
        </div>
        <div>
          <Ellipsis />
        </div>
      </Button>
    </>
  );
}
