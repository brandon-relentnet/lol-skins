import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';
import pool from '@/db.js';

export async function GET() {
    const cookieStore = await cookies();
    let anonymousCookie = cookieStore.get('anonymousId');
    let userId;

    if (!anonymousCookie) {
        // Generate a new anonymousId if not present
        userId = randomUUID();
    } else {
        userId = anonymousCookie.value;
    }

    try {
        // Count how many star and X the user has used.
        // This assumes each user can have at most 3 of each, as per your requirement.
        const query = `
      SELECT
        SUM(CASE WHEN star THEN 1 ELSE 0 END) AS used_stars,
        SUM(CASE WHEN x    THEN 1 ELSE 0 END) AS used_x
      FROM user_skin_votes
      WHERE user_id = $1
    `;
        const result = await pool.query(query, [userId]);
        const row = result.rows[0] || {};
        const usedStars = parseInt(row.used_stars, 10) || 0;
        const usedX = parseInt(row.used_x, 10) || 0;

        // Build the response
        const response = NextResponse.json({ usedStars, usedX });

        // If we just created a userId, set it in a cookie so it persists.
        if (!anonymousCookie) {
            response.cookies.set('anonymousId', userId, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
            });
        }
        return response;
    } catch (err) {
        console.error('Failed to fetch user stats:', err);
        return NextResponse.json({ error: 'Failed to fetch user stats' }, { status: 500 });
    }
}
