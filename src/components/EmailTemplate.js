import React from 'react';

export function EmailTemplate({ username, verificationLink }) {
    return (
        <div style={{ fontFamily: 'Arial, sans-serif', backgroundColor: '#010A13', padding: '40px' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#0A1428', padding: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)', textAlign: 'center' }}>

                {/* Header */}
                <div style={{ borderBottom: '2px solid #c9bf96', paddingBottom: '10px', marginBottom: '20px' }}>
                    <h2 style={{ color: '#C8AA6E', margin: '0', fontSize: '36px', fontFamily: 'Georgia, serif' }}>Welcome to SkinBattle.lol!</h2>
                </div>

                {/* Body */}
                <h1 style={{ color: '#C8AA6E', fontSize: '26px' }}>Hey {username},</h1>
                <p style={{ color: '#A09B8C', fontSize: '16px', lineHeight: '1.5' }}>
                    Thanks for joining <strong>SkinBattle.lol</strong>, the ultimate skin-ranking battleground! Before you jump in and start voting, let’s verify your email.
                </p>

                {/* CTA Button */}
                <a href={verificationLink} style={{ display: 'inline-block', backgroundColor: '#010A13', color: '#C8AA6E', textDecoration: 'none', padding: '12px 24px', fontSize: '16px', fontWeight: 'bold', marginTop: '10px' }}>
                    Verify Your Account
                </a>

                <p style={{ color: '#5B5A56', fontSize: '14px', marginTop: '20px' }}>
                    If you didn’t sign up for SkinBattle.lol, you can ignore this email.
                </p>

                {/* Footer */}
                <div style={{ borderTop: '2px solid #c9bf96', paddingTop: '10px', marginTop: '20px', fontSize: '12px', color: '#3C3C41' }}>
                    <p>Need help? <a href="mailto:support@skinbattle.lol" style={{ color: '#C8AA6E', textDecoration: 'none' }}>Contact Support</a></p>
                    <p>&copy; {new Date().getFullYear()} <strong>SkinBattle.lol</strong>. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
