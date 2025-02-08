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
        <div className="container mx-auto p-4 pt-26 inset-0 flex flex-col items-center justify-center h-screen">
            <h1 className="text-5xl font-bold font-serif mb-2 text-gold2">Login</h1>
            {message && <p className="mb-4 text-green-600">{message}</p>}
            {errorMsg && <p className="mb-4 text-red-600">{errorMsg}</p>}
            <form onSubmit={handleSubmit} className="max-w-lg w-full">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-lg text-grey1 mb-1">
                        Email:
                    </label>
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
                    <label htmlFor="password" className="block text-lg text-grey1 mb-1">
                        Password:
                    </label>
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
                        Sign In
                    </button>
                </div>
            </form>
            <Link href="/auth/register" className="bg-hextech-black/30 border-2 border-transparent outline-icon/30 outline -outline-offset-2 hover:border-icon hover:border-2 transition duration-150 font-serif text-grey1 hover:text-gold1 text-lg font-bold px-8 py-4 shadow-lg">Register</Link>
            <Link href="/auth/forgot" className="mt-4 text-grey2 hover:text-grey1 transition duration-150">Forgot Password</Link>
        </div>
    );
}
