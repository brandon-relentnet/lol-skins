import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/Navbar";
import UserStats from "@/components/UserStats";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Skin Battle",
  description: "Vote on your favorite LoL skins",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-linear-220 from-gradientTop via-[#0A1428] to-gradientBottom bg-fixed">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen`}>
        <NavBar />
        {children}
        <UserStats />
      </body>
    </html>
  );
}
