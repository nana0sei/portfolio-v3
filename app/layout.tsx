import Navbar from "@/components/custom/Navbar";
import type { Metadata } from "next";
import { Open_Sans } from "next/font/google";
import Footer from "../components/custom/Footer";
import "./globals.css";
import Provider from "./providers/Provider";

const open_sans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Nana Osei",
  description: "Nana Osei's Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${open_sans.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Provider>
          <Navbar />

          <div className="flex-1 no-scrollbar space-y-2 px-2">{children}</div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
