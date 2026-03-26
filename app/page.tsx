import dev from "@/app//assets/dev.png";
import art from "@/app/assets/art.png";
import LoopingText from "@/components/custom/LoopingText";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <div className="space-y-3">
        <div className="flex flex-col justify-center items-center space-y-1 text-center">
          <div className="gap-1 text-xl md:text-4xl font-bold">
            hi, my name is <span className="italic text-yellow-400">nana.</span>{" "}
            i'm a <LoopingText />
          </div>
          <div className="text-sm">
            i create intuitive and functional experiences which reflect all of
            my interests. check out my work below!
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {links.map((link) => (
            <div className="flex justify-center" key={link.href}>
              <Link href={link.href}>
                <Image
                  src={link.icon}
                  alt="link icon"
                  width={500}
                  height={500}
                  className="hover:scale-90 transition-transform"
                  loading="eager"
                />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

const links = [
  { href: "/dev", icon: dev },
  { href: "/art", icon: art },
];
