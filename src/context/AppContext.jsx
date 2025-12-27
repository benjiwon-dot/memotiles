import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const AppContext = createContext();

export function AppProvider({ children }) {
    // Mock State
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [language, setLanguage] = useState('EN');
    const [cart, setCart] = useState([]); // Array of tile objects
    const [tilesReadyCount, setTilesReadyCount] = useState(0);
    const [orders, setOrders] = useState([]);

    // Mock functions
    const login = () => setIsLoggedIn(true);
    const logout = () => {
        setIsLoggedIn(false);
        // Optional: clear cart on logout or keep it?
    };

    const addTileToCart = (tile) => {
        setCart((prev) => [...prev, tile]);
        setTilesReadyCount((prev) => prev + 1);
    };

    const createOrder = (shippingDetails) => {
        const newOrder = {
            id: Math.floor(Math.random() * 10000).toString(),
            date: new Date().toISOString(),
            status: 'Printing',
            items: [...cart],
            total: cart.length * 200, // Mock price 200 THB per tile?
            shipping: shippingDetails
        };
        setOrders((prev) => [newOrder, ...prev]);
        setCart([]);
        setTilesReadyCount(0);
    };

    // Translation Helper
    const t = (key) => {
        return translations[language][key] || key;
    };

    const value = {
        isLoggedIn,
        login,
        logout,
        language,
        setLanguage,
        cart,
        tilesReadyCount,
        addTileToCart,
        orders,
        createOrder,
        t
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    return useContext(AppContext);
}
