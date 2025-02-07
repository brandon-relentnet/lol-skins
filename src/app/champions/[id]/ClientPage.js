"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import SkinCard from "@/components/SkinCard";

export default function ClientPage({ championId }) {
    // useSession is a client-side hook that returns the current session data.
    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    const [champion, setChampion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        async function fetchChampion() {
            try {
                setLoading(true);
                setErrorMsg(null);

                // Include credentials so cookies (for NextAuth session) are sent.
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
        return (
            <div className="fixed inset-0 flex items-center justify-center">
                <p className="text-3xl font-serif font-bold">Loading...</p>
            </div>
        );
    }

    if (errorMsg) {
        return <p className="text-red-500">Error: {errorMsg}</p>;
    }

    if (!champion) {
        return <p>No champion data found.</p>;
    }

    return (
        <>
            <div className="flex items-center space-x-6 mb-2">
                <h1 className="text-5xl font-bold font-serif text-gold2">{champion.id}</h1>
                <h2 className="text-xl text-grey2 italic">{champion.title}</h2>
            </div>
            <p className="mb-10 text-grey1">{champion.lore}</p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10">
                {champion.skins.map((skin) => (
                    <SkinCard
                        key={skin.id}
                        skin={skin}
                        championId={champion.id}
                        isAuthenticated={isAuthenticated}
                        initialVote={skin.user_vote ?? 0}
                        initialStar={skin.user_star ?? false}
                        initialX={skin.user_x ?? false}
                    />
                ))}
            </div>
        </>
    );
}
