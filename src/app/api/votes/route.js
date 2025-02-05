// app/api/votes/route.js
import pool from '@/db.js';
import { NextResponse } from 'next/server';

export async function POST(request) {
    const client = await pool.connect();
    try {
        const { skinId, userId, vote, star, x } = await request.json();

        // Validate inputs.
        if (![-1, 0, 1].includes(vote)) {
            return NextResponse.json({ error: 'Invalid vote value' }, { status: 400 });
        }
        if (typeof star !== 'boolean' || typeof x !== 'boolean') {
            return NextResponse.json({ error: 'Invalid star or x value' }, { status: 400 });
        }

        await client.query('BEGIN');

        // Check if a vote from this user on this skin already exists.
        const existingVoteRes = await client.query(
            'SELECT * FROM user_skin_votes WHERE skin_id = $1 AND user_id = $2',
            [skinId, userId]
        );
        const exists = existingVoteRes.rowCount > 0;

        // Insert or update the user's vote.
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
        // Count total star votes for this user.
        const starCountRes = await client.query(
            'SELECT COUNT(*) AS star_count FROM user_skin_votes WHERE user_id = $1 AND star = true',
            [userId]
        );
        const starCount = parseInt(starCountRes.rows[0].star_count, 10);
        if (starCount > 3) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: 'Exceeded maximum star votes (3)' }, { status: 400 });
        }

        // Count total x votes for this user.
        const xCountRes = await client.query(
            'SELECT COUNT(*) AS x_count FROM user_skin_votes WHERE user_id = $1 AND x = true',
            [userId]
        );
        const xCount = parseInt(xCountRes.rows[0].x_count, 10);
        if (xCount > 3) {
            await client.query('ROLLBACK');
            return NextResponse.json({ error: 'Exceeded maximum X votes (3)' }, { status: 400 });
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
        return NextResponse.json({ message: 'Vote updated successfully', totals });
    } catch (error) {
        await client.query('ROLLBACK');
        console.error('Error updating vote:', error);
        return NextResponse.json({ error: 'Failed to update vote' }, { status: 500 });
    } finally {
        client.release();
    }
}
