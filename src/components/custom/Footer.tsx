import { FaInstagram } from "react-icons/fa";
import { IoIosMail } from "react-icons/io";

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <>
      <footer className="flex flex-col items-center w-full p-2 bg-background">
        <div className="divider">© {year} Nana Osei</div>
        <div className="flex items-center justify-center gap-2">
          {links.map((link) => (
            <a
              href={link.href}
              target="_blank"
              rel="noreferrer"
              key={link.href}
              className="hover:text-blue-500 transition-colors"
            >
              {link.icon}
            </a>
          ))}
        </div>
      </footer>
    </>
  );
};

export default Footer;

const links = [
  { href: "mailto:01nanaosei@gmail.com", icon: <IoIosMail size="30px" /> },
  {
    href: "https://instagram.com/nana0sei/",
    icon: <FaInstagram size="25px" />,
  },
];
