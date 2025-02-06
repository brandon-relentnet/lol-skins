// app/api/user/votes/route.js
import pool from '@/db.js';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

export async function GET() {
    const cookieStore = await cookies();
    let anonymousCookie = cookieStore.get('anonymousId');
    let userId;

    if (!anonymousCookie) {
        // Generate a new anonymousId if not present.
        userId = randomUUID();
    } else {
        userId = anonymousCookie.value;
    }

    try {
        // Query all skins that the user has voted on in any way:
        // upvote (vote=1), downvote (vote=-1), starred (star=true), or x'ed (x=true).
        // Also join champions so we have champion_id for display.
        const query = `
            SELECT 
                s.*,
                c.id AS champion_id,
                COALESCE(uv.vote, 0)     AS user_vote,
                COALESCE(uv.star, false) AS user_star,
                COALESCE(uv.x, false)    AS user_x
            FROM user_skin_votes uv
            JOIN skins s ON uv.skin_id = s.id
            JOIN champions c ON s.champion_id = c.id
            WHERE uv.user_id = $1
                AND (uv.vote != 0 OR uv.star = true OR uv.x = true)
            ORDER BY c.id, s.num
        `;

        const result = await pool.query(query, [userId]);
        const skins = result.rows;

        // Build the response
        const response = NextResponse.json({ skins });

        // If we just created a userId, set it in a cookie so it persists
        if (!anonymousCookie) {
            response.cookies.set('anonymousId', userId, {
                httpOnly: true,
                path: '/',
                sameSite: 'lax',
            });
        }

        return response;
    } catch (error) {
        console.error('Error fetching user votes', error);
        return NextResponse.json(
            { error: 'Failed to fetch user votes' },
            { status: 500 }
        );
    }
}
