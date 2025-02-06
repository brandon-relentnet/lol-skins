"use client";

import { useState, useEffect } from "react";

export default function UserStats() {
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ usedStars: 0, usedX: 0 });
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Fetch once on mount
        fetchStats();

        // Listen for custom event from SkinCard
        const handleUpdate = () => {
            fetchStats(); // re-fetch stats when star/x changes
        };
        window.addEventListener("updateUserStats", handleUpdate);

        return () => {
            window.removeEventListener("updateUserStats", handleUpdate);
        };
    }, []);

    async function fetchStats() {
        try {
            setError(null);

            const res = await fetch("/api/user/stats", { credentials: "include" });
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to fetch user stats");
            }
            const data = await res.json();
            setStats({
                usedStars: data.usedStars || 0,
                usedX: data.usedX || 0,
            });
        } catch (err) {
            console.error(err);
            setError(err.message);
        }
    }

    // If there's an error, you could hide this component or show a message
    if (error) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
                className="p-2 bg-gray-700 text-white rounded cursor-default"
            >
                {stats.usedStars}/3 ⭐ &nbsp;|&nbsp; {stats.usedX}/3 ❌
            </div>

            {/* Simple tooltip */}
            {showTooltip && (
                <div className="absolute right-0 bottom-12 w-48 p-2 bg-black text-white text-sm rounded shadow-md">
                    <p className="mb-1">• Stars = skins you absolutely love!</p>
                    <p>• X = skins you hate with a passion.</p>
                </div>
            )}
        </div>
    );
}
