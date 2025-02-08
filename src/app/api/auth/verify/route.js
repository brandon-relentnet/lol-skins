// app/api/auth/verify/route.js
import pool from "@/lib/db.js";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
        // Redirect to an error page or login with an error query parameter.
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/login?error=missing_token`);
    }

    try {
        // Find the user with this verification token.
        const userRes = await pool.query("SELECT id FROM users WHERE verification_token = $1", [token]);
        if (userRes.rowCount === 0) {
            return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/login?error=invalid_token`);
        }

        // Update the user: mark as verified and clear the verification token.
        await pool.query(
            "UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = $1",
            [token]
        );

        // Redirect to the login page with a query parameter indicating success.
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/login?verified=1`);
    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.redirect(`${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/login?error=verification_failed`);
    }
}
