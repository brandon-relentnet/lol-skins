// app/api/auth/[...nextauth]/route.js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import pool from "@/lib/db.js";
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
                if (!user.is_verified) {
                    throw new Error("Please verify your email before logging in.");
                }
                // Ensure the returned user object includes an id as a string.
                return { id: String(user.id), email: user.email, username: user.username };
            }
        })
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
            }
            return token;
        },
        async session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id;
                session.user.email = token.email;
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
