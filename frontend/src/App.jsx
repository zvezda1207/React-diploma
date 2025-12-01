import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import ProductPage from './pages/ProductPage';
import AboutPage from './pages/AboutPage';
import ContactsPage from './pages/ContactsPage';
import CartPage from './pages/CartPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {
  return (
    <CartProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/catalog.html" element={<CatalogPage />} />
        <Route path="/about.html" element={<AboutPage />} />
        <Route path="/contacts.html" element={<ContactsPage />} />
        <Route path="/catalog/:id.html" element={<ProductPage />} />
        <Route path="/cart.html" element={<CartPage />} />
        <Route path="/404.html" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </CartProvider>
  )
}

export default App
