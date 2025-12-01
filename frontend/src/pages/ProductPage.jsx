import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { getItem } from '../api/client';
import Header from '../components/Header';
import Footer from '../components/Footer';
import bannerJPG from '../assets/img/banner.jpg';

export default function ProductPage() {
    const { id } = useParams();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [count, setCount] = useState(1);

    useEffect(() => {
        let ignore = false;

        async function loadItem() {
            try {
                setLoading(true);
                setError(null);
                const data = await getItem(id);
                if (!ignore) {
                    setItem(data);
                    setSelectedSize(null); // сбрасываем выбор размера при загрузке нового товара
                    setCount(1);
                }
            } catch (err) {
                if (!ignore) {
                    setError(err.message || 'Не удалось загрузить товар');
                }
            } finally {
                if (!ignore) {
                    setLoading(false);
                }
            }
        }

        loadItem();

        return () => {
            ignore = true;
        };
    }, [id]);

    const handlerRetry = () => {
        setItem(null);
        setError(null);
        setSelectedSize(null);
        setCount(1);
        setLoading(true);
        getItem(id)
            .then((data) => {
                setItem(data);
                setSelectedSize(null);
                setCount(1);
            })
            .catch((err) => setError(err.message || 'Не удалось загрузить товар'))
            .finally(() => setLoading(false));
    };

    const handleSizeClick = (size) => {
        // Если кликнули по уже выбранному размеру - снимаем выбор
        if (selectedSize === size) {
            setSelectedSize(null);
            setCount(1); // сбрасываем количество при снятии выбора размера
        } else {
            setSelectedSize(size);
        }
    };

    const handleDecrease = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const handleIncrease = () => {
        if (count < 10) {
            setCount(count + 1);
        }
    };

    const navigate = useNavigate();
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Пожалуйста, выберите размер');
            return;
        }

        // Добавляем товар в корзину
        addToCart({id: item.id,
                title: item.title,
                price: item.price, // Сохраняем цену на момент покупки
                size: selectedSize,
                count: count,});


        // Переходим в корзину            
        navigate('/cart.html');
    };

    const availableSizes = item?.sizes?.filter((size) => size.available) || [];
    const hasAvailableSizes = availableSizes.length > 0;

    if (!loading && !error && !item) {
        return null;
    }

    return (
        <>
            <Header />
            <main className="container">
                <div className="row">
                    <div className="col">
                        <div className="banner">
                            <img src={bannerJPG} className="img-fluid" alt="К весне готовы!" />
                            <h2 className="banner-header">К весне готовы!</h2>
                        </div>
                        <section className="catalog-item">
                            <h2 className="text-center">{item?.title || 'Загрузка...'}</h2>

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
                                    <button
                                        type="button"
                                        className="btn btn-outline-success btn-sm ml-3"
                                        onClick={handlerRetry}
                                    >
                                        Повторить
                                    </button>
                                </div>
                            )}

                            {!loading && !error && item && (
                                <div className="row">
                                    <div className="col-5">
                                        <img src={item.images?.[0]} className="img-fluid" alt={item.title} />
                                    </div>
                                    <div className="col-7">
                                        <table className="table table-bordered">
                                            <tbody>
                                                <tr>
                                                    <td>Артикул</td>
                                                    <td>{item.sku || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td>Производитель</td>
                                                    <td>{item.manufacturer || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td>Цвет</td>
                                                    <td>{item.color || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td>Материалы</td>
                                                    <td>{item.material || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td>Сезон</td>
                                                    <td>{item.season || ''}</td>
                                                </tr>
                                                <tr>
                                                    <td>Повод</td>
                                                    <td>{item.reason || ''}</td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        {hasAvailableSizes && (
                                            <>
                                                <div className="text-center">
                                                    <p>
                                                        Размеры в наличии:{' '}
                                                        {item.sizes
                                                            ?.filter((size) => size.available)
                                                            .map((size) => (
                                                                <span
                                                                    key={size.size}
                                                                    className={`catalog-item-size ${selectedSize === size.size ? 'selected' : ''}`}
                                                                    onClick={() => handleSizeClick(size.size)}
                                                                    style={{ cursor: 'pointer' }}
                                                                >
                                                                    {size.size}
                                                                </span>
                                                            ))}
                                                    </p>
                                                    <p>
                                                        Количество:{' '}
                                                        <span className="btn-group btn-group-sm pl-2">
                                                            <button
                                                                className="btn btn-secondary"
                                                                onClick={handleDecrease}
                                                                disabled={count <= 1}
                                                            >
                                                                -
                                                            </button>
                                                            <span className="btn btn-outline-primary">{count}</span>
                                                            <button
                                                                className="btn btn-secondary"
                                                                onClick={handleIncrease}
                                                                disabled={count >= 10}
                                                            >
                                                                +
                                                            </button>
                                                        </span>
                                                    </p>
                                                </div>
                                                <button
                                                    className="btn btn-danger btn-block btn-lg"
                                                    onClick={handleAddToCart}
                                                    disabled={!selectedSize}
                                                >
                                                    В корзину
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            )}
                        </section>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    )
}