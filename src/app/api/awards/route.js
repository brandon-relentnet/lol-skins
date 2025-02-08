import { NextResponse } from "next/server";
import pool from "@/lib/db";

export async function GET() {
    try {
        // 1) Top 10 most starred
        const topStarredQuery = `
      SELECT *
      FROM skins
      ORDER BY total_stars DESC
      LIMIT 10
    `;
        const topStarredResult = await pool.query(topStarredQuery);
        const topStarred = topStarredResult.rows;

        // 2) Top 10 most X'd
        const topXedQuery = `
      SELECT *
      FROM skins
      ORDER BY total_x DESC
      LIMIT 10
    `;
        const topXedResult = await pool.query(topXedQuery);
        const topXed = topXedResult.rows;

        // 3) All skins (for the user to sort in the browser)
        const allSkinsQuery = `
      SELECT *
      FROM skins
      ORDER BY id ASC  -- or whatever default order you want
    `;
        const allSkinsResult = await pool.query(allSkinsQuery);
        const allSkins = allSkinsResult.rows;

        return NextResponse.json({
            topStarred,
            topXed,
            allSkins,
        });
    } catch (error) {
        console.error("Failed to fetch awards data:", error);
        return NextResponse.json({ error: "Failed to fetch awards" }, { status: 500 });
    }
}
