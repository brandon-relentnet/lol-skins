// app/account/page.jsx
"use client";

import LogoutButton from "@/components/LogoutButton";
import DeleteAccountButton from "@/components/DeleteAccountButton";
import { useSession } from "next-auth/react";

export default function AccountPage() {
    const { data: session, status } = useSession();
    if (status === "loading") return <p>Loading...</p>;
    if (!session) return <p>You are not logged in.</p>;

    return (
        <div className="container mx-auto p-4 pt-26 inset-0 flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-serif font-semibold mb-4 text-gold2">Account</h1>
            <p className="text-lg text-grey1 mb-10">Email: {session.user.email}</p>
            {/* Other account details can be added here */}

            <div className="mt-4 space-y-4 contents">
                <LogoutButton />
                <DeleteAccountButton />
            </div>
        </div>
    );
}
