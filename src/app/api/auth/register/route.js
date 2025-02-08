// app/api/auth/register/route.js
import pool from "@/lib/db.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { resend } from "@/lib/resend"; // use our Resend instance
import { VerifyEmailTemplate } from "@/components/VerifyEmailTemplate";

export async function POST(request) {
    try {
        const { email, username, password } = await request.json();

        if (!email || !username || !password) {
            return NextResponse.json(
                { error: "Email, username, and password are required" },
                { status: 400 }
            );
        }

        // Check if a user with this email or username already exists.
        const emailCheck = await pool.query("SELECT id FROM users WHERE email = $1", [email]);
        if (emailCheck.rowCount > 0) {
            return NextResponse.json({ error: "A user with this email already exists" }, { status: 400 });
        }
        const usernameCheck = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
        if (usernameCheck.rowCount > 0) {
            return NextResponse.json({ error: "Username is already taken" }, { status: 400 });
        }

        // Hash the password.
        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        // Generate a verification token.
        const verification_token = randomUUID();

        // Insert the new user, with is_verified set to false.
        const result = await pool.query(
            `INSERT INTO users (email, username, password_hash, verification_token)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, is_verified, created_at`,
            [email, username, password_hash, verification_token]
        );
        const user = result.rows[0];

        // Build the verification link.
        const verificationLink = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/verify?token=${verification_token}`;

        // Send the verification email using Resend.
        await resend.emails.send({
            from: process.env.RESEND_FROM, // e.g. 'Verify <verify@skinbattle.lol>'
            to: [email], // Resend expects an array for the "to" field
            subject: "Verify Your Email Address",
            react: VerifyEmailTemplate({ username, verificationLink }),
        });

        return NextResponse.json(
            { message: "User created successfully. Please check your email to verify your account.", user },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user:", error);
        return NextResponse.json(
            { error: "Registration failed" },
            { status: 500 }
        );
    }
}
