import React from 'react';
import Footer from '../components/Footer';

export default function Contact() {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 64px)' }}>
            <div className="container" style={{ padding: '6rem 1rem', textAlign: 'center', flex: 1 }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '800' }}>Contact us</h1>
            </div>
            <Footer />
        </div>
    );
}
