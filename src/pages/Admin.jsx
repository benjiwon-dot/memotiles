import React, { useState, useMemo } from 'react';
import {
    Search,
    Filter,
    ChevronDown,
    Download,
    Check,
    X,
    Image as ImageIcon,
    Calendar,
    MoreHorizontal,
    Phone,
    MapPin,
    CreditCard
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_ORDERS = [
    {
        id: 'ORD-7782-XJ',
        createdAt: '2024-12-27T09:30:00',
        status: 'new',
        tilesCount: 12,
        total: 2400,
        customer: {
            name: 'Alice Johnson',
            email: 'alice.j@example.com',
            phone: '+66 81 234 5678',
            address1: '123 Sukhumvit Road',
            address2: 'Apt 4B',
            city: 'Bangkok',
            postal: '10110',
            country: 'Thailand'
        },
        photos: Array.from({ length: 12 }).map((_, i) => ({
            id: `p-${i}`,
            filename: `IMG_20241227_${1000 + i}.jpg`,
            url: `https://placehold.co/800x800/e2e8f0/475569?text=Photo+${i + 1}`
        }))
    },
    {
        id: 'ORD-9921-MC',
        createdAt: '2024-12-26T14:15:00',
        status: 'new',
        tilesCount: 6,
        total: 1200,
        customer: {
            name: 'Michael Chen',
            email: 'm.chen@example.com',
            phone: '+66 89 987 6543',
            address1: '456 Sathorn Soi 1',
            city: 'Bangkok',
            postal: '10500',
            country: 'Thailand'
        },
        photos: Array.from({ length: 6 }).map((_, i) => ({
            id: `p2-${i}`,
            filename: `DSC_${5000 + i}.jpg`,
            url: `https://placehold.co/800x800/f3f4f6/374151?text=Img+${i + 1}`
        }))
    },
    {
        id: 'ORD-3321-KL',
        createdAt: '2024-12-25T10:00:00',
        status: 'printed',
        tilesCount: 8,
        total: 1600,
        customer: {
            name: 'Sarah Connor',
            email: 'sarah.c@test.com',
            phone: '+66 90 111 2222',
            address1: '789 Nimman Road',
            city: 'Chiang Mai',
            postal: '50200',
            country: 'Thailand'
        },
        photos: Array.from({ length: 8 }).map((_, i) => ({
            id: `p3-${i}`,
            filename: `SCAN_${900 + i}.jpg`,
            url: `https://placehold.co/800x800/dbeafe/1e40af?text=Scan+${i + 1}`
        }))
    },
    {
        id: 'ORD-1102-PP',
        createdAt: '2024-12-24T18:45:00',
        status: 'shipping',
        tilesCount: 20,
        total: 4000,
        customer: {
            name: 'Peter Parker',
            email: 'p.parker@dailybugle.com',
            phone: '+66 85 555 0123',
            address1: '15 Queen Street',
            city: 'Bangkok',
            postal: '10110',
            country: 'Thailand'
        },
        photos: Array.from({ length: 20 }).map((_, i) => ({
            id: `p4-${i}`,
            filename: `WEB_${200 + i}.png`,
            url: `https://placehold.co/800x800/fee2e2/991b1b?text=Web+${i + 1}`
        }))
    },
    {
        id: 'ORD-5541-ZZ',
        createdAt: '2024-12-20T11:20:00',
        status: 'finished',
        tilesCount: 4,
        total: 800,
        customer: {
            name: 'Zoe Saldana',
            email: 'zoe@space.com',
            phone: '+66 84 000 9999',
            address1: '88 Wireless Road',
            city: 'Bangkok',
            postal: '10330',
            country: 'Thailand'
        },
        photos: Array.from({ length: 4 }).map((_, i) => ({
            id: `p5-${i}`,
            filename: `FIN_${10 + i}.jpg`,
            url: `https://placehold.co/800x800/d1fae5/065f46?text=Fin+${i + 1}`
        }))
    }
];

const TABS = [
    { id: 'new', label: 'New' },
    { id: 'printed', label: 'Printed' },
    { id: 'shipping', label: 'Shipping' },
    { id: 'finished', label: 'Finished' }
];

const STATUS_COLORS = {
    new: { bg: '#DBEAFE', text: '#1E40AF' },
    printed: { bg: '#FEF3C7', text: '#92400E' },
    shipping: { bg: '#E0E7FF', text: '#3730A3' },
    finished: { bg: '#D1FAE5', text: '#065F46' }
};

export default function Admin() {
    // Local State
    const [orders, setOrders] = useState(MOCK_ORDERS);
    const [activeTab, setActiveTab] = useState('new');
    const [selectedOrderId, setSelectedOrderId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [lightboxPhoto, setLightboxPhoto] = useState(null);

    // Selection Mode State
    const [isSelectMode, setIsSelectMode] = useState(false);
    const [selectedPhotoIds, setSelectedPhotoIds] = useState(new Set());

    // Computed
    const filteredOrders = useMemo(() => {
        return orders.filter(order => {
            const matchesTab = order.status === activeTab;
            const q = searchQuery.toLowerCase();
            const matchesSearch =
                order.id.toLowerCase().includes(q) ||
                order.customer.name.toLowerCase().includes(q) ||
                order.customer.phone.includes(q) ||
                order.customer.email.toLowerCase().includes(q);

            return matchesTab && matchesSearch;
        });
    }, [orders, activeTab, searchQuery]);

    const selectedOrder = useMemo(() =>
        orders.find(o => o.id === selectedOrderId),
        [orders, selectedOrderId]);

    // Reset selection when changing order
    useMemo(() => {
        setIsSelectMode(false);
        setSelectedPhotoIds(new Set());
    }, [selectedOrderId]);

    // Handlers
    const handleStatusChange = (orderId, newStatus) => {
        setOrders(prev => prev.map(o =>
            o.id === orderId ? { ...o, status: newStatus } : o
        ));
    };

    const togglePhotoSelection = (photoId) => {
        setSelectedPhotoIds(prev => {
            const newSet = new Set(prev);
            if (newSet.has(photoId)) {
                newSet.delete(photoId);
            } else {
                newSet.add(photoId);
            }
            return newSet;
        });
    };

    const handlePhotoClick = (photo) => {
        if (isSelectMode) {
            togglePhotoSelection(photo.id);
        } else {
            setLightboxPhoto(photo);
        }
    };

    const formatDate = (isoString) => {
        return new Date(isoString).toLocaleString('en-US', {
            month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
        });
    };

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: '#F9FAFB',
            fontFamily: 'Inter, system-ui, sans-serif'
        }}>

            {/* ... Header and Left Panel code remains same ... */}

            {/* ... (Skipping to Right Panel Details) ... */}

            {/* --- MAIN LAYOUT --- */}
            <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

                {/* --- LEFT PANEL: ORDER LIST --- */}
                <div style={{
                    width: '420px',
                    borderRight: '1px solid #E5E7EB',
                    display: 'flex',
                    flexDirection: 'column',
                    backgroundColor: 'white',
                    flexShrink: 0
                }}>
                    {/* Tabs */}
                    <div style={{ display: 'flex', padding: '1rem', gap: '0.5rem', borderBottom: '1px solid #E5E7EB' }}>
                        {TABS.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                style={{
                                    flex: 1,
                                    padding: '0.5rem',
                                    borderRadius: '6px',
                                    fontSize: '0.875rem',
                                    fontWeight: '600',
                                    textAlign: 'center',
                                    backgroundColor: activeTab === tab.id ? '#111827' : 'transparent',
                                    color: activeTab === tab.id ? 'white' : '#6B7280',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    {/* Count */}
                    <div style={{ padding: '0.75rem 1.5rem', borderBottom: '1px solid #F3F4F6', fontSize: '0.75rem', fontWeight: '600', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {filteredOrders.length} Orders
                    </div>

                    {/* List */}
                    <div style={{ flex: 1, overflowY: 'auto' }}>
                        {filteredOrders.map(order => (
                            <div
                                key={order.id}
                                onClick={() => setSelectedOrderId(order.id)}
                                style={{
                                    padding: '1.25rem',
                                    borderBottom: '1px solid #F3F4F6',
                                    cursor: 'pointer',
                                    backgroundColor: selectedOrderId === order.id ? '#F9FAFB' : 'white',
                                    borderLeft: selectedOrderId === order.id ? '4px solid #111827' : '4px solid transparent',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                                    <span style={{ fontWeight: '600', color: '#111827' }}>{order.id}</span>
                                    <span style={{ fontSize: '0.75rem', color: '#6B7280' }}>{formatDate(order.createdAt)}</span>
                                </div>
                                <div style={{ fontWeight: '500', color: '#374151', marginBottom: '0.25rem' }}>{order.customer.name}</div>
                                <div style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.75rem' }}>
                                    {order.tilesCount} tiles · ฿{order.total.toLocaleString()}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div
                                        onClick={(e) => e.stopPropagation()} // Prevent selection when changing status
                                        style={{ position: 'relative' }}
                                    >
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                            style={{
                                                appearance: 'none',
                                                backgroundColor: STATUS_COLORS[order.status].bg,
                                                color: STATUS_COLORS[order.status].text,
                                                border: 'none',
                                                borderRadius: '4px',
                                                padding: '0.25rem 1.5rem 0.25rem 0.5rem',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                textTransform: 'uppercase',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {TABS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
                                        </select>
                                        <ChevronDown size={12} style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: STATUS_COLORS[order.status].text }} />
                                    </div>

                                    <button style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: '500', background: 'none', border: 'none' }}>
                                        Open
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* --- RIGHT PANEL: DETAILS --- */}
                <div style={{ flex: 1, backgroundColor: '#F9FAFB', overflowY: 'auto' }}>
                    {selectedOrder ? (
                        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>

                            {/* Actions Header */}
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <div>
                                    <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>{selectedOrder.id}</h1>
                                    <p style={{ color: '#6B7280' }}>Created on {formatDate(selectedOrder.createdAt)}</p>
                                </div>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <select
                                            value={selectedOrder.status}
                                            onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                                            style={{
                                                appearance: 'none',
                                                padding: '0.75rem 2.5rem 0.75rem 1rem',
                                                borderRadius: '8px',
                                                border: '1px solid #D1D5DB',
                                                backgroundColor: 'white',
                                                fontSize: '0.875rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                minWidth: '160px'
                                            }}
                                        >
                                            {TABS.map(t => <option key={t.id} value={t.id}>Move to {t.label}</option>)}
                                        </select>
                                        <ChevronDown size={16} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none', color: '#6B7280' }} />
                                    </div>
                                    <button style={{ padding: '0.75rem', borderRadius: '8px', border: '1px solid #D1D5DB', backgroundColor: 'white' }}>
                                        <MoreHorizontal size={20} color="#374151" />
                                    </button>
                                </div>
                            </div>

                            {/* Customer & Summary Cards */}
                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                                {/* Customer Info */}
                                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        Customer Details
                                    </h3>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>Contact</p>
                                            <p style={{ fontWeight: '500', color: '#111827' }}>{selectedOrder.customer.name}</p>
                                            <p style={{ color: '#4B5563', fontSize: '0.875rem' }}>{selectedOrder.customer.email}</p>
                                            <p style={{ color: '#4B5563', fontSize: '0.875rem' }}>{selectedOrder.customer.phone}</p>
                                        </div>
                                        <div>
                                            <p style={{ fontSize: '0.875rem', color: '#6B7280', marginBottom: '0.25rem' }}>Shipping Address</p>
                                            <p style={{ fontSize: '0.875rem', color: '#374151', lineHeight: '1.5' }}>
                                                {selectedOrder.customer.address1}<br />
                                                {selectedOrder.customer.address2 && <>{selectedOrder.customer.address2}<br /></>}
                                                {selectedOrder.customer.city}, {selectedOrder.customer.postal}<br />
                                                {selectedOrder.customer.country}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Summary */}
                                <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                    <h3 style={{ fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>Order Summary</h3>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                        <span style={{ color: '#6B7280' }}>Standard Tiles x {selectedOrder.tilesCount}</span>
                                        <span style={{ fontWeight: '500' }}>฿{selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <span style={{ color: '#6B7280' }}>Shipping</span>
                                        <span style={{ fontWeight: '500' }}>Free</span>
                                    </div>
                                    <div style={{ borderTop: '1px solid #F3F4F6', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontSize: '1.125rem', fontWeight: 'bold' }}>
                                        <span>Total</span>
                                        <span>฿{selectedOrder.total.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>

                            {/* --- PHOTOS SECTION --- */}
                            <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E5E7EB', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600' }}>Photos</h3>
                                        <span style={{ backgroundColor: '#F3F4F6', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '600', color: '#4B5563' }}>
                                            {selectedOrder.photos.length} files
                                        </span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                                        <button
                                            onClick={() => {
                                                setIsSelectMode(!isSelectMode);
                                                if (isSelectMode) setSelectedPhotoIds(new Set()); // Clear on cancel
                                            }}
                                            className="btn-secondary"
                                            style={{
                                                padding: '0.5rem 1rem',
                                                fontSize: '0.875rem',
                                                backgroundColor: isSelectMode ? '#FEF2F2' : 'white',
                                                color: isSelectMode ? '#DC2626' : 'inherit',
                                                borderColor: isSelectMode ? '#FECACA' : '#E5E7EB'
                                            }}
                                        >
                                            {isSelectMode ? 'Cancel Selection' : 'Select'}
                                        </button>
                                        <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem', gap: '0.5rem' }}>
                                            <Download size={16} />
                                            {selectedPhotoIds.size > 0 ? `Download Selected (${selectedPhotoIds.size})` : 'Download All'}
                                        </button>
                                    </div>
                                </div>

                                {/* Grid */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                                    gap: '1rem'
                                }}>
                                    {selectedOrder.photos.map(photo => {
                                        const isSelected = selectedPhotoIds.has(photo.id);
                                        return (
                                            <div
                                                key={photo.id}
                                                onClick={() => handlePhotoClick(photo)}
                                                style={{
                                                    aspectRatio: '1/1',
                                                    borderRadius: '8px',
                                                    overflow: 'hidden',
                                                    position: 'relative',
                                                    cursor: 'pointer',
                                                    border: isSelected ? '3px solid #3B82F6' : '1px solid #E5E7EB',
                                                    backgroundColor: '#F9FAFB',
                                                    transition: 'all 0.1s'
                                                }}
                                                className="group"
                                            >
                                                <img
                                                    src={photo.url}
                                                    alt={photo.filename}
                                                    style={{
                                                        width: '100%',
                                                        height: '100%',
                                                        objectFit: 'cover',
                                                        opacity: (isSelectMode && !isSelected) ? 0.6 : 1
                                                    }}
                                                />
                                                {/* Filename Overlay */}
                                                <div style={{
                                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                                    backgroundColor: 'rgba(0,0,0,0.6)',
                                                    color: 'white',
                                                    fontSize: '0.65rem',
                                                    padding: '0.25rem 0.5rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}>
                                                    {photo.filename}
                                                </div>

                                                {/* Selection Indicator */}
                                                {isSelectMode && (
                                                    <div style={{
                                                        position: 'absolute', top: 8, right: 8,
                                                        width: '20px', height: '20px',
                                                        backgroundColor: isSelected ? '#3B82F6' : 'rgba(255,255,255,0.8)',
                                                        borderRadius: '50%',
                                                        border: isSelected ? 'none' : '2px solid white',
                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                                    }}>
                                                        {isSelected && <Check size={14} color="white" />}
                                                    </div>
                                                )}

                                                {/* Ready Indicator (Only in normal mode) */}
                                                {!isSelectMode && (
                                                    <div style={{
                                                        position: 'absolute', top: 4, right: 4,
                                                        backgroundColor: 'white', borderRadius: '50%', padding: '2px',
                                                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                                                    }}>
                                                        <Check size={12} color="black" />
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>
                    ) : (
                        <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9CA3AF', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <ImageIcon size={40} color="#D1D5DB" />
                            </div>
                            <p>Select an order to view details</p>
                        </div>
                    )}
                </div>
            </div>

            {/* --- LIGHTBOX --- */}
            {lightboxPhoto && (
                <div style={{
                    position: 'fixed', inset: 0, zIndex: 100,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    padding: '2rem'
                }} onClick={() => setLightboxPhoto(null)}>

                    <button
                        onClick={() => setLightboxPhoto(null)}
                        style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer' }}
                    >
                        <X size={32} />
                    </button>

                    <div style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%' }} onClick={e => e.stopPropagation()}>
                        <img
                            src={lightboxPhoto.url}
                            alt={lightboxPhoto.filename}
                            style={{ maxWidth: '80vw', maxHeight: '80vh', borderRadius: '4px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}
                        />
                        <div style={{
                            marginTop: '1rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            color: 'white'
                        }}>
                            <div>
                                <p style={{ fontWeight: '600' }}>{lightboxPhoto.filename}</p>
                                <p style={{ fontSize: '0.875rem', opacity: 0.8 }}>Original Quality</p>
                            </div>
                            <button className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <Download size={16} />
                                Download Original
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
