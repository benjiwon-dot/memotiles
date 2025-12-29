import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ShoppingBag, ChevronDown, User, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
    const { isLoggedIn, logout, language, setLanguage, orders, t } = useApp();
    const navigate = useNavigate();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [langOpen, setLangOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/');
        setMenuOpen(false);
    };

    return (
        <nav style={{
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border)',
            position: 'sticky',
            top: 0,
            zIndex: 50
        }}>
            <div className="container" style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                height: '64px'
            }}>
                {/* Left/Center Logo */}
                <Link to="/" style={{
                    fontSize: '1.25rem',
                    fontWeight: '700',
                    color: 'var(--primary)',
                    letterSpacing: '-0.025em'
                }}>
                    MEMOTILES
                </Link>

                {/* Desktop Menu */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-menu">

                    {/* Language Dropdown */}
                    <div style={{ position: 'relative' }}>
                        <button
                            onClick={() => setLangOpen(!langOpen)}
                            style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', gap: '0.25rem', fontSize: '0.875rem' }}
                        >
                            <span>{language === 'EN' ? '🇺🇸 EN' : '🇹🇭 TH'}</span>
                            <ChevronDown size={14} />
                        </button>
                        {langOpen && (
                            <div style={{
                                position: 'absolute',
                                top: '100%',
                                right: 0,
                                marginTop: '0.5rem',
                                backgroundColor: 'white',
                                border: '1px solid var(--border)',
                                borderRadius: 'var(--radius-md)',
                                boxShadow: 'var(--shadow-md)',
                                minWidth: '100px',
                                zIndex: 100
                            }}>
                                <button
                                    onClick={() => { setLanguage('EN'); setLangOpen(false); }}
                                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.875rem', background: language === 'EN' ? '#f3f4f6' : 'white' }}
                                >
                                    🇺🇸 EN
                                </button>
                                <button
                                    onClick={() => { setLanguage('TH'); setLangOpen(false); }}
                                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '0.5rem 1rem', fontSize: '0.875rem', background: language === 'TH' ? '#f3f4f6' : 'white' }}
                                >
                                    🇹🇭 TH
                                </button>
                            </div>
                        )}
                    </div>

                    {isLoggedIn && (
                        <>
                            <Link to="/my-orders" className="btn-text" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                {t('myOrders')}
                            </Link>
                            <button onClick={handleLogout} className="btn-text">
                                {t('signOut')}
                            </button>
                        </>
                    )}

                    {!isLoggedIn && (
                        location.pathname !== '/' && location.pathname !== '/login' && (
                            <Link to="/login" className="btn-text">{t('login')}</Link>
                        )
                    )}
                </div>

                {/* Mobile Menu Toggle (simplified for now) */}
            </div>
        </nav>
    );
}
