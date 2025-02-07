"use client"; // Ensure this runs in the browser

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ChampionPage() {
  const [champions, setChampions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    async function fetchChampions() {
      try {
        setLoading(true);
        setErrorMsg(null);

        // Fetch champions from the API
        const res = await fetch("/api/champions"); // ✅ Relative path works on the client-side

        if (!res.ok) {
          throw new Error(`Failed to fetch champions: ${res.statusText}`);
        }

        const data = await res.json();
        setChampions(data);
      } catch (err) {
        setErrorMsg(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchChampions();
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-linear-220 from-gradientTop via-[#0A1428] to-gradientBottom bg-fixed">
        <p className="text-3xl font-serif font-bold text-gold2">Stealing baron...</p>
      </div>
    );
  }

  if (errorMsg) {
    return <p className="text-red-500">Error: {errorMsg}</p>;
  }

  return (
    <div className="container mx-auto p-4 mt-36">
      <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">Champions</h1>
      <h2 className="text-xl mb-6 text-grey1">Click on a champion card to view and vote on their skins.</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-10">
        {champions.map((champion) => {
          const defaultSkin =
            champion.skins.find((skin) => skin.num === 0) || champion.skins[0];

          return (
            <li key={champion.id} className="bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150">
              <Link href={`/champions/${champion.id.toLowerCase()}`}>
                <div className="cursor-pointer">
                  <div className="relative w-full aspect-video">
                    <Image
                      src={defaultSkin.splash_url}
                      alt={`${champion.id} default skin`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col items-center justify-center p-4">
                    <h2 className="text-xl text-grey1">{champion.id}</h2>
                    <p className="text-grey2">{champion.title}</p>
                  </div>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
