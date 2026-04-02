"use client";
import logoB from "@/app/assets/logoB.png";
import logoW from "@/app/assets/logoW.png";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RecentlyPlayedCard from "./RecentlyPlayedCard";
import { useTheme } from "next-themes";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  return (
    <nav className="w-full flex justify-between items-center p-3 bg-background/10 backdrop-blur-3xl sticky top-0 z-10">
      <Link href="/">
        <Image
          src={theme === "light" ? logoB : logoW}
          alt="nana icon"
          width={50}
          height={50}
        />
      </Link>
      <RecentlyPlayedCard />
      <div className="flex items-center gap-1">
        <Switch
          checked={theme === "light"}
          onCheckedChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        />

        {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
      </div>{" "}
    </nav>
  );
};

export default Navbar;
