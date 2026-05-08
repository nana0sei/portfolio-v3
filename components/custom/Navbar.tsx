"use client";
import logoB from "@/app/assets/logoB.png";
import logoW from "@/app/assets/logoW.png";
import { Switch } from "@/components/ui/switch";
import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import RecentlyPlayedCard from "./RecentlyPlayedCard";
import { useTheme } from "next-themes";
import { Button } from "../ui/button";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "light") setTheme("dark");
    else setTheme("light");
  };

  return (
    <nav className="w-full flex justify-center items-center gap-2 p-3 bg-background/10 backdrop-blur-3xl sticky top-0 z-10">
      <Link href="/">
        <Image
          src={theme === "light" ? logoB : logoW}
          alt="nana icon"
          width={50}
          height={50}
        />
      </Link>
      <RecentlyPlayedCard />
      <Button variant={"outline"} onClick={toggleTheme}>
        {theme === "light" ? <Sun size={20} /> : <Moon size={20} />}
      </Button>
    </nav>
  );
};

export default Navbar;
