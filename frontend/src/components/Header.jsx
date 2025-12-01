import { useState } from "react";
import headerLogoPNG from "../assets/img/header-logo.png";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const { totalCount } = useCart();
    const navigate = useNavigate();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    // Обработчик клика на иконку поиска
    const handleSearchClick = () => {
        if (isSearchVisible) {
            // Если форма открыта и есть текст - переходим на каталог
            if (searchQuery.trim()) {
                navigate(`/catalog.html?q=${encodeURIComponent(searchQuery.trim())}`);
                setIsSearchVisible(false);
                setSearchQuery('');
            } else {
                // Если текста нет - просто закрываем
                setIsSearchVisible(false);
            }
        } else {
            // Открываем форму поиска
            setIsSearchVisible(true);
        }
    };

    // Обработчик отправки формы поиска
    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/catalog.html?q=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchVisible(false);
            setSearchQuery('');
        }
    };

    return (
        <header className="container">
            <div className="row">
                <div className="col">
                    <nav className="navbar navbar-expand-sm navbar-light bg-light">
                        <a className="navbar-brand" href="/">
                            <img src={headerLogoPNG} alt="Bosa Noga" />
                        </a>
                        <div className="collapse navbar-collapse" id="navbarMain">
                            <ul className="navbar-nav mr-auto">
                                <li className="nav-item active">
                                    <a className="nav-link" href="/">Главная</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/catalog.html">Каталог</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/about.html">О магазине</a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="/contacts.html">Контакты</a>
                                </li>
                            </ul>
                            <div>
                                <div className="header-controls-pics">
                                    <div
                                        data-id="search-expander"
                                        className="header-controls-pic header-controls-search"
                                        onClick={handleSearchClick}
                                        style={{ cursor: 'pointer' }}
                                    ></div>
                                    <div className="header-controls-pic header-controls-cart"
                                        onClick={() => navigate('/cart.html')}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {totalCount > 0 && (
                                            <div className="header-controls-cart-full">
                                                {totalCount}
                                            </div>
                                        )}
                                        <div className="header-controls-cart-menu"></div>
                                    </div>
                                </div>
                                <form
                                    data-id="search-form"
                                    className={`header-controls-search-form form-inline ${isSearchVisible ? '' : 'invisible'}`}
                                    onSubmit={handleSearchSubmit}
                                >
                                    <input
                                        className="form-control"
                                        placeholder="Поиск"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </form>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    )
}
