"use client";

import { useEffect, useState } from "react";
import SkinCard from "@/components/SkinCard";

export default function AwardsPage() {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data from API
    const [topStarred, setTopStarred] = useState([]);
    const [topXed, setTopXed] = useState([]);
    const [allSkins, setAllSkins] = useState([]);

    // Sorting controls
    const [sortBy, setSortBy] = useState("total_votes_desc"); // or any default

    useEffect(() => {
        async function fetchAwards() {
            try {
                setLoading(true);
                setError(null);

                const res = await fetch("/api/awards", { credentials: "include" });
                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(data.error || "Failed to fetch awards");
                }
                const data = await res.json();
                setTopStarred(data.topStarred || []);
                setTopXed(data.topXed || []);
                setAllSkins(data.allSkins || []);
            } catch (err) {
                console.error(err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchAwards();
    }, []);

    // A function to return a sorted copy of allSkins based on sortBy
    function getSortedSkins() {
        const sorted = [...allSkins]; // copy
        switch (sortBy) {
            case "total_votes_desc":
                sorted.sort((a, b) => (b.total_votes || 0) - (a.total_votes || 0));
                break;
            case "total_votes_asc":
                sorted.sort((a, b) => (a.total_votes || 0) - (b.total_votes || 0));
                break;
            case "total_stars_desc":
                sorted.sort((a, b) => (b.total_stars || 0) - (a.total_stars || 0));
                break;
            case "total_stars_asc":
                sorted.sort((a, b) => (a.total_stars || 0) - (b.total_stars || 0));
                break;
            case "total_x_desc":
                sorted.sort((a, b) => (b.total_x || 0) - (a.total_x || 0));
                break;
            case "total_x_asc":
                sorted.sort((a, b) => (a.total_x || 0) - (b.total_x || 0));
                break;
            // Add more sorts if needed
            default:
                // default no sort or some other logic
                break;
        }
        return sorted;
    }

    if (loading) {
        return <p>Loading awards...</p>;
    }
    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    // The sorted array for the "All skins" section
    const sortedSkins = getSortedSkins();

    return (
        <>
            <h1 className="text-3xl font-bold">Awards</h1>

            {/* --- Top 10 Starred --- */}
            <section className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">Top 10 Most Starred Skins</h2>
                {topStarred.length === 0 ? (
                    <p>No data yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {topStarred.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                initialVote={skin.user_vote ?? 0}
                                initialStar={skin.user_star ?? false}
                                initialX={skin.user_x ?? false}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* --- Top 10 X'ed --- */}
            <section className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">Top 10 Most X'ed Skins</h2>
                {topXed.length === 0 ? (
                    <p>No data yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {topXed.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                initialVote={skin.user_vote ?? 0}
                                initialStar={skin.user_star ?? false}
                                initialX={skin.user_x ?? false}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* --- All skins with sorting --- */}
            <section className="mt-6">
                <h2 className="text-2xl font-semibold mb-2">All Skins</h2>
                <div className="mb-4">
                    <label className="mr-2">Sort By:</label>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="border border-gray-300 rounded p-1"
                    >
                        <option value="total_votes_desc">Most Votes</option>
                        <option value="total_votes_asc">Least Votes</option>
                        <option value="total_stars_desc">Most Stars</option>
                        <option value="total_stars_asc">Least Stars</option>
                        <option value="total_x_desc">Most X</option>
                        <option value="total_x_asc">Least X</option>
                    </select>
                </div>

                {sortedSkins.length === 0 ? (
                    <p>No skins found.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {sortedSkins.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                initialVote={skin.user_vote ?? 0}
                                initialStar={skin.user_star ?? false}
                                initialX={skin.user_x ?? false}
                            />
                        ))}
                    </div>
                )}
            </section>
        </>
    );
}
