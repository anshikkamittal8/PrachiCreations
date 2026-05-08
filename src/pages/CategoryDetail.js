import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const CategoryDetail = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Cloudinary Optimization Helper
    const getOptimizedUrl = (url, width = 600) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    };

    // Monitor scroll for "Back to Top" button
    useEffect(() => {
        const handleScroll = () => {
            setShowBackToTop(window.scrollY > 400);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const { data: categoryData } = await supabase
                    .from('category').select('id, name').eq('slug', slug).single();

                if (categoryData) {
                    setCategoryName(categoryData.name);
                    const { data: productData } = await supabase
                        .from('products').select('*').eq('category_id', categoryData.id);

                    setProducts(productData || []);
                    setFilteredProducts(productData || []);
                }
            } catch (error) {
                console.error("Error:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchDetails();
    }, [slug]);

    // --- SEARCH LOGIC ---
    useEffect(() => {
        const results = products.filter(product => {
            const searchLower = searchTerm.toLowerCase();
            // Matches Name, Description, or the word "custom" if price is 0
            const matchesName = product.name.toLowerCase().includes(searchLower);
            const matchesDesc = product.description?.toLowerCase().includes(searchLower);
            const isCustomSearch = searchLower === 'custom' || searchLower === 'customize';
            const matchesCustom = isCustomSearch && (product.price === 0 || product.price === null);

            return matchesName || matchesDesc || matchesCustom;
        });
        setFilteredProducts(results);
    }, [searchTerm, products]);

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    if (loading) return <div className="h-[60vh] flex items-center justify-center brand-font text-2xl animate-pulse">Loading treasures... ✨</div>;

    return (
        <div className="min-h-screen bg-[#FFFDF9] pb-20 relative">

            {/* Search Bar Section */}
            <div className="sticky top-0 z-30 bg-[#FFFDF9]/80 backdrop-blur-md py-4 px-6 md:px-20 border-b border-pink-50">
                <div className="max-w-xl mx-auto relative">
                    <input
                        type="text"
                        placeholder="Search for 'custom', 'anniversary', 'blue'..."
                        className="w-full pl-12 pr-4 py-3 rounded-full border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200 shadow-sm"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-5 top-3.5 text-gray-400">🔍</span>
                </div>
            </div>

            <header className="text-center py-10 px-6">
                <h2 className="brand-font text-5xl md:text-7xl text-[#4A3B3B]">{categoryName}</h2>
                <p className="text-gray-400 mt-2 italic">{filteredProducts.length} items found</p>
            </header>

            <section className="px-4 md:px-20 mt-6">
                {filteredProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 md:gap-12">
                        {filteredProducts.map((product, index) => (
                            <div key={product.id} className="group bg-white rounded-[2rem] overflow-hidden border border-pink-50 shadow-sm hover:shadow-xl transition-all flex flex-col">
                                <div className="h-44 md:h-80 overflow-hidden bg-gray-50 flex items-center justify-center p-4">
                                    <img
                                        src={getOptimizedUrl(product.image_url)}
                                        alt={product.name}
                                        loading={index < 4 ? "eager" : "lazy"}
                                        className="max-h-full object-contain group-hover:scale-105 transition-transform duration-500"
                                    />
                                </div>
                                <div className="p-4 md:p-6 flex-grow flex flex-col justify-between">
                                    <h4 className="font-bold text-[#4A3B3B] text-sm md:text-lg line-clamp-1">{product.name}</h4>
                                    <Link to={`/product/${product.id}`} className="mt-4 block text-center bg-pink-50 text-pink-500 py-2 rounded-xl font-bold text-xs md:text-sm hover:bg-pink-100 transition-colors">
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-400">No products match your search. Try "Custom" or "Hampers" 🌸</p>
                    </div>
                )}
            </section>

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={scrollToTop}
                    className="fixed bottom-10 right-10 bg-white border-2 border-pink-100 text-pink-400 w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:bg-pink-50 transition-all z-50 animate-bounce"
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default CategoryDetail;