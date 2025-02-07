// app/api/user/votes/route.js
import pool from '@/db.js';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;
    try {
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
        return NextResponse.json({ skins });
    } catch (error) {
        console.error('Error fetching user votes', error);
        return NextResponse.json({ error: 'Failed to fetch user votes' }, { status: 500 });
    }
}
