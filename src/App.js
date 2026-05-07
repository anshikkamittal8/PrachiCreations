import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Page Imports
import Home from './pages/Home';
import Collections from './pages/Collections';
import Contact from './pages/Contact';
import CategoryDetail from './pages/CategoryDetail';
import ProductDetails from './pages/ProductDetails'; // Fixed the missing import

const Navbar = () => (
    <nav className="flex justify-between items-center px-10 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
        <Link to="/" className="brand-font text-3xl text-[#4A3B3B]">Prachi Creations</Link>
        <div className="hidden md:flex gap-8 font-medium text-[#4A3B3B]">
            <Link to="/" className="hover:text-pink-400 transition">Home</Link>
            <Link to="/collections" className="hover:text-pink-400 transition">Collections</Link>
            <Link to="/contact" className="hover:text-pink-400 transition">Contact</Link>
        </div>
        <Link to="/collections" className="bg-[#FDE2E4] px-6 py-2 rounded-full font-semibold hover:shadow-lg transition text-[#4A3B3B]">
            Shop Now
        </Link>
    </nav>
);

const FooterBanner = () => (
    <footer className="bg-purple-100/50 py-4 text-center text-sm font-medium border-t border-purple-200">
        DM/WhatsApp for more customization or your Pinterest references 💕 ✨
    </footer>
);

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-[#FFFDF9] flex flex-col">
                <Navbar />

                {/* Main Content Area */}
                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />

                        {/* Gallery of all categories */}
                        <Route path="/collections" element={<Collections />} />

                        {/* List of products in a specific category (e.g. /collections/photo-stonework) */}
                        <Route path="/collections/:slug" element={<CategoryDetail />} />

                        {/* Individual product page for ordering */}
                        <Route path="/product/:productId" element={<ProductDetails />} />

                        <Route path="/contact" element={<Contact />} />
                    </Routes>
                </main>

                <FooterBanner />
            </div>
        </Router>
    );
}

export default App;