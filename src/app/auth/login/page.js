// app/auth/login/page.jsx
"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const searchParams = useSearchParams();
    const verified = searchParams.get("verified");
    const errorQuery = searchParams.get("error");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState(
        verified === "1" ? "Your account has been verified. You can now log in." : ""
    );
    const [errorMsg, setErrorMsg] = useState(
        errorQuery ? `Error: ${errorQuery}` : ""
    );
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
        <div className="container mx-auto p-4 pt-36">
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            {message && <p className="mb-4 text-green-600">{message}</p>}
            {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}
            <form onSubmit={handleSubmit} className="max-w-md">
                <div className="mb-4">
                    <label htmlFor="email" className="block font-medium">
                        Email:
                    </label>
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
                    <label htmlFor="password" className="block font-medium">
                        Password:
                    </label>
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
            </form>
            <Link href="/auth/register" className="mt-4 text-blue-500">Register</Link>
            <Link href="/auth/forgot" className="mt-4 text-blue-500">Forgot Password</Link>
        </div>
    );
}
