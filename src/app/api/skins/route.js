import pool from '@/db.js';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const result = await pool.query('SELECT * FROM skins');
        return NextResponse.json(result.rows);
    } catch (error) {
        console.error('Error fetching skins', error);
        return NextResponse.json(
            { error: 'Failed to fetch skins' },
            { status: 500 }
        );
    }
}