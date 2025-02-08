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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Reset Password</h1>
            {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
            {!errorMsg && (
                <form onSubmit={handleSubmit} className="max-w-md">
                    <label htmlFor="newPassword" className="block font-medium">New Password:</label>
                    <input
                        type="password"
                        id="newPassword"
                        placeholder="Enter new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="border px-2 py-1 w-full mb-4"
                        required
                    />
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded"
                    >
                        Reset Password
                    </button>
                </form>
            )}
            {message && <p className="mt-4 text-green-600">{message}</p>}
        </div>
    );
}
