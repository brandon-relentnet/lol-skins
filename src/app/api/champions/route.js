import pool from '@/db.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const query = `
            SELECT 
                c.*, 
                COALESCE(json_agg(s.*) FILTER (WHERE s.id IS NOT NULL), '[]') AS skins
            FROM champions c
            LEFT JOIN skins s ON c.id = s.champion_id
            GROUP BY c.id
        `;
        const result = await pool.query(query);
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching champions', error);
        return NextResponse.json(
            { error: 'Failed to fetch champions' },
            { status: 500 }
        );
    }
}