import { useState, useEffect, useCallback, useRef } from 'react';
import { getItems, getCategories } from '../api/client';

export default function Catalog({ enableSearch = false, initialSearchQuery = '' }) {
    const [searchInput, setSearchInput] = useState(initialSearchQuery);
    const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
    const [categories, setCategories] = useState([]);
    const [activeCategory, setActiveCategory] = useState(null);
    const [items, setItems] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingItems, setLoadingItems] = useState(false);
    const [errorCategories, setErrorCategories] = useState(null);
    const [errorItems, setErrorItems] = useState(null);
    const [hasMore, setHasMore] = useState(false);
    const offsetRef = useRef(0);

    const loadCategories = useCallback(async () => {
        try {
            setLoadingCategories(true);
            setErrorCategories(null);
            const data = await getCategories();
            setCategories([{ id: null, title: 'Все' }, ...data]);
        } catch (err) {
            setErrorCategories(err.message || 'Не удалось загрузить категории');
        } finally {
            setLoadingCategories(false);
        }
    }, []);

    const loadItems = useCallback(
        async ({ reset = false } = {}) => {
            try {
                if (reset) {
                    setItems([]);
                    offsetRef.current = 0;
                    setHasMore(false);
                }

                setLoadingItems(true);
                setErrorItems(null);

                const params = {};
                if (activeCategory) params.categoryId = activeCategory;
                if (searchQuery) params.q = searchQuery;
                if (!reset && offsetRef.current > 0) params.offset = offsetRef.current;

                const data = await getItems(params);

                if (reset) {
                    setItems(data);
                } else {
                    setItems((prev) => [...prev, ...data]);
                }

                offsetRef.current += data.length;
                setHasMore(data.length >= 6);
            } catch (err) {
                setErrorItems(err.message || 'Не удалось загрузить товары');
            } finally {
                setLoadingItems(false);
            }
        },
        [activeCategory, searchQuery],
    );

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    // Обработка начального поискового запроса из URL
    useEffect(() => {
        if (initialSearchQuery) {
            setSearchInput(initialSearchQuery);
            setSearchQuery(initialSearchQuery);
        }
    }, [initialSearchQuery]);

    useEffect(() => {
        loadItems({ reset: true });
    }, [activeCategory, searchQuery, loadItems]);

    const handleRetryCategories = () => {
        loadCategories();
    };

    const handleCategoryChange = (categoryId) => {
        if (categoryId === activeCategory) return;
        setActiveCategory(categoryId);
    };

    const handleRetryItems = () => {
        loadItems({ reset: items.length === 0 });
    };

    const handleLoadMore = () => {
        loadItems();
    };

    return (
        <section className="catalog">
            <h2 className="text-center">Каталог</h2>

            {loadingCategories && <div className="text-center my-3">Загрузка категорий...</div>}

            {errorCategories && (
                <div className="text-center text-danger mt-3">
                    Ошибка загрузки: {errorCategories}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm ml-3"
                        onClick={handleRetryCategories}
                    >
                        Повторить
                    </button>
                </div>
            )}

            {!loadingCategories && !errorCategories && (
                <ul className="catalog-categories nav justify-content-center">
                    {categories.map((category) => (
                        <li className="nav-item" key={category.id ?? 'all'}>
                            <button
                                type="button"
                                className={`nav-link ${activeCategory === category.id ? 'active' : ''}`}
                                onClick={() => handleCategoryChange(category.id)}
                            >
                                {category.title}
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {enableSearch && (
                <form
                    className="catalog-search-form form-inline"
                    onSubmit={(evt) => {
                        evt.preventDefault();
                        const nextQuery = searchInput.trim();
                        if (nextQuery === searchQuery) return;
                        setSearchQuery(nextQuery);
                        loadItems({ reset: true });
                    }}
                >
                    <input
                        className="form-control"
                        placeholder="Поиск"
                        value={searchInput}
                        onChange={(evt) => setSearchInput(evt.target.value)}
                    />
                </form>
            )}

            {loadingItems && items.length === 0 && (
                <div className="preloader">
                    <span /> <span /> <span /> <span />
                </div>
            )}

            {errorItems && (
                <div className="text-center text-danger mt-3">
                    Ошибка загрузки: {errorItems}
                    <button
                        type="button"
                        className="btn btn-outline-primary btn-sm ml-3"
                        onClick={handleRetryItems}
                    >
                        Повторить
                    </button>
                </div>
            )}

            {!loadingItems && !errorItems && items.length === 0 && (
                <p className="text-center">В этой категории пока нет товаров.</p>
            )}

            <div className="row">
                {items.map((item) => (
                    <div className="col-4" key={`${item.id}-${item.sku || ''}`}>
                        <div className="card catalog-item-card">
                            <img src={item.images?.[0]} className="card-img-top img-fluid" alt={item.title} />
                            <div className="card-body">
                                <p className="card-text">{item.title}</p>
                                <p className="card-text">{item.price.toLocaleString('ru-RU')} руб.</p>
                                <a href={`/catalog/${item.id}.html`} className="btn btn-outline-primary">
                                    Заказать
                                </a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {hasMore && !loadingItems && !errorItems && (
                <div className="text-center">
                    <button className="btn btn-outline-primary" onClick={handleLoadMore}>
                        Загрузить ещё
                    </button>
                </div>
            )}
        </section>
    );
}