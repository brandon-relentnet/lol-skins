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
                className="bg-red-500 text-white px-4 py-2 rounded"
            >
                Delete Account
            </button>
            {errorMsg && <p className="text-red-500 mt-2">{errorMsg}</p>}
        </div>
    );
}
