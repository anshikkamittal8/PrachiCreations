import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProductDetails = () => {
    const { productId } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Helper for Cloudinary optimization
    const getOptimizedUrl = (url, width = 800) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    };

    // Scroll to Top monitoring
    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                // 1. Fetch Current Product
                const { data, error } = await supabase
                    .from('products').select('*').eq('id', productId).single();
                if (error) throw error;
                setProduct(data);

                // 2. Fetch Similar Products (Same category, excluding current product)
                const { data: similar } = await supabase
                    .from('products')
                    .select('*')
                    .eq('category_id', data.category_id)
                    .neq('id', productId)
                    .limit(4);

                setSimilarProducts(similar || []);
            } catch (error) {
                console.error("Error:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProductData();
        window.scrollTo(0, 0); // Reset scroll when product changes
    }, [productId]);

    const handleWhatsAppOrder = () => {
        const message = `Hi! I'd like to customize "${product.name}" (ID: ${product.id})`;
        window.open(`https://wa.me/917608846872?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (loading) return <div className="h-screen flex items-center justify-center brand-font text-2xl">Unwrapping... ✨</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    return (
        <div className="min-h-screen bg-[#FFFDF9] pb-20 relative">
            {/* Navigation */}
            <div className="px-10 py-6 text-sm text-gray-400">
                <Link to="/collections" className="hover:text-pink-400">Collections</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-600 font-semibold">{product.name}</span>
            </div>

            {/* Main Product Section */}
            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16">
                <div className="md:w-1/2 bg-white p-4 rounded-[3rem] shadow-sm border border-pink-50">
                    <img
                        src={getOptimizedUrl(product.image_url, 1000)}
                        alt={product.name}
                        loading="eager"
                        className="w-full h-auto rounded-[2.5rem] object-contain max-h-[600px]"
                    />
                </div>

                <div className="md:w-1/2 space-y-6">
                    <h1 className="brand-font text-5xl md:text-6xl text-[#4A3B3B]">{product.name}</h1>
                    <p className="text-pink-500 font-bold text-xl">
                        {product.price === 0 ? "Customizable for your budget" : `₹${product.price}`}
                    </p>
                    <p className="text-gray-500 text-lg border-l-4 border-pink-100 pl-6">{product.description}</p>

                    <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 hover:shadow-lg transition-all">
                        Order via WhatsApp 💬
                    </button>
                </div>
            </div>

            {/* --- SIMILAR PRODUCTS SECTION --- */}
            {similarProducts.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 mt-24">
                    <div className="flex items-center gap-4 mb-8">
                        <h3 className="brand-font text-3xl md:text-4xl text-[#4A3B3B]">You might also love</h3>
                        <div className="flex-grow h-px bg-pink-100"></div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
                        {similarProducts.map((item) => (
                            <Link
                                key={item.id}
                                to={`/product/${item.id}`}
                                className="group bg-white p-3 rounded-3xl border border-pink-50 hover:shadow-md transition-all"
                            >
                                <div className="h-40 overflow-hidden rounded-2xl bg-gray-50 mb-3 flex items-center justify-center">
                                    <img
                                        src={getOptimizedUrl(item.image_url, 400)}
                                        alt={item.name}
                                        className="max-h-full object-contain group-hover:scale-110 transition-transform"
                                    />
                                </div>
                                <h4 className="text-xs md:text-sm font-bold text-[#4A3B3B] line-clamp-1">{item.name}</h4>
                                <p className="text-pink-400 text-[10px] md:text-xs mt-1">View Details →</p>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Back to Top Button */}
            {showBackToTop && (
                <button
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-10 right-10 bg-white border-2 border-pink-100 text-pink-400 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50 animate-bounce"
                >
                    ↑
                </button>
            )}
        </div>
    );
};

export default ProductDetails;