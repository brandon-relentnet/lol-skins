// components/DeleteAccountButton.jsx
"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccountButton() {
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState("");

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
            return;
        }
        try {
            const res = await fetch("/api/auth/delete", {
                method: "DELETE",
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to delete account");
            }
            // After successful deletion, sign out.
            signOut({ callbackUrl: "/" });
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div>
            <button
                onClick={handleDelete}
                className="bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-4 shadow-lg"
            >
                Delete Account
            </button>
            {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
        </div>
    );
}
