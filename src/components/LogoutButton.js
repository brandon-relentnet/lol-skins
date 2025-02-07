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
            className="bg-blue-500 text-white px-4 py-2 rounded"
        >
            Logout
        </button>
    );
}
