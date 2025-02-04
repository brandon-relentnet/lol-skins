import pool from '@/db.js';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    const { id } = await params;
    try {
        const championResult = await pool.query('SELECT * FROM champions WHERE LOWER(id) = LOWER($1)', [id]);
        if (championResult.rowCount === 0) {
            return NextResponse.json(
                { error: 'Champion not found' },
                { status: 404 }
            );
        }
        const champion = championResult.rows[0];

        const skinsResult = await pool.query('SELECT * FROM skins WHERE LOWER(champion_id) = LOWER($1)', [id]);
        champion.skins = skinsResult.rows;

        return NextResponse.json(champion);
    } catch (error) {
        console.error('Error fetching champion', error);
        return NextResponse.json(
            { error: 'Failed to fetch champion' },
            { status: 500 }
        );
    }
}