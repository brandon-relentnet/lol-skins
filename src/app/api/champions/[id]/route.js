// app/api/champions/[id]/route.js
import pool from '@/db.js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request, { params }) {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    // If not authenticated, use an empty string that won't match any user_id.
    const userId = session ? session.user.id : "";

    try {
        const championResult = await pool.query(
            'SELECT * FROM champions WHERE LOWER(id) = LOWER($1)',
            [id]
        );
        if (championResult.rowCount === 0) {
            return NextResponse.json({ error: 'Champion not found' }, { status: 404 });
        }
        const champion = championResult.rows[0];

        const skinsQuery = `
            SELECT s.*, 
                    uv.vote AS user_vote, 
                    uv.star AS user_star, 
                    uv.x AS user_x
            FROM skins s
            LEFT JOIN user_skin_votes uv ON s.id = uv.skin_id AND uv.user_id = $1
            WHERE LOWER(s.champion_id) = LOWER($2)
            ORDER BY s.num ASC
            `;
        const skinsResult = await pool.query(skinsQuery, [userId, id]);
        champion.skins = skinsResult.rows;
        return NextResponse.json(champion);
    } catch (error) {
        console.error('Error fetching champion data', error);
        return NextResponse.json({ error: 'Failed to fetch champion data' }, { status: 500 });
    }
}
