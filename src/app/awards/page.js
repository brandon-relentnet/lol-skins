// app/awards/page.js
"use client";

import { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react"; // import useSession
import SkinCard from "@/components/SkinCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
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

    const { data: session, status } = useSession();
    const isAuthenticated = status === "authenticated";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data from API
    const [topStarred, setTopStarred] = useState([]);
    const [topXed, setTopXed] = useState([]);
    const [allSkins, setAllSkins] = useState([]);

    // Sorting controls
    const [sortBy, setSortBy] = useState("total_votes_desc");

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 24; // Adjust as needed

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

    useEffect(() => {
        setCurrentPage(1);
    }, [sortBy]);

    function getSortedSkins() {
        const sorted = [...allSkins];
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
            default:
                break;
        }
        return sorted;
    }

    if (loading) {
        return (
            <div className="fixed inset-0 flex items-center justify-center bg-linear-220 from-gradientTop via-[#0A1428] to-gradientBottom bg-fixed">
                <p className="text-3xl font-serif font-bold text-gold2">
                    Invading enemy jungle...
                </p>
            </div>
        );
    }
    if (error) {
        return <p className="text-red-500">Error: {error}</p>;
    }

    const sortedSkins = getSortedSkins();
    const totalPages = Math.ceil(sortedSkins.length / itemsPerPage);
    const indexOfLastSkin = currentPage * itemsPerPage;
    const indexOfFirstSkin = indexOfLastSkin - itemsPerPage;
    const currentSkins = sortedSkins.slice(indexOfFirstSkin, indexOfLastSkin);

    return (
        <div className="container mx-auto p-4 my-26">
            {/* Hero Section */}
            <div className="h-screen w-full flex flex-col items-center justify-center text-center">
                <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">
                    A<span className="italic">wards</span>
                </h1>
                <h2 className="text-2xl mb-16 text-grey1 italic">
                    These a(wards) aren’t for vision—they’re for the best (and worst) skins in League.
                    The summoners have spoken.
                </h2>
                <button
                    onClick={() => nextSectionRef.current.scrollIntoView({ behavior: "smooth" })}
                    className="animate-bounce cursor-pointer"
                    aria-label="Scroll down"
                >
                    <FontAwesomeIcon
                        icon={faChevronDown}
                        className="h-10 w-10 p-4 text-grey1 hover:text-gold2 transition duration-300"
                    />
                </button>
            </div>

            {/* Top 10 Starred Section */}
            <section ref={nextSectionRef} className="scroll-mt-36 mb-36">
                <h2 className="text-4xl font-serif font-semibold mb-4 text-gold2">
                    Top 10 Most Starred Skins
                </h2>
                <p className="text-lg text-grey1 mb-10">
                    These skins are legendary. The most beloved, the most iconic.
                </p>
                {topStarred.length === 0 ? (
                    <p>No data yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {topStarred.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                isAuthenticated={isAuthenticated} // Pass it here!
                                initialVote={skin.user_vote ?? 0}
                                initialStar={skin.user_star ?? false}
                                initialX={skin.user_x ?? false}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* Top 10 X'ed Section */}
            <section className="mb-36">
                <h2 className="text-4xl font-serif font-semibold mb-4 text-gold2">
                    Top 10 Most Banned Skins
                </h2>
                <p className="text-lg text-grey1 mb-10">
                    Not every skin is a masterpiece. These are the ones players love to hate.
                </p>
                {topXed.length === 0 ? (
                    <p>No data yet.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {topXed.map((skin) => (
                            <SkinCard
                                key={skin.id}
                                skin={skin}
                                championId={skin.champion_id}
                                isAuthenticated={isAuthenticated}
                                initialVote={skin.user_vote ?? 0}
                                initialStar={skin.user_star ?? false}
                                initialX={skin.user_x ?? false}
                            />
                        ))}
                    </div>
                )}
            </section>

            {/* All Skins Section */}
            <section>
                <div className="mb-10 flex justify-between items-center">
                    <div>
                        <h2 className="text-4xl font-serif font-semibold mb-4 text-gold2">All Skins</h2>
                        <p className="text-lg text-grey1">
                            Browse the full collection.
                        </p>
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
                    <p className="text-lg text-grey1">No skins found.</p>
                ) : (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {currentSkins.map((skin) => (
                                <SkinCard
                                    key={skin.id}
                                    skin={skin}
                                    championId={skin.champion_id}
                                    isAuthenticated={isAuthenticated}
                                    initialVote={skin.user_vote ?? 0}
                                    initialStar={skin.user_star ?? false}
                                    initialX={skin.user_x ?? false}
                                />
                            ))}
                        </div>
                        <div className="mt-8 flex justify-center items-center space-x-4">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="cursor-pointer bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-4 shadow-lg disabled:opacity-50"
                            >
                                Previous
                            </button>
                            <span className="text-lg text-grey1">
                                Page {currentPage} of {totalPages}
                            </span>
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="cursor-pointer bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-4 shadow-lg disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
}
