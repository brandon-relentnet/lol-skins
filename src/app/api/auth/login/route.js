// app/api/auth/login/route.js
import pool from '@/db.js';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json(
                { error: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Query the user by email.
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rowCount === 0) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 400 }
            );
        }

        const user = result.rows[0];

        // Compare the provided password with the stored hash.
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return NextResponse.json(
                { error: 'Invalid email or password' },
                { status: 400 }
            );
        }

        // (Optionally generate a JWT or session token here.)
        return NextResponse.json({
            message: 'Login successful',
            user: { id: user.id, email: user.email, created_at: user.created_at }
        });
    } catch (error) {
        console.error('Error logging in user:', error);
        return NextResponse.json(
            { error: 'Login failed' },
            { status: 500 }
        );
    }
}
