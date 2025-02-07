// components/AuthButton.jsx
'use client';

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AuthButton() {
    const { data: session } = useSession();
    const router = useRouter();

    const handleClick = () => {
        if (session) {
            router.push("/account");
        } else {
            router.push("/auth/login");
        }
    };

    return (
        <button
            onClick={handleClick}
            className="absolute top-50 right-4 flex items-center justify-center w-12 h-12 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600"
            title={session ? "View Account" : "Log In"}
        >
            {session ? (
                // Logged in icon (user silhouette)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A7.969 7.969 0 0012 20a7.97 7.97 0 006.879-2.196M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
            ) : (
                // Not logged in icon (login arrow)
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14" />
                </svg>
            )}
        </button>
    );
}
