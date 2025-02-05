// app/api/votes/route.js
import pool from '@/db.js';
import { NextResponse } from 'next/server';
import { randomUUID } from 'crypto';

export async function POST(request) {
    const client = await pool.connect();
    let userId;
    try {
        // Extract the anonymousId cookie from the request.
        const anonymousCookie = request.cookies.get('anonymousId');
        if (anonymousCookie && anonymousCookie.value) {
            userId = anonymousCookie.value;
        } else {
            // Generate a new anonymousId.
            userId = randomUUID();
        }

        // Read the JSON body.
        const { skinId, vote, star, x } = await request.json();

        // Validate inputs.
        if (![-1, 0, 1].includes(vote)) {
            const res = NextResponse.json({ error: 'Invalid vote value' }, { status: 400 });
            if (!anonymousCookie) res.cookies.set('anonymousId', userId, { httpOnly: true, path: '/', sameSite: 'lax' });
            return res;
        }
        if (typeof star !== 'boolean' || typeof x !== 'boolean') {
            const res = NextResponse.json({ error: 'Invalid star or x value' }, { status: 400 });
            if (!anonymousCookie) res.cookies.set('anonymousId', userId, { httpOnly: true, path: '/', sameSite: 'lax' });
            return res;
        }

        await client.query('BEGIN');

        // Check if a vote from this user on this skin already exists.
        const existingVoteRes = await client.query(
            'SELECT * FROM user_skin_votes WHERE skin_id = $1 AND user_id = $2',
            [skinId, userId]
        );
        const exists = existingVoteRes.rowCount > 0;

        if (exists) {
            await client.query(
                `UPDATE user_skin_votes
         SET vote = $1, star = $2, x = $3, voted_at = CURRENT_TIMESTAMP
         WHERE skin_id = $4 AND user_id = $5`,
                [vote, star, x, skinId, userId]
            );
        } else {
            await client.query(
                `INSERT INTO user_skin_votes (skin_id, user_id, vote, star, x)
         VALUES ($1, $2, $3, $4, $5)`,
                [skinId, userId, vote, star, x]
            );
        }

        // Enforce global limits for star and x votes (across all skins for this user).
        const starCountRes = await client.query(
            'SELECT COUNT(*) AS star_count FROM user_skin_votes WHERE user_id = $1 AND star = true',
            [userId]
        );
        const starCount = parseInt(starCountRes.rows[0].star_count, 10);
        if (starCount > 3) {
            await client.query('ROLLBACK');
            const res = NextResponse.json({ error: 'Exceeded maximum star votes (3)' }, { status: 400 });
            if (!anonymousCookie) res.cookies.set('anonymousId', userId, { httpOnly: true, path: '/', sameSite: 'lax' });
            return res;
        }

        const xCountRes = await client.query(
            'SELECT COUNT(*) AS x_count FROM user_skin_votes WHERE user_id = $1 AND x = true',
            [userId]
        );
        const xCount = parseInt(xCountRes.rows[0].x_count, 10);
        if (xCount > 3) {
            await client.query('ROLLBACK');
            const res = NextResponse.json({ error: 'Exceeded maximum X votes (3)' }, { status: 400 });
            if (!anonymousCookie) res.cookies.set('anonymousId', userId, { httpOnly: true, path: '/', sameSite: 'lax' });
            return res;
        }

        // Recalculate aggregate totals for the skin.
        const aggRes = await client.query(
            `SELECT
          COALESCE(SUM(vote), 0) AS total_votes,
          COALESCE(COUNT(*) FILTER (WHERE star = true), 0) AS total_stars,
          COALESCE(COUNT(*) FILTER (WHERE x = true), 0) AS total_x
       FROM user_skin_votes
       WHERE skin_id = $1`,
            [skinId]
        );
        const totals = aggRes.rows[0];

        // Update the skins table with the new aggregates.
        await client.query(
            `UPDATE skins
       SET total_votes = $1, total_stars = $2, total_x = $3
       WHERE id = $4`,
            [totals.total_votes, totals.total_stars, totals.total_x, skinId]
        );

        await client.query('COMMIT');
        const response = NextResponse.json({ message: 'Vote updated successfully', totals });
        // If no anonymousId cookie was present, set it now.
        if (!anonymousCookie) {
            response.cookies.set('anonymousId', userId, { httpOnly: true, path: '/', sameSite: 'lax' });
        }
        return response;
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating vote:', error);
        const response = NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
        if (!request.cookies.get('anonymousId')) {
            response.cookies.set('anonymousId', userId, { httpOnly: true, path: '/', sameSite: 'lax' });
        }
        return response;
    } finally {
        client.release();
    }
}
