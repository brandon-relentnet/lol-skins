import pool from '@/db.js';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';
import { cookies } from 'next/headers';

export async function GET(request, { params }) {
    const { id } = await params;

    // Get cookies (await because it's async).
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
        // Fetch champion details.
        const championResult = await pool.query(
            'SELECT * FROM champions WHERE LOWER(id) = LOWER($1)',
            [id]
        );
        if (championResult.rowCount === 0) {
            return NextResponse.json({ error: 'Champion not found' }, { status: 404 });
        }
        const champion = championResult.rows[0];

        // Fetch skins joined with the user's vote data.
        const skinsQuery = `
            SELECT s.*,
                COALESCE(uv.vote, 0) AS user_vote,
                COALESCE(uv.star, false) AS user_star,
                COALESCE(uv.x, false) AS user_x
            FROM skins s
            LEFT JOIN user_skin_votes uv
                ON s.id = uv.skin_id AND uv.user_id = $1
            WHERE LOWER(s.champion_id) = LOWER($2)
            ORDER BY s.num ASC
        `;
        const skinsResult = await pool.query(skinsQuery, [userId, id]);
        champion.skins = skinsResult.rows;

        // Build the response.
        const response = NextResponse.json(champion);
        // If a new anonymousId was generated, set it in the response cookies.
        if (!anonymousCookie) {
            response.cookies.set('anonymousId', userId, { httpOnly: true, path: '/', sameSite: 'lax' });
        }
        return response;
    } catch (error) {
        console.error('Error fetching champion data', error);
        return NextResponse.json({ error: 'Failed to fetch champion data' }, { status: 500 });
    }
}
