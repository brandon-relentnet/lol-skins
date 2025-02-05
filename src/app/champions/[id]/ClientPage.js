"use client";

import { useEffect, useState } from "react";
import SkinCard from "@/components/SkinCard";

export default function ClientPage({ championId }) {
    const [champion, setChampion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        async function fetchChampion() {
            try {
                setLoading(true);
                setErrorMsg(null);

                // Make sure to include credentials so the user’s browser
                // will accept the `Set-Cookie` from the server.
                const res = await fetch(`/api/champions/${championId}`, {
                    credentials: "include",
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || `Failed to fetch champion ${championId}`);
                }

                const data = await res.json();
                setChampion(data);
            } catch (err) {
                setErrorMsg(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchChampion();
    }, [championId]);

    if (loading) {
        return <p>Loading Champion...</p>;
    }

    if (errorMsg) {
        return <p className="text-red-500">Error: {errorMsg}</p>;
    }

    if (!champion) {
        return <p>No champion data found.</p>;
    }

    return (
        <>
            <h1 className="text-3xl font-bold">
                {champion.id} - {champion.title}
            </h1>
            <p className="mt-2 text-gray-700">{champion.lore}</p>

            <h2 className="mt-6 text-2xl font-bold">Skins</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {champion.skins.map((skin) => (
                    <SkinCard
                        key={skin.id}
                        skin={skin}
                        championId={champion.id}
                        userId={"Set-by-cookie-in-the-server"} // Not strictly needed if your /api/votes handles it
                        initialVote={skin.user_vote ?? 0}
                        initialStar={skin.user_star ?? false}
                        initialX={skin.user_x ?? false}
                    />
                ))}
            </div>
        </>
    );
}
