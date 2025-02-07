"use client";

import { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SkinCard from "@/components/SkinCard";

export default function UserVotesPage() {
    const nextSectionRef = useRef(null);

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

    if (loading) return (
        <div className="fixed inset-0 flex items-center justify-center bg-linear-220 from-gradientTop via-[#0A1428] to-gradientBottom bg-fixed">
            <p className="text-3xl font-serif font-bold text-gold2">Blaming the jungler...</p>
        </div>
    );
    if (errorMsg) return <p className="text-red-500">{errorMsg}</p>;

    // Separate into categories
    const upvoted = skins.filter((skin) => skin.user_vote === 1);
    const downvoted = skins.filter((skin) => skin.user_vote === -1);
    const starred = skins.filter((skin) => skin.user_star);
    const xed = skins.filter((skin) => skin.user_x);

    return (
        <div className="container mx-auto p-4 py-26">
            {/* Hero Section */}
            <div className="h-screen w-full flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">
                    Votes
                </h1>
                <h2 className="text-2xl mb-16 text-grey1">
                    Your votes are <span className="italic">godlike</span>. Every upvote, downvote, star, and ban contributes to the ultimate ranking of skins. <br />
                    View all the skins you’ve interacted with below.
                </h2>

                {/* Down Arrow */}
                <button
                    onClick={() => nextSectionRef.current.scrollIntoView({ behavior: "smooth" })}
                    className="animate-bounce cursor-pointer"
                    aria-label="Scroll down"
                >
                    <FontAwesomeIcon icon={faChevronDown} className="h-10 w-10 p-4 text-grey1 hover:text-gold2 transition duration-300" />
                </button>
            </div>

            {/* --- Starred --- */}
            <section ref={nextSectionRef} className="scroll-mt-36 mb-36">
                <h2 className="text-4xl font-serif font-semibold mb-10 text-gold2">Starred Skins</h2>
                {starred.length === 0 ? (
                    <p className="text-lg text-grey1">No starred skins yet!</p>
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
            <section className="mb-36">
                <h2 className="text-4xl font-serif font-semibold mb-10 text-gold2">Banned Skins</h2>
                {xed.length === 0 ? (
                    <p className="text-lg text-grey1">No banned skins yet!</p>
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
            <section className="mb-36">
                <h2 className="text-4xl font-serif font-semibold mb-10 text-gold2">Upvoted Skins</h2>
                {upvoted.length === 0 ? (
                    <p className="text-lg text-grey1">No upvoted skins yet!</p>
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
            <section>
                <h2 className="text-4xl font-serif font-semibold mb-10 text-gold2">Downvoted Skins</h2>
                {downvoted.length === 0 ? (
                    <p className="text-lg text-grey1">No downvoted skins yet!</p>
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
        </div>
    );
}
