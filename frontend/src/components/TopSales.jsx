import { useState, useEffect } from 'react';
import { getTopSales } from '../api/client';

export default function TopSales() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    useEffect(() => {
        let ignore = false;

        async function loadTopSales() {
            try {
                setLoading(true);
                setError(null);
                const data = await getTopSales();
                if (!ignore) {
                    setItems(data);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || 'Не удалось загрузить хиты продаж');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadTopSales();

        return () => { ignore = true };
    }, []);

    const handlerRetry = () => {
        setItems([]);
        setError(null);
        setLoading(true);
        getTopSales()
            .then(setItems)
            .catch((err) => setError(err.message || 'Не удалось загрузить хиты продаж'))
            .finally(() => setLoading(false));
    }

    if (!loading && !error && items.length === 0) {
        return null;
    }

    return (
        <section className="top-sales">
            <h2 className="text-center">Хиты продаж!</h2>

            {loading && (
                <div className="preloader">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            )}

            {error && (
                <div className="alert alert-danger mt-3">
                    Ошибка загрузки: {error}
                    <button type="button"
                        className="btn btn-outline-success btn-sm ml-3"
                        onClick={handlerRetry}>Повторить</button>
                </div>
            )}

            {!loading && !error && (
                <div className="row">
                    {items.map((item) => (
                        <div className="col-4" key={item.id}>
                            <div className="card catalog-item-card">
                                <img src={item.images?.[0]} className="card-img-top img-fluid" alt={item.title} />
                                <div className="card-body">
                                    <p className="card-text">{item.title}</p>
                                    <p className="card-text">{item.price.toLocaleString('ru-RU')} руб.</p>
                                    <a href={`/catalog/${item.id}.html`} className="btn btn-outline-primary">Заказать</a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}