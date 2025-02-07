// components/ClientProviders.jsx
"use client";

import { SessionProvider } from "next-auth/react";

export default function ClientProviders({ children }) {
    return <SessionProvider>{children}</SessionProvider>;
}
