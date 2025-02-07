// app/api/auth/register/route.js
import pool from "@/db.js";
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

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

        // Insert the new user, setting is_verified to false.
        const result = await pool.query(
            `INSERT INTO users (email, username, password_hash, verification_token)
       VALUES ($1, $2, $3, $4)
       RETURNING id, email, username, is_verified, created_at`,
            [email, username, password_hash, verification_token]
        );
        const user = result.rows[0];

        // In production, you would send an email with a verification link.
        // For now, we simply log the verification URL.
        console.log(
            `Verify your email by clicking on: ${process.env.NEXTAUTH_URL || "http://localhost:3000"}/api/auth/verify?token=${verification_token}`
        );

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
