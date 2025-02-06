"use client";

import { useState, useEffect } from 'react';

export default function SkinCard({ skin, championId, initialVote, initialStar, initialX }) {
    const [totals, setTotals] = useState({
        total_votes: skin.total_votes || 0,
        total_stars: skin.total_stars || 0,
        total_x: skin.total_x || 0,
    });
    const [userVote, setUserVote] = useState(initialVote ?? 0);
    const [userStar, setUserStar] = useState(initialStar ?? false);
    const [userX, setUserX] = useState(initialX ?? false);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState(null);
    const [successMsg, setSuccessMsg] = useState(null);

    // 🛠 **Ensure UI updates when props change**
    useEffect(() => {
        setUserVote(initialVote);
        setUserStar(initialStar);
        setUserX(initialX);
    }, [initialVote, initialStar, initialX]);

    const sendVote = async (vote, star, x) => {
        setLoading(true);
        setErrorMsg(null);
        setSuccessMsg(null);
        try {
            const res = await fetch('/api/votes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ skinId: skin.id, vote, star, x }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || 'Vote failed');
            }
            setSuccessMsg(data.message);
            if (data.totals) {
                setTotals(data.totals);
            }
            if ((star !== userStar) || (x !== userX)) {
                window.dispatchEvent(new CustomEvent("updateUserStats"));
            }
        } catch (err) {
            setErrorMsg(err.message);
        } finally {
            setLoading(false);
        }
    };

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
        <div className="rounded p-2 bg-slate-900 hover:bg-slate-800 transition duration-150">
            <img
                src={skin.splash_url}
                alt={`${championId} ${skin.name}`}
                className="w-full h-auto rounded"
            />
            <p className="mt-2 text-center font-bold">{skin.name}</p>
            <div className="flex justify-around mt-2">
                <button onClick={handleUpvote} disabled={loading} className={`px-2 py-1 rounded ${userVote === 1 ? 'bg-green-700' : 'bg-green-500'}`}>
                    {userVote === 1 ? 'Upvoted' : 'Upvote'}
                </button>
                <button onClick={handleDownvote} disabled={loading} className={`px-2 py-1 rounded ${userVote === -1 ? 'bg-red-700' : 'bg-red-500'}`}>
                    {userVote === -1 ? 'Downvoted' : 'Downvote'}
                </button>
                <button onClick={handleStar} disabled={loading} className={`px-2 py-1 rounded ${userStar ? 'bg-yellow-700' : 'bg-yellow-500'}`}>
                    {userStar ? 'Starred' : '⭐'}
                </button>
                <button onClick={handleX} disabled={loading} className={`px-2 py-1 rounded ${userX ? 'bg-gray-700' : 'bg-gray-500'}`}>
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
