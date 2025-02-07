// app/auth/login/page.jsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMsg("");
        const res = await signIn("credentials", {
            redirect: false,
            email,
            password,
        });
        if (res.error) {
            setErrorMsg(res.error);
        } else {
            router.push("/");
        }
    };

    return (
        <div className="container mx-auto pt-26">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label htmlFor="email" className="block font-medium">Email:</label>
                    <input
                        type="email"
                        id="email"
                        placeholder="user@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border px-2 py-1 w-full"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="password" className="block font-medium">Password:</label>
                    <input
                        type="password"
                        id="password"
                        placeholder="Your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="border px-2 py-1 w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                >
                    Sign In
                </button>
                <Link href="/auth/register" className="ml-4 text-blue-500 hover:underline">Register Here</Link>
            </form>
            {errorMsg && <p className="mt-4 text-red-600">{errorMsg}</p>}
        </div>
    );
}
