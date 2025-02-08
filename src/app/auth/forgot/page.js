"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setMessage("");
        try {
            const res = await fetch("/api/auth/forgot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Failed to request password reset");
            }
            setMessage(data.message);
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="container mx-auto p-4 pt-36">
            <h1 className="text-3xl font-bold mb-4">Forgot Password</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
                <label htmlFor="email" className="block font-medium">Email:</label>
                <input
                    type="email"
                    id="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="border px-2 py-1 w-full mb-4"
                    required
                />
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Request Reset
                </button>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
        </div>
    );
}
