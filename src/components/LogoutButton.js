// components/LogoutButton.jsx
"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
    const handleLogout = () => {
        // Optionally, you can pass a callbackUrl to redirect after sign out.
        signOut({ callbackUrl: "/" });
    };

    return (
        <button
            onClick={handleLogout}
            className="bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-4 shadow-lg"
        >
            Logout
        </button>
    );
}
