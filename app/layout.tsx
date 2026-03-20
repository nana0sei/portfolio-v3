import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Merriweather,
  Merriweather_Sans,
  Open_Sans,
  Roboto,
} from "next/font/google";
import "./globals.css";
import Provider from "./providers/Provider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

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
    <html lang="en" className={`${open_sans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Provider>
          <Navbar />

          <div className="h-screen overflow-y-scroll no-scrollbar space-y-2 px-2">
            {children}
          </div>
          <Footer />
        </Provider>
      </body>
    </html>
  );
}
