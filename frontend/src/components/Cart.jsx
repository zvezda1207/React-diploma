import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { postOrder } from '../api/client';
import bannerJPG from '../assets/img/banner.jpg';

export default function Cart() {
    const { cartItems, removeFromCart, clearCart } = useCart();
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [agreement, setAgreement] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Подсчёт общей стоимости
    const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.count, 0);

    // Обработчик отправки формы
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Проверка валидности
        if (!phone.trim() || !address.trim()) {
            setError('Заполните все поля');
            return;
        }

        if (!agreement) {
            setError('Необходимо согласие с правилами доставки');
            return;
        }

        if (cartItems.length === 0) {
            setError('Корзина пуста');
            return;
        }

        try {
            setLoading(true);
            setError(null);

            // Формируем данные для отправки
            const orderData = {
                owner: {
                    phone: phone.trim(),
                    address: address.trim(),
                },
                items: cartItems.map((item) => ({
                    id: item.id,
                    price: item.price,
                    count: item.count,
                })),
            };

            // Отправляем заказ
            await postOrder(orderData);

            // Если успешно - очищаем корзину и форму
            clearCart();
            setPhone('');
            setAddress('');
            setAgreement(false);
            setSuccess(true);

            // Через 3 секунды скрываем сообщение об успехе
            setTimeout(() => {
                setSuccess(false);
            }, 3000);
        } catch (err) {
            setError(err.message || 'Не удалось оформить заказ');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="container">
            <div className="row">
                <div className="col">
                    <div className="banner">
                        <img src={bannerJPG} className="img-fluid" alt="К весне готовы!" />
                        <h2 className="banner-header">К весне готовы!</h2>
                    </div>
                    <section className="cart">
                        <h2 className="text-center">Корзина</h2>
                        {cartItems.length === 0 ? (
                            <p className="text-center">Корзина пуста</p>
                        ) : (
                            <table className="table table-bordered">
                                <thead>
                                    <tr>
                                        <th scope="col">#</th>
                                        <th scope="col">Название</th>
                                        <th scope="col">Размер</th>
                                        <th scope="col">Кол-во</th>
                                        <th scope="col">Стоимость</th>
                                        <th scope="col">Итого</th>
                                        <th scope="col">Действия</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cartItems.map((item, index) => (
                                        <tr key={`${item.id}-${item.size}`}>
                                            <td scope="row">{index + 1}</td>
                                            <td>
                                                <Link to={`/catalog/${item.id}.html`}>{item.title}</Link>
                                            </td>
                                            <td>{item.size}</td>
                                            <td>{item.count}</td>
                                            <td>{item.price.toLocaleString('ru-RU')} руб.</td>
                                            <td>{(item.price * item.count).toLocaleString('ru-RU')} руб.</td>
                                            <td>
                                                <button
                                                    className="btn btn-outline-danger btn-sm"
                                                    onClick={() => removeFromCart(item.id, item.size)}
                                                >
                                                    Удалить
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    <tr>
                                        <td colSpan="5" className="text-right">
                                            Общая стоимость
                                        </td>
                                        <td>{totalPrice.toLocaleString('ru-RU')} руб.</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </section>
                    {cartItems.length > 0 && (
                        <section className="order">
                            <h2 className="text-center">Оформить заказ</h2>
                            <div className="card" style={{ maxWidth: '30rem', margin: '0 auto' }}>
                                <form className="card-body" onSubmit={handleSubmit}>
                                    {error && (
                                        <div className="alert alert-danger">
                                            {error}
                                        </div>
                                    )}

                                    {success && (
                                        <div className="alert alert-success">
                                            Заказ успешно оформлен!
                                        </div>
                                    )}

                                    <div className="form-group">
                                        <label htmlFor="phone">Телефон</label>
                                        <input
                                            className="form-control"
                                            id="phone"
                                            placeholder="Ваш телефон"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="address">Адрес доставки</label>
                                        <input
                                            className="form-control"
                                            id="address"
                                            placeholder="Адрес доставки"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            disabled={loading}
                                            required
                                        />
                                    </div>
                                    <div className="form-group form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="agreement"
                                            checked={agreement}
                                            onChange={(e) => setAgreement(e.target.checked)}
                                            disabled={loading}
                                            required
                                        />
                                        <label className="form-check-label" htmlFor="agreement">
                                            Согласен с правилами доставки
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-outline-secondary"
                                        disabled={loading}
                                    >
                                        {loading ? 'Оформление...' : 'Оформить'}
                                    </button>
                                </form>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </main>
    )
}