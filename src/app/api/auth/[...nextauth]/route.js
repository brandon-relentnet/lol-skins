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
            async authorize(credentials) {
                const email = credentials.email;
                const password = credentials.password;
                const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
                if (result.rowCount === 0) {
                    throw new Error("No user found with this email");
                }
                const user = result.rows[0];
                const isValid = await bcrypt.compare(password, user.password_hash);
                if (!isValid) {
                    throw new Error("Invalid password");
                }
                // Ensure the returned user object includes an id as a string.
                return { id: String(user.id), email: user.email };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            // If user is available during login, store its id in token.
            if (user) {
                token.id = user.id;
            }
            return token;
        },
        async session({ session, token }) {
            // Add the id from token into session.user.
            if (token && session.user) {
                session.user.id = token.id;
            }
            return session;
        }
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/login",
        error: "/auth/error"
    }
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
