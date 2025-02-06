"use client";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faArrowDown, faStar, faBan } from '@fortawesome/free-solid-svg-icons';

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
        <div className="bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150">
            <img
                src={skin.splash_url}
                alt={`${championId} ${skin.name}`}
                className="w-full h-auto"
            />
            <p className="text-xl text-grey1 text-center pt-4">{skin.name}</p>
            <div className="flex justify-evenly items-center p-4">
                <div className="flex justify-center items-center space-x-2">
                    <div className='mr-2 text-gold1 font-bold text-2xl mb-1'>
                        {totals.total_votes}
                    </div>
                    <button onClick={handleUpvote} disabled={loading} className={`cursor-pointer p-1`}>
                        <FontAwesomeIcon
                            icon={faArrowUp}
                            className={`${userVote === 1 ? 'text-gold3' : 'text-grey2'} hover:text-gold3 hover:scale-105 transition duration-150`}
                        />
                    </button>
                    <button onClick={handleDownvote} disabled={loading} className={`cursor-pointer p-1`}>
                        <FontAwesomeIcon
                            icon={faArrowDown}
                            className={`${userVote === -1 ? 'text-gold3' : 'text-grey2'} hover:text-gold3 hover:scale-105 transition duration-150`}
                        />
                    </button>
                </div>
                <div className="flex justify-center items-center space-x-2">
                    <div className='mr-2 text-gold1 font-bold text-2xl mb-1'>
                        {totals.total_stars}
                    </div>
                    <button onClick={handleStar} disabled={loading} className={`cursor-pointer p-1`}>
                        <FontAwesomeIcon
                            icon={faStar}
                            className={`${userStar ? 'text-gold3' : 'text-grey2'} hover:text-gold3 hover:scale-105 transition duration-150`}
                        />
                    </button>
                </div>
                <div className="flex justify-center items-center space-x-2">
                    <div className='mr-2 text-gold1 font-bold text-2xl mb-1'>
                        {totals.total_x}
                    </div>
                    <button onClick={handleX} disabled={loading} className={`cursor-pointer p-1`}>
                        <FontAwesomeIcon
                            icon={faBan}
                            className={`${userX ? 'text-gold3' : 'text-grey2'} hover:text-gold3 hover:scale-105 transition duration-150`}
                        />
                    </button>
                </div>
            </div>
            {errorMsg && <p className="text-red-500 text-center mt-2">{errorMsg}</p>}
        </div>
    );
}
