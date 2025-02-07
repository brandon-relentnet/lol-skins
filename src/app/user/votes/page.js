"use client";

import { useEffect, useState } from "react";
import SkinCard from "@/components/SkinCard";

export default function UserVotesPage() {
    const [skins, setSkins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    // Fetch all user votes on mount
    useEffect(() => {
        async function fetchVotes() {
            try {
                setLoading(true);
                setErrorMsg(null);

                // Must include credentials so the user’s browser sends/receives the cookie
                const res = await fetch("/api/user/votes", {
                    credentials: "include",
                });

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to fetch user votes");
                }

                const data = await res.json();
                setSkins(data.skins || []);
            } catch (err) {
                setErrorMsg(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchVotes();
    }, []);

    if (loading) return <p>Loading your votes...</p>;
    if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

    // Separate into categories
    const upvoted = skins.filter((skin) => skin.user_vote === 1);
    const downvoted = skins.filter((skin) => skin.user_vote === -1);
    const starred = skins.filter((skin) => skin.user_star);
    const xed = skins.filter((skin) => skin.user_x);

    return (
        <>
            <h1 className="text-3xl font-bold">Your Votes</h1>
            
            {/* --- Starred --- */}
            <section className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">Starred Skins</h2>
                {starred.length === 0 ? (
                    <p>No starred skins yet!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {starred.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                initialVote={skin.user_vote}
                                initialStar={skin.user_star}
                                initialX={skin.user_x}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* --- X'ed --- */}
            <section className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">X'ed Skins</h2>
                {xed.length === 0 ? (
                    <p>No X'ed skins yet!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {xed.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                initialVote={skin.user_vote}
                                initialStar={skin.user_star}
                                initialX={skin.user_x}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* --- Upvoted --- */}
            <section className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">Upvoted Skins</h2>
                {upvoted.length === 0 ? (
                    <p>No upvoted skins yet!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {upvoted.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                // userId not strictly needed, the server deduces from cookie
                                initialVote={skin.user_vote}
                                initialStar={skin.user_star}
                                initialX={skin.user_x}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* --- Downvoted --- */}
            <section className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">Downvoted Skins</h2>
                {downvoted.length === 0 ? (
                    <p>No downvoted skins yet!</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {downvoted.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                initialVote={skin.user_vote}
                                initialStar={skin.user_star}
                                initialX={skin.user_x}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
