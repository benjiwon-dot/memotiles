import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Upload, Plus, ZoomIn, ZoomOut, RotateCw, Check, ArrowRight, Image as ImageIcon } from 'lucide-react';
import { getOrders, canEdit, updateOrderItems } from '../utils/orders';

export default function Editor() {
    const { t } = useApp();
    const navigate = useNavigate();
    const location = useLocation();

    // Parse editOrderId from URL
    const searchParams = new URLSearchParams(location.search);
    const editOrderId = searchParams.get('editOrderId');

    // Local state for dashboard
    const [uploads, setUploads] = useState([]);

    // Initialize state based on mode
    useEffect(() => {
        if (editOrderId) {
            const orders = getOrders();
            const order = orders.find(o => o.id === editOrderId);

            if (!order) {
                alert('Order not found');
                navigate('/my-orders');
                return;
            }

            if (!canEdit(order)) {
                alert('This order cannot be edited anymore.');
                navigate('/my-orders');
                return;
            }

            // Load items from order
            // Note: order items structure matches upload structure roughly?
            // Order items likely have { id, filter, zoom, rotation, status:'cropped' (implied) }
            // We need to map them back to uploads format if needed.
            // Assuming order.items are fully compatible or we spread them.
            // We need to ensure 'status' and 'isCropped' are set correctly.
            const loadedUploads = order.items.map(item => ({
                ...item,
                status: 'cropped',
                isCropped: true
            }));

            setUploads(loadedUploads);
        } else {
            // Default new order state
            setUploads(Array.from({ length: 3 }).map((_, i) => ({
                id: Date.now() + i,
                status: 'needs-crop',
                filter: 'Original',
                isCropped: false
            })));
        }
    }, [editOrderId, navigate]);

    const [selectedUploadId, setSelectedUploadId] = useState(null); // Will set in effect
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState('Original');

    // Auto-select first photo on mount or if empty
    useEffect(() => {
        if (!selectedUploadId && uploads.length > 0) {
            setSelectedUploadId(uploads[0].id);
        }
    }, [uploads]);

    // Update controls when selection changes
    useEffect(() => {
        const u = uploads.find(up => up.id === selectedUploadId);
        if (u) {
            setZoom(u.zoom || 1);
            setRotation(u.rotation || 0);
            setSelectedFilter(u.filter || 'Original');
        }
    }, [selectedUploadId]);


    // Extended Filters List
    const FILTERS = [
        { name: 'Original', style: 'none' },
        { name: 'Warm', style: 'sepia(30%) saturate(140%)' },
        { name: 'Cool', style: 'saturate(0.5) hue-rotate(30deg)' },
        { name: 'B&W', style: 'grayscale(100%)' },
        { name: 'Vivid', style: 'saturate(200%)' },
        { name: 'Natural', style: 'contrast(90%) saturate(110%)' },
        { name: 'Portrait', style: 'brightness(110%) contrast(105%)' },
        { name: 'Dramatic', style: 'contrast(140%) saturate(90%)' },
        { name: 'Vintage', style: 'sepia(50%) contrast(90%)' },
        { name: 'Noir', style: 'grayscale(100%) contrast(150%) brightness(80%)' },
        { name: 'Sepia', style: 'sepia(100%)' },
        { name: 'Fade', style: 'opacity(0.8) contrast(90%)' },
        { name: 'Matte', style: 'contrast(80%) brightness(120%)' },
        { name: 'Bright', style: 'brightness(120%) saturate(110%)' },
        { name: 'Sunset', style: 'sepia(40%) hue-rotate(-10deg) saturate(150%)' },
    ];

    const handleUpload = () => {
        if (uploads.length >= 20) return;

        // Add EXACTLY 1 mock photo
        const newUpload = {
            id: Date.now(),
            status: 'needs-crop',
            filter: 'Original',
            isCropped: false // New flag for checkout logic
        };

        setUploads(prev => [...prev, newUpload]);

        // Auto-select if it's the first one
        if (!selectedUploadId) {
            setSelectedUploadId(newUpload.id);
        }
    };

    const currentUpload = uploads.find(u => u.id === selectedUploadId);

    const handleSaveCrop = () => {
        if (!currentUpload) return;

        const updatedUploads = uploads.map(u =>
            u.id === selectedUploadId ? {
                ...u,
                status: 'cropped',
                filter: selectedFilter,
                zoom: zoom,
                rotation: rotation,
                isCropped: true // Mark as ready for checkout
            } : u
        );
        setUploads(updatedUploads);

        const next = updatedUploads.find(u => u.status === 'needs-crop');
        if (next) setSelectedUploadId(next.id);
    };

    // Zoom helpers
    const handleZoomIn = () => setZoom(z => Math.min(3, z + 0.1));
    const handleZoomOut = () => setZoom(z => Math.max(1, z - 0.1));

    const handleUpdateOrder = () => {
        // Prepare items for saving
        // Filter only cropped? Or require all?
        // Let's assume user must finish cropping all if they added new ones.
        // Or we just save the valid ones.
        const validItems = uploads.filter(u => u.isCropped);

        if (validItems.length === 0) return;

        updateOrderItems(editOrderId, validItems);
        alert('Order updated successfully!');
        navigate('/my-orders');
    };

    return (
        <div style={{ paddingBottom: '80px' }}>
            {/* Step Indicator - Hide in Edit Mode? Or change text? Keep for now but maybe less relevant. */}
            {!editOrderId && (
                <div style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'white', padding: '1rem', textAlign: 'center' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
                        <span style={{ color: 'var(--primary)' }}>{t('uploadStep')}</span>
                        <ArrowRight size={14} className="text-secondary" />
                        <span style={{ color: 'var(--primary)' }}>{t('cropStep')}</span>
                        <ArrowRight size={14} className="text-secondary" />
                        <span style={{ color: 'var(--text-tertiary)' }}>{t('checkoutStep')}</span>
                    </div>
                </div>
            )}

            {editOrderId && (
                <div style={{ borderBottom: '1px solid #FEF3C7', backgroundColor: '#FFFBEB', padding: '1rem', textAlign: 'center', color: '#92400E' }}>
                    <strong>Editing Order {editOrderId}</strong>
                </div>
            )}

            <div className="container" style={{
                marginTop: '2rem',
                display: 'grid',
                // ANIMATION: Layout shifts when uploads exist
                gridTemplateColumns: uploads.length > 0 ? '280px 1fr' : '1fr 400px',
                gap: '2rem',
                minHeight: '600px',
                transition: 'grid-template-columns 0.3s ease-out'
            }}>

                {/* LEFT CONTENT */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', overflow: 'hidden' }}>

                    {/* Big Dropzone (Only visible when empty) */}
                    {uploads.length === 0 && (
                        <div style={{
                            flex: 1,
                            backgroundColor: '#F3F4F6',
                            borderRadius: 'var(--radius-lg)',
                            border: '2px dashed var(--border)',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: '400px',
                            transition: 'opacity 0.3s',
                            opacity: 1
                        }}>
                            <div style={{ textAlign: 'center' }}>
                                <button onClick={handleUpload} className="btn btn-primary" style={{ gap: '0.5rem', marginBottom: '1rem' }}>
                                    <Plus size={20} />
                                    {t('uploadBtn')}
                                </button>
                                <p style={{ color: 'var(--text-secondary)' }}>{t('uploadRec')}</p>
                            </div>
                        </div>
                    )}

                    {/* Album Grid (Visible when uploads > 0) */}
                    {uploads.length > 0 && (
                        <div style={{
                            animation: 'fadeIn 0.3s ease-out',
                            display: 'flex',
                            flexDirection: 'column',
                            height: '100%'
                        }}>
                            <h3 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.75rem' }}>
                                {t('yourAlbum')} ({uploads.length}/20)
                            </h3>

                            <div style={{
                                display: 'grid',
                                gridTemplateColumns: 'repeat(auto-fill, minmax(60px, 1fr))',
                                gap: '0.75rem',
                                alignContent: 'start',
                                overflowY: 'auto',
                                paddingRight: '0.5rem'
                            }}>
                                {/* Thumbnails */}
                                {uploads.map((u, index) => (
                                    <div
                                        key={u.id}
                                        onClick={() => setSelectedUploadId(u.id)}
                                        style={{
                                            aspectRatio: '1/1',
                                            borderRadius: 'var(--radius-md)',
                                            backgroundColor: '#E5E7EB',
                                            position: 'relative',
                                            cursor: 'pointer',
                                            border: selectedUploadId === u.id ? '2px solid var(--primary)' : '2px solid transparent',
                                            overflow: 'hidden',
                                            animation: 'fadeIn 0.2s ease-out',
                                            animationDelay: `${index * 50}ms`,
                                            animationFillMode: 'backwards'
                                        }}
                                    >
                                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#d1d5db' }}>
                                            <ImageIcon size={20} color="#6b7280" />
                                        </div>

                                        {u.isCropped && (
                                            <div style={{ position: 'absolute', top: 2, right: 2, background: 'rgba(255,255,255,0.95)', borderRadius: '50%', padding: 2, display: 'flex' }}>
                                                <Check size={10} color="#111" />
                                            </div>
                                        )}
                                        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, fontSize: '0.6rem', background: 'rgba(0,0,0,0.5)', color: 'white', textAlign: 'center', padding: '1px 0' }}>
                                            {u.isCropped ? t('ready') : t('edit')}
                                        </div>
                                    </div>
                                ))}

                                {/* Trailing Add Button */}
                                {uploads.length < 20 ? (
                                    <button
                                        onClick={handleUpload}
                                        style={{
                                            aspectRatio: '1/1',
                                            borderRadius: 'var(--radius-md)',
                                            border: '2px dashed var(--border)',
                                            backgroundColor: 'white',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            cursor: 'pointer',
                                            color: 'var(--text-secondary)',
                                            transition: 'border-color 0.2s, color 0.2s'
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.borderColor = 'var(--primary)';
                                            e.currentTarget.style.color = 'var(--primary)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.borderColor = 'var(--border)';
                                            e.currentTarget.style.color = 'var(--text-secondary)';
                                        }}
                                    >
                                        <Plus size={24} />
                                    </button>
                                ) : (
                                    // Max Limit Reached Indicator
                                    <div style={{
                                        aspectRatio: '1/1',
                                        borderRadius: 'var(--radius-md)',
                                        border: '1px dashed var(--border)',
                                        backgroundColor: '#F9FAFB',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--text-tertiary)',
                                        fontSize: '0.75rem'
                                    }}>
                                        <span>Max</span>
                                        <span>20</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT CONTENT: Crop & Filters */}
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: 'var(--radius-lg)',
                    boxShadow: 'var(--shadow-sm)',
                    padding: '2rem',
                    height: 'fit-content',
                    transition: 'all 0.3s ease-out'
                }}>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: 'Bold', marginBottom: '2rem', textAlign: 'center' }}>{t('cropTitle')}</h2>

                    {currentUpload ? (
                        <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                            {/* Preview Frame */}
                            <div style={{
                                aspectRatio: '1/1',
                                backgroundColor: '#F3F4F6',
                                borderRadius: 'var(--radius-lg)',
                                marginBottom: '2rem',
                                position: 'relative',
                                overflow: 'hidden',
                                cursor: 'grab',
                                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.05)'
                            }}>
                                {/* Mock Image Content */}
                                <div style={{
                                    width: '100%',
                                    height: '100%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '2rem',
                                    color: '#9CA3AF',
                                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                    transition: 'transform 0.1s linear', // Faster transition for smoother zoom
                                    // Apply dynamic filter from object
                                    filter: (FILTERS.find(f => f.name === selectedFilter)?.style || 'none')
                                }}>
                                    Photo
                                </div>

                                {/* Guides */}
                                <div style={{ position: 'absolute', inset: 0, border: '1px solid rgba(255,255,255,0.4)', pointerEvents: 'none' }}>
                                    <div style={{ position: 'absolute', top: '33.33%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
                                    <div style={{ position: 'absolute', top: '66.66%', left: 0, right: 0, height: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
                                    <div style={{ position: 'absolute', left: '33.33%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
                                    <div style={{ position: 'absolute', left: '66.66%', top: 0, bottom: 0, width: '1px', background: 'rgba(255,255,255,0.3)' }}></div>
                                </div>
                            </div>

                            {/* CONTROLS */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                {/* Zoom & Rotate Row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '1rem' }}>

                                    {/* Zoom Control Group */}
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)' }}>
                                            <span>{t('zoom')}</span>
                                            <span>{(zoom * 100).toFixed(0)}%</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', backgroundColor: '#F9FAFB', padding: '0.5rem', borderRadius: '999px', border: '1px solid var(--border)' }}>
                                            <button onClick={handleZoomOut} disabled={zoom <= 1} style={{ padding: '4px', cursor: 'pointer', opacity: zoom <= 1 ? 0.3 : 1 }}>
                                                <ZoomOut size={18} />
                                            </button>
                                            <input
                                                type="range"
                                                min="1" max="3" step="0.1"
                                                value={zoom}
                                                onChange={(e) => setZoom(parseFloat(e.target.value))}
                                                style={{ flex: 1, accentColor: 'var(--primary)', cursor: 'grab' }}
                                            />
                                            <button onClick={handleZoomIn} disabled={zoom >= 3} style={{ padding: '4px', cursor: 'pointer', opacity: zoom >= 3 ? 0.3 : 1 }}>
                                                <ZoomIn size={18} />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Rotate Button */}
                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                        <span style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>{t('rotate')}</span>
                                        <button onClick={() => setRotation(r => r + 90)} className="btn-secondary" style={{ width: '42px', height: '42px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <RotateCw size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Filters Grid (Multi-line) */}
                            <div style={{ marginBottom: '2.5rem' }}>
                                <p style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.75rem' }}>{t('filters')}</p>
                                <div style={{
                                    display: 'flex',
                                    gap: '0.5rem', // Slightly tighter gap for grid
                                    flexWrap: 'wrap',
                                    paddingBottom: '0.5rem'
                                }}>
                                    {FILTERS.map(f => (
                                        <button
                                            key={f.name}
                                            onClick={() => setSelectedFilter(f.name)}
                                            style={{
                                                // Removed flexShrink: 0 as it's not needed for wrap
                                                padding: '0.5rem 1rem', // Compact padding
                                                borderRadius: '9999px',
                                                border: selectedFilter === f.name ? '2px solid var(--primary)' : '1px solid var(--border)',
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                backgroundColor: selectedFilter === f.name ? 'var(--primary)' : 'white',
                                                color: selectedFilter === f.name ? 'white' : 'var(--text-primary)',
                                                transition: 'all 0.2s',
                                                boxShadow: selectedFilter === f.name ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
                                            }}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Save Button */}
                            <button onClick={handleSaveCrop} className="btn btn-primary" style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}>
                                {currentUpload.status === 'cropped' ? t('updateCrop') : t('saveCrop')}
                            </button>
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '6rem 0', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                            <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={32} color="#9CA3AF" />
                            </div>
                            <p style={{ fontSize: '1.125rem' }}>{t('selectPhoto')}</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'white',
                borderTop: '1px solid var(--border)',
                padding: '1rem',
                boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.05)',
                zIndex: 40
            }}>
                <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div>
                        <span style={{ fontWeight: 'bold' }}>{t('tilesCount')}: {uploads.filter(u => u.isCropped).length}</span>
                        <span style={{ marginLeft: '1rem', color: 'var(--text-secondary)' }}>{t('estTotal')}: ฿{uploads.filter(u => u.isCropped).length * 200}</span>
                    </div>

                    {editOrderId ? (
                        <button
                            onClick={handleUpdateOrder}
                            disabled={uploads.filter(u => u.isCropped).length === 0}
                            className="btn btn-primary"
                            style={{ opacity: uploads.filter(u => u.isCropped).length === 0 ? 0.5 : 1 }}
                        >
                            Update Order
                        </button>
                    ) : (
                        <button
                            onClick={() => {
                                const croppedPhotos = uploads.filter(u => u.isCropped);
                                navigate('/checkout', { state: { orderItems: croppedPhotos } });
                            }}
                            disabled={uploads.filter(u => u.isCropped).length === 0}
                            className="btn btn-primary"
                            style={{ opacity: uploads.filter(u => u.isCropped).length === 0 ? 0.5 : 1 }}
                        >
                            {t('proceedCheckout')}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
