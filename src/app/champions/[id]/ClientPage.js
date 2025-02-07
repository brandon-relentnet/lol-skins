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
            <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">
                {champion.id} 
            </h1>
            <h2 className="text-xl mb-6 text-grey1">
                {champion.title}
            </h2>
            <p className="mb-10 text-grey2">{champion.lore}</p>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {champion.skins.map((skin) => (
                    console.log(skin),
                    <SkinCard
                        key={skin.id}
                        skin={skin}
                        championId={champion.id}
                        initialVote={skin.user_vote ?? 0}
                        initialStar={skin.user_star ?? false}
                        initialX={skin.user_x ?? false}
                    />
                ))}
            </div>
        </>
    );
}
