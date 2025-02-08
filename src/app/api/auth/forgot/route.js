// app/api/auth/forgot/route.js
import pool from "@/lib/db.js";
import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { resend } from "@/lib/resend";
import { ForgotPasswordEmail } from "@/components/emails/ForgotPasswordEmail";

export async function POST(request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: "Email is required" }, { status: 400 });
        }

        // Check if a user exists with this email.
        const userRes = await pool.query("SELECT id, username FROM users WHERE email = $1", [email]);
        if (userRes.rowCount === 0) {
            // To avoid revealing valid emails, you can always return a success message.
            return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." });
        }
        const user = userRes.rows[0];

        // Generate a reset token and expiry (1 hour from now).
        const reset_token = randomUUID();
        const reset_token_expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        // Update the user with the reset token and expiry.
        await pool.query(
            "UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE id = $3",
            [reset_token, reset_token_expires, user.id]
        );

        // Build the reset link.
        const resetLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/auth/reset?token=${reset_token}`;

        // Send the password reset email using Resend.
        await resend.emails.send({
            from: process.env.RESEND_FROM, // e.g. "Verify <verify@skinbattle.lol>"
            to: [email],
            subject: "Reset Your Password",
            // We render a React email template. Create a component below.
            react: ForgotPasswordEmail({ username: user.username, resetLink }),
            // Alternatively, you can provide plain HTML/text.
        });

        return NextResponse.json({ message: "If an account with that email exists, a reset link has been sent." });
    } catch (error) {
        console.error("Error in password reset request:", error);
        return NextResponse.json({ error: "Failed to request password reset" }, { status: 500 });
    }
}
