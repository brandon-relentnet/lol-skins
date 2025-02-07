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
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold">Account</h1>
            <p>Email: {session.user.email}</p>
            {/* Other account details can be added here */}

            <div className="mt-4 space-x-4">
                <LogoutButton />
                <DeleteAccountButton />
            </div>
        </div>
    );
}
