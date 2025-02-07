// app/api/auth/delete/route.js
import pool from '@/db.js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function DELETE(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Now session.user.id should be defined.
    const numericUserId = parseInt(session.user.id, 10);
    if (isNaN(numericUserId)) {
        console.error("Invalid user id:", session.user.id);
        return NextResponse.json({ error: "Invalid user id" }, { status: 500 });
    }

    try {
        await pool.query("BEGIN");
        await pool.query("DELETE FROM user_skin_votes WHERE user_id = $1", [numericUserId]);
        const deleteResult = await pool.query("DELETE FROM users WHERE id = $1", [numericUserId]);
        if (deleteResult.rowCount === 0) {
            throw new Error(`User not found: ${numericUserId}`);
        }
        await pool.query("COMMIT");

        const response = NextResponse.json({ message: "Account deleted successfully" });
        response.cookies.delete("next-auth.session-token");
        response.cookies.delete("next-auth.csrf-token");
        return response;
    } catch (error) {
        await pool.query("ROLLBACK");
        console.error("Error deleting account:", error);
        return NextResponse.json({ error: "Failed to delete account" }, { status: 500 });
    }
}
