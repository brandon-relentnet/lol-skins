// app/api/auth/verify/route.js
import pool from "@/db.js";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
        return NextResponse.json({ error: "Verification token is required" }, { status: 400 });
    }

    try {
        // Find the user with this verification token.
        const userRes = await pool.query("SELECT id FROM users WHERE verification_token = $1", [token]);
        if (userRes.rowCount === 0) {
            return NextResponse.json({ error: "Invalid or expired verification token" }, { status: 400 });
        }

        // Update the user: mark as verified and clear the verification token.
        await pool.query(
            "UPDATE users SET is_verified = true, verification_token = NULL WHERE verification_token = $1",
            [token]
        );

        return NextResponse.json({ message: "Email verified successfully. You can now log in." });
    } catch (error) {
        console.error("Error verifying email:", error);
        return NextResponse.json({ error: "Email verification failed" }, { status: 500 });
    }
}
