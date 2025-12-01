import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cartItems, setCartItems] = useState([]);

    // Загружаем корзину из localStorage при монтировании
    useEffect(() => {
        const saved = localStorage.getItem('cart');
        if (saved) {
            try {
                setCartItems(JSON.parse(saved));
            } catch (err) {
                console.error('Ошибка загрузки корзины:', err);
            }
        }
    }, []);

    // Сохраняем корзину в localStorage при каждом изменении
    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Функция добавления товара в корзину
    const addToCart = (item) => {
        setCartItems((prev) => {
            // Проверяем, есть ли уже такой товар с таким же размером
            const existingIndex = prev.findIndex(
                (cartItem) => cartItem.id === item.id && cartItem.size === item.size
            );

            if (existingIndex >= 0) {
                // Если есть - увеличиваем количество
                const updated = [...prev];
                updated[existingIndex].count += item.count;
                return updated;
            } else {
                // Если нет - добавляем новый
                return [...prev, item];
            }
        });
    };

    // Функция удаления товара из корзины
    const removeFromCart = (id, size) => {
        setCartItems((prev) => prev.filter(
            (item) => !(item.id === id && item.size === size)
        ));
    };

    // Функция очистки корзины
    const clearCart = () => {
        setCartItems([]);
    };

    // Подсчёт общего количества позиций
    const totalItems = cartItems.length;

    // Подсчёт общего количества штук (сумма всех count)
    const totalCount = cartItems.reduce((sum, item) => sum + item.count, 0);

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalCount,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// Хук для использования корзины в компонентах
export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
}