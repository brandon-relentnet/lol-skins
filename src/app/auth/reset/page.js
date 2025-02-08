"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const router = useRouter();

    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");

    useEffect(() => {
        if (!token) {
            setErrorMsg("Reset token is missing.");
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setMessage("");
        try {
            const res = await fetch("/api/auth/reset", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to reset password");
            }
            setMessage(data.message);
            // Optionally, redirect to login after a short delay.
            setTimeout(() => router.push("/auth/login"), 3000);
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="container mx-auto p-4 pt-26 inset-0 flex flex-col items-center justify-center h-screen">
            <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">Reset Password</h1>
            {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
            {!errorMsg && (
                <form onSubmit={handleSubmit} className="max-w-lg w-full">
                    <label htmlFor="newPassword" className="block text-lg text-grey1 mb-1">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="bg-hextech-black/30 w-full border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-2 shadow-lg"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-4 shadow-lg"
                    >
                        Reset Password
                    </button>
                </form>
            )}
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
}
