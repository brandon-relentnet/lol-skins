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
    <html lang="en" className="h-screen">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-linear-185 from-gradientTop from-30% via-[#0A1428] via-40% to-gradientBottom to-95% h-screen bg-fixed text-slate-50 overflow-hidden`}
      >
        <NavBar />
        <div className="relative mt-26 h-full">
          <div className="pointer-events-none absolute top-0 left-0 w-full h-15 bg-gradient-to-b from-[#030912] to-transparent z-10" />
          <main className="h-full overflow-y-auto">
            {children}
          </main>
        </div>
        <UserStats />
      </body>
    </html>
  );
}
