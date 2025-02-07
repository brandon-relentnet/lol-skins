import "./globals.css";
import NavBar from "@/components/Navbar";
import UserStats from "@/components/UserStats";
import ChampionSearch from "@/components/ChampionSearch";

export const metadata = {
  title: "Skin Battle",
  description: "Vote on your favorite LoL skins",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="bg-linear-220 from-gradientTop via-[#0A1428] to-gradientBottom bg-fixed">
      <body className={`antialiased min-h-screen`}>
        <NavBar />
        {children}
        <ChampionSearch />
        <UserStats />
      </body>
    </html>
  );
}
