import pool from '@/db.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const result = await pool.query('SELECT * FROM champions');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching champions', error);
        return NextResponse.json(
            { error: 'Failed to fetch champions' },
            { status: 500 }
        );
    }
}