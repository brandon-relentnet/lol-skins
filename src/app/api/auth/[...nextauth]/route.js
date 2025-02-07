// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/db.js";
import bcrypt from "bcryptjs";

export const authOptions = {
    session: {
        strategy: "jwt",
    },
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "user@example.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                const email = credentials.email;
                const password = credentials.password;
                // Query the user from the database.
                const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
                if (result.rowCount === 0) {
                    throw new Error("No user found with this email");
                }
                const user = result.rows[0];
                // Compare the given password with the stored hash.
                const isValid = await bcrypt.compare(password, user.password_hash);
                if (!isValid) {
                    throw new Error("Invalid password");
                }
                // Return only the user fields that you want to expose in the session.
                return { id: user.id, email: user.email };
            }
        })
    ],
    pages: {
        signIn: "/auth/login", // custom sign in page
        error: "/auth/error"
    },
    secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
