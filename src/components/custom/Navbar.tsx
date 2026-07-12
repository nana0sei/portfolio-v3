import logoB from "@/assets/logoB.png";
import logoW from "@/assets/logoW.png";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import RecentlyPlayedCard from "./RecentlyPlayedCard";

const Navbar = () => {
  const { theme, setTheme } = useTheme();

  // Avoid a hydration mismatch: next-themes only knows the real theme on the
  // client. Render the light-mode appearance (the legacy default) on the server
  // and first paint, then reconcile once mounted.
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const current = mounted ? theme : "light";

  const toggleTheme = () => {
    if (current === "light") setTheme("dark");
    else setTheme("light");
  };

  return (
    <nav className="w-full flex justify-center items-center gap-2 p-3 bg-background/10 backdrop-blur-2xl sticky top-2 rounded-lg z-10">
      <Link to="/">
        <img
          src={current === "light" ? logoB : logoW}
          alt="nana icon"
          width={50}
          height={50}
        />
      </Link>
      <RecentlyPlayedCard />
      <Button variant={"outline"} onClick={toggleTheme}>
        {current === "light" ? <Moon size={20} /> : <Sun size={20} />}
      </Button>
    </nav>
  );
};

export default Navbar;
