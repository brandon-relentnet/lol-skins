// app/api/awards/route.js
import { NextResponse } from "next/server";
import pool from "@/lib/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  // Try to get the session (if the user is logged in)
  const session = await getServerSession(authOptions);
  const userId = session ? session.user.id : null;

  try {
    let topStarred, topXed, allSkins;

    if (userId) {
      // If the user is logged in, include their vote data with a LEFT JOIN.
      const topStarredQuery = `
        SELECT s.*, uv.vote AS user_vote, uv.star AS user_star, uv.x AS user_x
        FROM skins s
        LEFT JOIN user_skin_votes uv 
          ON s.id = uv.skin_id AND uv.user_id = $1
        ORDER BY s.total_stars DESC
        LIMIT 10
      `;
      const topStarredResult = await pool.query(topStarredQuery, [userId]);
      topStarred = topStarredResult.rows;

      const topXedQuery = `
        SELECT s.*, uv.vote AS user_vote, uv.star AS user_star, uv.x AS user_x
        FROM skins s
        LEFT JOIN user_skin_votes uv 
          ON s.id = uv.skin_id AND uv.user_id = $1
        ORDER BY s.total_x DESC
        LIMIT 10
      `;
      const topXedResult = await pool.query(topXedQuery, [userId]);
      topXed = topXedResult.rows;

      const allSkinsQuery = `
        SELECT s.*, uv.vote AS user_vote, uv.star AS user_star, uv.x AS user_x
        FROM skins s
        LEFT JOIN user_skin_votes uv 
          ON s.id = uv.skin_id AND uv.user_id = $1
        ORDER BY s.id ASC
      `;
      const allSkinsResult = await pool.query(allSkinsQuery, [userId]);
      allSkins = allSkinsResult.rows;
    } else {
      // If no session, run the queries without joining user votes.
      const topStarredQuery = `
        SELECT * 
        FROM skins 
        ORDER BY total_stars DESC 
        LIMIT 10
      `;
      const topStarredResult = await pool.query(topStarredQuery);
      topStarred = topStarredResult.rows;

      const topXedQuery = `
        SELECT * 
        FROM skins 
        ORDER BY total_x DESC 
        LIMIT 10
      `;
      const topXedResult = await pool.query(topXedQuery);
      topXed = topXedResult.rows;

      const allSkinsQuery = `
        SELECT * 
        FROM skins 
        ORDER BY id ASC
      `;
      const allSkinsResult = await pool.query(allSkinsQuery);
      allSkins = allSkinsResult.rows;
    }

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
