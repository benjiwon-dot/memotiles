import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Package, Clock, CheckCircle, Image as ImageIcon, ChevronDown, ChevronUp } from 'lucide-react';

export default function Orders() {
    const { orders, t } = useApp();
    const [activeTab, setActiveTab] = useState('active');
    const [expandedOrderId, setExpandedOrderId] = useState(null);

    // Filter orders (Mock logic: Delivered = Past, others = Active)
    const activeOrders = orders.filter(o => o.status !== 'Delivered');
    const pastOrders = orders.filter(o => o.status === 'Delivered');

    // Create a mock past order if none exist just for UI demo? 
    // Maybe better not to confuse state. I'll just render what's there.

    const displayedOrders = activeTab === 'active' ? activeOrders : pastOrders;

    const toggleExpand = (id) => {
        setExpandedOrderId(expandedOrderId === id ? null : id);
    };

    return (
        <div className="container" style={{ marginTop: '2rem', maxWidth: '800px' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '2rem' }}>{t('ordersTitle')}</h1>

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid var(--border)', marginBottom: '2rem' }}>
                <button
                    onClick={() => setActiveTab('active')}
                    style={{
                        padding: '1rem 2rem',
                        borderBottom: activeTab === 'active' ? '2px solid var(--primary)' : '2px solid transparent',
                        fontWeight: activeTab === 'active' ? '600' : '400',
                        color: activeTab === 'active' ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                >
                    {t('active')} ({activeOrders.length})
                </button>
                <button
                    onClick={() => setActiveTab('past')}
                    style={{
                        padding: '1rem 2rem',
                        borderBottom: activeTab === 'past' ? '2px solid var(--primary)' : '2px solid transparent',
                        fontWeight: activeTab === 'past' ? '600' : '400',
                        color: activeTab === 'past' ? 'var(--primary)' : 'var(--text-secondary)'
                    }}
                >
                    {t('past')} ({pastOrders.length})
                </button>
            </div>

            {/* Orders List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {displayedOrders.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem 0', color: 'var(--text-secondary)' }}>
                        <Package size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                        <p>{t('noOrders')}</p>
                    </div>
                ) : (
                    displayedOrders.map(order => (
                        <div key={order.id} className="card" style={{ padding: '0', overflow: 'hidden' }}>

                            {/* Header */}
                            <div
                                onClick={() => toggleExpand(order.id)}
                                style={{
                                    padding: '1.5rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    backgroundColor: 'white'
                                }}
                            >
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontWeight: 'bold' }}>{t('orderNumber')}{order.id}</span>
                                        <span className="badge" style={{ backgroundColor: order.status === 'Delivered' ? '#D1FAE5' : '#DBEAFE', color: order.status === 'Delivered' ? '#065F46' : '#1E40AF' }}>
                                            {t(order.status.toLowerCase()) || order.status}
                                        </span>
                                    </div>
                                    <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                                        {new Date(order.date).toLocaleDateString()} &bull; ฿{order.total} &bull; {order.items.length} {t('items')}
                                    </span>
                                </div>
                                {expandedOrderId === order.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                            </div>

                            {/* Expanded Details */}
                            {expandedOrderId === order.id && (
                                <div style={{ borderTop: '1px solid var(--border)', padding: '1.5rem', backgroundColor: '#F9FAFB' }}>

                                    {/* Thumbnails */}
                                    <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} style={{ flexShrink: 0, width: '80px', height: '80px', background: '#E5E7EB', borderRadius: 'var(--radius-sm)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                                <ImageIcon size={24} color="var(--text-tertiary)" />
                                            </div>
                                        ))}
                                    </div>

                                    {/* Timeline */}
                                    <div style={{ marginBottom: '2rem' }}>
                                        <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '1rem' }}>{t('orderStatus')}</h4>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.875rem' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary)' }}>
                                                <CheckCircle size={16} /> {t('printing')}
                                            </div>
                                            <div style={{ height: '1px', flex: 1, backgroundColor: order.status !== 'Printing' ? '#10B981' : '#E5E7EB' }}></div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: order.status !== 'Printing' ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                                                <CheckCircle size={16} /> {t('shipped')}
                                            </div>
                                            <div style={{ height: '1px', flex: 1, backgroundColor: order.status === 'Delivered' ? '#10B981' : '#E5E7EB' }}></div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: order.status === 'Delivered' ? 'var(--primary)' : 'var(--text-tertiary)' }}>
                                                <CheckCircle size={16} /> {t('delivered')}
                                            </div>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>{t('shippingAddress')}</h4>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: '1.5' }}>
                                                {order.shipping.name}<br />
                                                {order.shipping.address}<br />
                                                {order.shipping.city} {order.shipping.postalCode}<br />
                                                {order.shipping.country}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <button disabled className="btn btn-secondary" style={{ opacity: 0.5 }}>
                                                {t('reorder')}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
