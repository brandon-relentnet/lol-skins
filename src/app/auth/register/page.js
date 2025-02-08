// app/auth/register/page.jsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        setMessage("");
        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });
            const data = await res.json();
            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }
            setMessage("Registration successful, please log in.");
            router.push("/auth/login");
        } catch (error) {
            setErrorMsg(error.message);
        }
    };

    return (
        <div className="container mx-auto p-4 pt-26 inset-0 flex flex-col items-center justify-center h-screen">
            <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">Register</h1>
            <form onSubmit={handleSubmit} className="max-w-lg w-full">
                <div className="mb-4">
                    <label htmlFor="username" className="block text-lg text-grey1 mb-1">Username:</label>
                    <input
                        type="username"
                        id="username"
                        placeholder="Your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-hextech-black/30 w-full border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-2 shadow-lg"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-lg text-grey1 mb-1">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-hextech-black/30 w-full border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-2 shadow-lg"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label htmlFor="password" className="block text-lg text-grey1 mb-1">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="bg-hextech-black/30 w-full border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-2 shadow-lg"
                        required
                    />
                </div>
                <div className="mb-14 text-center">
                    <button
                        type="submit"
                        className="bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-4 shadow-lg"
                    >
                        Register
                    </button>
                </div>
            </form>
            {message && <p className="mt-4 text-green-600">{message}</p>}
            {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
        </div>
    );
}
