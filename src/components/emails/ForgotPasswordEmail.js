// components/ForgotPasswordEmail.jsx
import React from "react";

export function ForgotPasswordEmail({ username, resetLink }) {
    return (
        <div style={{ fontFamily: "sans-serif", color: "#333" }}>
            <h1>Hello {username},</h1>
            <p>You requested to reset your password.</p>
            <p>
                Click <a href={resetLink} style={{ color: "#1a73e8" }}>here</a> to reset your password.
            </p>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request a password reset, please ignore this email.</p>
        </div>
    );
}
