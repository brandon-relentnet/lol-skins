"use client";

import { useEffect, useState } from "react";
import SkinCard from "@/components/SkinCard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { useRef } from "react";
import Dropdown from "@/components/Dropdown";

const sortOptions = [
    { value: "total_votes_desc", label: "Most Votes" },
    { value: "total_votes_asc", label: "Least Votes" },
    { value: "total_stars_desc", label: "Most Stars" },
    { value: "total_stars_asc", label: "Least Stars" },
    { value: "total_x_desc", label: "Most X" },
    { value: "total_x_asc", label: "Least X" },
];

export default function AwardsPage() {
    const nextSectionRef = useRef(null);

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
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-linear-220 from-gradientTop via-[#0A1428] to-gradientBottom bg-fixed">
                <p className="text-3xl font-serif font-bold text-gold2">Invading enemy jungle...</p>
            </div>
        );
    }
    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    // The sorted array for the "All skins" section
    const sortedSkins = getSortedSkins();

    return (
        <div className="container mx-auto p-4 my-26">
            {/* Hero Section */}
            <div className="h-screen w-full flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">
                    A<span className="italic">wards</span>
                </h1>
                <h2 className="text-2xl mb-16 text-grey1">
                    Wards? Vision? Map control? Oh wait—wrong guide. <br />
                    These a(wards) aren’t for vision score—they’re for the best (and worst) skins in League. <br />
                    The summoners have spoken. Check out the most legendary skins and the biggest disasters as voted by the community.
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

            {/* --- Top 10 Starred --- */}
            <section ref={nextSectionRef} className="scroll-mt-36 mb-36">
                <h2 className="text-4xl font-serif font-semibold mb-4 text-gold2">Top 10 Most Starred Skins</h2>
                <p className="text-lg text-grey1 mb-10">These skins aren’t just good—they’re <span className="italic">legendary</span>. The most beloved, the most iconic, and the ones summoners can’t get enough of.</p>
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
            <section className="mb-36">
                <h2 className="text-4xl font-serif font-semibold mb-4 text-gold2">Top 10 Most Banned Skins</h2>
                <p className="text-lg text-grey1 mb-10">Not every skin is a masterpiece. These are the ones players love to hate.</p>
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
            <section>
                <div className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-4xl font-serif font-semibold mb-4 text-gold2">All Skins</h2>
                        <p className="text-lg text-grey1">Every champion. Every style. Every era. Browse the full collection and sort to find your next favorite—or your next ban.</p>
                    </div>
                    <div>
                        <Dropdown
                            options={sortOptions}
                            onSelect={(value) => setSortBy(value)}
                            label={sortOptions.find(option => option.value === sortBy)?.label || "Sort By"}
                            selectedValue={sortBy}
                        />
                    </div>
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
        </div>
    );
}
