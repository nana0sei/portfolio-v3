"use client";
import { useEffect, useState } from "react";
import { BsFillMoonFill, BsSun } from "react-icons/bs";
import logoB from "@/app/assets/logoB.png";
import logoW from "@/app/assets/logoW.png";
import RecentlyPlayedCard from "./RecentlyPlayedCard";
import Link from "next/link";
import Image from "next/image";

const Navbar = () => {
  const [theme, setTheme] = useState("light");

  return (
    <nav className="w-full flex justify-between p-3 sticky top-0 z-10 bg-background">
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
        <input
          type="checkbox"
          className="toggle toggle-info"
          checked={theme === "light"}
          onChange={() => setTheme(theme === "dark" ? "light" : "dark")}
        />
        {theme === "light" ? (
          <BsSun size="20px" />
        ) : (
          <BsFillMoonFill size="15px" />
        )}
      </div>{" "}
    </nav>
  );
};

export default Navbar;
