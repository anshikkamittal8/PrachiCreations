import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { supabase } from './supabaseClient'; // Ensure this path is correct

// Page Imports
import Home from './pages/Home';
import Collections from './pages/Collections';
import Contact from './pages/Contact';
import CategoryDetail from './pages/CategoryDetail';
import ProductDetails from './pages/ProductDetails';

const Navbar = () => {
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    // Fetch categories dynamically from Supabase for the dropdown
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const { data, error } = await supabase
                    .from('category')
                    .select('name, slug');
                if (error) throw error;
                setCategories(data || []);
            } catch (err) {
                console.error("Error fetching categories for navbar:", err.message);
            }
        };
        fetchCategories();
    }, []);

    return (
        <nav className="flex justify-between items-center px-6 md:px-10 py-6 sticky top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
            {/* Brand Logo */}
            <Link to="/" className="brand-font text-2xl md:text-3xl text-[#4A3B3B]">
                Prachi Creations
            </Link>

            {/* Nav Links */}
            <div className="hidden md:flex gap-8 items-center font-medium text-[#4A3B3B]">
                <Link to="/" className="hover:text-pink-400 transition">Home</Link>

                {/* Dynamic Collections Dropdown */}
                <div
                    className="relative group"
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                >
                    <button className="flex items-center gap-1 hover:text-pink-400 transition py-2 outline-none">
                        Collections
                        <span className={`text-[10px] transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`}>
                            ▼
                        </span>
                    </button>

                    {/* Dropdown Menu Overlay */}
                    {isDropdownOpen && (
                        <div className="absolute top-full left-0 w-64 bg-white shadow-xl rounded-2xl p-4 border border-pink-50 animate-in fade-in slide-in-from-top-2">
                            <div className="flex flex-col gap-1">
                                <Link
                                    to="/collections"
                                    onClick={() => setIsDropdownOpen(false)}
                                    className="p-2 hover:bg-pink-50 rounded-lg text-sm font-bold text-pink-400 border-b border-pink-50 mb-1"
                                >
                                    View All Collections
                                </Link>
                                {categories.map((cat) => (
                                    <Link
                                        key={cat.slug}
                                        to={`/collections/${cat.slug}`}
                                        className="p-2 hover:bg-pink-50 rounded-lg text-sm text-gray-600 hover:text-pink-500 transition capitalize"
                                        onClick={() => setIsDropdownOpen(false)}
                                    >
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <Link to="/contact" className="hover:text-pink-400 transition">Contact</Link>
            </div>

            {/* CTA Button */}
            <Link to="/collections" className="bg-[#FDE2E4] px-4 md:px-6 py-2 rounded-full font-semibold hover:shadow-lg transition text-[#4A3B3B] text-sm md:text-base">
                Shop Now
            </Link>
        </nav>
    );
};

const FooterBanner = () => (
    <footer className="bg-purple-100/50 py-4 text-center text-sm font-medium border-t border-purple-200 mt-auto">
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
                        <Route path="/collections" element={<Collections />} />
                        <Route path="/collections/:slug" element={<CategoryDetail />} />
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