// components/SkinCard.jsx
'use client';

import { useState } from 'react';

export default function SkinCard({ skin, championId, userId, initialVote, initialStar, initialX }) {
    // Initialize aggregate totals (from the skin record)
    const [totals, setTotals] = useState({
        total_votes: skin.total_votes || 0,
        total_stars: skin.total_stars || 0,
        total_x: skin.total_x || 0,
    });

    // Initialize the user’s vote state based on the initial data.
    const [userVote, setUserVote] = useState(initialVote);
    const [userStar, setUserStar] = useState(initialStar);
    const [userX, setUserX] = useState(initialX);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // Send the current vote state to the API.
    const sendVote = async (vote, star, x) => {
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            const res = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skinId: skin.id, userId, vote, star, x }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Vote failed');
            }
            setSuccessMsg(data.message);
            if (data.totals) {
                setTotals(data.totals);
            }
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Button handlers toggle and send the updated vote state.
    const handleUpvote = () => {
        const newVote = userVote === 1 ? 0 : 1;
        setUserVote(newVote);
        sendVote(newVote, userStar, userX);
    };

    const handleDownvote = () => {
        const newVote = userVote === -1 ? 0 : -1;
        setUserVote(newVote);
        sendVote(newVote, userStar, userX);
    };

    const handleStar = () => {
        const newStar = !userStar;
        setUserStar(newStar);
        sendVote(userVote, newStar, userX);
    };

    const handleX = () => {
        const newX = !userX;
        setUserX(newX);
        sendVote(userVote, userStar, newX);
    };

    return (
        <div className="border rounded p-2">
            <img
                src={skin.splash_url}
                alt={`${championId} ${skin.name}`}
                className="w-full h-auto rounded"
            />
            <p className="mt-2 text-center font-bold">{skin.name}</p>
            <div className="flex justify-around mt-2">
                <button
                    onClick={handleUpvote}
                    disabled={loading}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                >
                    {userVote === 1 ? 'Upvoted' : 'Upvote'}
                </button>
                <button
                    onClick={handleDownvote}
                    disabled={loading}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                >
                    {userVote === -1 ? 'Downvoted' : 'Downvote'}
                </button>
                <button
                    onClick={handleStar}
                    disabled={loading}
                    className="bg-yellow-500 text-white px-2 py-1 rounded"
                >
                    {userStar ? 'Starred' : '⭐'}
                </button>
                <button
                    onClick={handleX}
                    disabled={loading}
                    className="bg-gray-500 text-white px-2 py-1 rounded"
                >
                    {userX ? 'Xed' : '❌'}
                </button>
            </div>
            <div className="mt-2 text-center">
                <p>Total Votes: {totals.total_votes}</p>
                <p>Total Stars: {totals.total_stars}</p>
                <p>Total X's: {totals.total_x}</p>
            </div>
            {errorMsg && <p className="text-red-500 text-center mt-2">{errorMsg}</p>}
            {successMsg && <p className="text-green-500 text-center mt-2">{successMsg}</p>}
        </div>
    );
}
