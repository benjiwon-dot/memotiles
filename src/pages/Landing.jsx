import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { ArrowRight, Upload, Crop, Truck, Instagram } from 'lucide-react';
import Footer from '../components/Footer';
import tileMockup from '../assets/tile_mockup.png';

export default function Landing() {
    const { isLoggedIn, t } = useApp();
    const navigate = useNavigate();

    const handleCreateClick = () => {
        if (isLoggedIn) {
            navigate('/app');
        } else {
            navigate('/login');
        }
    };

    const scrollToHowItWorks = () => {
        document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' });
    };

    const IG_URL = "https://www.instagram.com/runner_better";

    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Hero Section */}
            <section style={{
                padding: '6rem 1rem',
                textAlign: 'center',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '2rem',
                background: 'linear-gradient(to bottom, #FFFFFF, #F9FAFB)'
            }}>
                <div className="container" style={{ maxWidth: '800px' }}>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '800',
                        lineHeight: '1.1',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.03em'
                    }}>
                        {t('heroTitle')}
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-secondary)',
                        marginBottom: '2.5rem',
                        maxWidth: '600px',
                        marginLeft: 'auto',
                        marginRight: 'auto'
                    }}>
                        {t('heroSubtitle')}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                        <button
                            onClick={handleCreateClick}
                            className="btn btn-primary"
                            style={{
                                fontSize: '1.125rem',
                                padding: '1rem 2.5rem',
                                borderRadius: '9999px',
                                boxShadow: 'var(--shadow-lg)'
                            }}
                        >
                            {t('createTiles')}
                        </button>
                        <button onClick={scrollToHowItWorks} className="btn-text" style={{ fontSize: '0.9rem' }}>
                            {t('howItWorks')}
                        </button>
                    </div>
                </div>

                {/* Product Visual */}
                <div style={{ marginTop: '4rem', width: '100%', display: 'flex', justifyContent: 'center' }}>
                    {/* Hero image can be replaced by placing a new file at /public/hero/hero-wall.jpg */}
                    <img
                        src="/hero/hero-wall.jpg"
                        alt="Memotiles Wall"
                        style={{
                            borderRadius: 'var(--radius-xl)',
                            boxShadow: 'var(--shadow-xl)',
                            maxWidth: '600px',
                            width: '100%',
                            objectFit: 'cover',
                            display: 'block'
                        }}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = tileMockup;
                        }}
                    />
                </div>
            </section>

            {/* How it works */}
            <section id="how-it-works" style={{ padding: '6rem 1rem', backgroundColor: 'white' }}>
                <div className="container">
                    <h2 style={{ textAlign: 'center', marginBottom: '4rem', fontSize: '2rem', fontWeight: 'bold' }}>{t('howItWorks')}</h2>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: '2rem'
                    }}>
                        {/* Step 1 */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{ background: '#EFF6FF', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#3B82F6' }}>
                                <Upload size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t('step1Title')}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{t('step1Desc')}</p>
                        </div>

                        {/* Step 2 */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{ background: '#ECFDF5', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#10B981' }}>
                                <Crop size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t('step2Title')}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{t('step2Desc')}</p>
                        </div>

                        {/* Step 3 */}
                        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '3rem 2rem' }}>
                            <div style={{ background: '#FFF7ED', padding: '1rem', borderRadius: '50%', marginBottom: '1.5rem', color: '#F97316' }}>
                                <Truck size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t('step3Title')}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{t('step3Desc')}</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Real Photos / Instagram */}
            <section style={{ padding: '6rem 1rem', backgroundColor: '#F9FAFB' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{t('realWallsTitle')}</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>{t('realWallsDesc')}</p>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                        gap: '1rem',
                        marginBottom: '3rem'
                    }}>
                        {/* Placeholders for Instagram Grid */}
                        {[...Array(8)].map((_, i) => (
                            <a
                                key={i}
                                href={IG_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="instagram-tile"
                                style={{
                                    display: 'block', // Ensure anchor behaves like block
                                    aspectRatio: '1/1',
                                    backgroundColor: '#E5E7EB',
                                    borderRadius: 'var(--radius-md)',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    cursor: 'pointer'
                                }}
                            >
                                <div style={{
                                    position: 'absolute',
                                    inset: 0,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    color: 'white',
                                    opacity: 0,
                                    transition: 'opacity 0.2s'
                                }}
                                    onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
                                    onMouseLeave={(e) => e.currentTarget.style.opacity = '0'}
                                >
                                    View on Instagram
                                </div>
                            </a>
                        ))}
                    </div>

                    <a
                        href={IG_URL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                        style={{ gap: '0.5rem', display: 'inline-flex', alignItems: 'center' }} // inline-flex to match button behavior
                    >
                        <Instagram size={20} />
                        {t('followUs')}
                    </a>
                </div>
            </section>

            <Footer />
        </div>
    );
}
