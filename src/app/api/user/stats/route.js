// app/api/user/stats/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import pool from '@/lib/db.js';

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    try {
        const query = `
      SELECT
        SUM(CASE WHEN star THEN 1 ELSE 0 END) AS used_stars,
        SUM(CASE WHEN x THEN 1 ELSE 0 END) AS used_x
      FROM user_skin_votes
      WHERE user_id = $1
    `;
        const result = await pool.query(query, [userId]);
        const row = result.rows[0] || {};
        const usedStars = parseInt(row.used_stars, 10) || 0;
        const usedX = parseInt(row.used_x, 10) || 0;

        return NextResponse.json({ usedStars, usedX });
    } catch (err) {
        console.error('Failed to fetch user stats:', err);
        return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
    }
}
