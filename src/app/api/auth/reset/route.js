// app/api/auth/reset/route.js
import pool from "@/lib/db.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

export async function POST(request) {
    try {
        const { token, newPassword } = await request.json();

        if (!token || !newPassword) {
            return NextResponse.json({ error: "Token and new password are required" }, { status: 400 });
        }

        // Find the user with the reset token.
        const userRes = await pool.query(
            "SELECT id, reset_token_expires FROM users WHERE reset_token = $1",
            [token]
        );
        if (userRes.rowCount === 0) {
            return NextResponse.json({ error: "Invalid reset token" }, { status: 400 });
        }
        const user = userRes.rows[0];

        // Check if the token is expired.
        if (new Date(user.reset_token_expires) < new Date()) {
            return NextResponse.json({ error: "Reset token has expired" }, { status: 400 });
        }

        // Hash the new password.
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(newPassword, saltRounds);

        // Update the user's password and clear the reset token fields.
        await pool.query(
            "UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2",
            [password_hash, user.id]
        );

        return NextResponse.json({ message: "Password has been reset successfully. You can now log in." });
    } catch (error) {
        console.error("Error resetting password:", error);
        return NextResponse.json({ error: "Failed to reset password" }, { status: 500 });
    }
}
