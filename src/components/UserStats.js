"use client";

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar, faBan } from '@fortawesome/free-solid-svg-icons';

export default function UserStats() {
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({ usedStars: 0, usedX: 0 });
    const [showTooltip, setShowTooltip] = useState(false);

    useEffect(() => {
        // Fetch once on mount
        fetchStats();

        // Listen for custom event from SkinCard
        const handleUpdate = () => {
            fetchStats(); // re-fetch stats when star/x changes or any vote happens
        };
        window.addEventListener("updateUserStats", handleUpdate);

        return () => {
            window.removeEventListener("updateUserStats", handleUpdate);
        };
    }, []);

    async function fetchStats() {
        try {
            setError(null);
            const res = await fetch("/api/user/stats", { credentials: "include", cache: "no-store" });
            // If the user is not logged in (401), set default stats.
            if (res.status === 401) {
                setStats({ usedStars: 0, usedX: 0 });
                return;
            }
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
        <div
            className="fixed bottom-4 right-4 z-50"
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
        >
            <div className="p-4 bg-gold2 text-blue5 cursor-default flex items-center w-44">
                {stats.usedStars}/3 <FontAwesomeIcon icon={faStar} className="px-2" />
                &nbsp;|&nbsp;
                <FontAwesomeIcon icon={faBan} className="px-2" /> {stats.usedX}/3
            </div>

            {/* Tooltip inside same container to prevent disappearing on hover */}
            {showTooltip && (
                <div className="absolute right-0 bottom-15 w-44 outline outline-gold2/30 p-2 bg-hextech-black text-gold1 text-sm shadow-md">
                    <p className="mb-1">• Stars = skins you absolutely love!</p>
                    <p>• Bans = skins you hate with a passion.</p>
                </div>
            )}
        </div>
    );
}
