import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showBackToTop, setShowBackToTop] = useState(false);

    // Review Form State
    const [reviewName, setReviewName] = useState("");
    const [reviewText, setReviewText] = useState("");
    const [reviewRating, setReviewRating] = useState(5);

    const getOptimizedUrl = (url, width = 800) => {
        if (!url || !url.includes('cloudinary.com')) return url;
        return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
    };

    useEffect(() => {
        const handleScroll = () => setShowBackToTop(window.scrollY > 400);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('products').select('*').eq('id', productId).single();
            if (error) throw error;
            setProduct(data);

            const { data: similar } = await supabase.from('products').select('*').eq('category_id', data.category_id).neq('id', productId).limit(4);
            setSimilarProducts(similar || []);

            const { data: revs } = await supabase.from('reviews').select('*').eq('product_id', productId).order('created_at', { ascending: false });
            setReviews(revs || []);
        } catch (error) {
            console.error("Error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        window.scrollTo(0, 0);
    }, [productId]);

    const handleWhatsAppOrder = () => {
        window.open(`https://wa.me/917608846872?text=I'd like to order ${product.name}`, '_blank');
    };

    const submitReview = async (e) => {
        e.preventDefault();
        const { error } = await supabase.from('reviews').insert([
            { product_id: productId, customer_name: reviewName, rating: reviewRating, comment: reviewText }
        ]);
        if (!error) {
            setReviewName(""); setReviewText("");
            fetchData(); // Refresh reviews
        }
    };

    if (loading) return <div className="h-screen flex items-center justify-center brand-font text-2xl">Unwrapping... ✨</div>;

    return (
        <div className="min-h-screen bg-[#FFFDF9] pb-20 relative">
            <div className="px-10 py-6 text-sm text-gray-400">
                <Link to="/collections" className="hover:text-pink-400">Collections</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-600 font-semibold">{product.name}</span>
            </div>

            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16">
                <div className="md:w-1/2 bg-white p-4 rounded-[3rem] shadow-sm border border-pink-50">
                    <img src={getOptimizedUrl(product.image_url, 1000)} alt={product.name} className="w-full h-auto rounded-[2.5rem] object-contain max-h-[600px]" />
                </div>

                <div className="md:w-1/2 space-y-6">
                    <h1 className="brand-font text-5xl text-[#4A3B3B]">{product.name}</h1>
                    <p className="text-pink-500 font-bold text-xl">{product.price === 0 ? "Customizable" : `₹${product.price}`}</p>
                    <p className="text-gray-500 text-lg border-l-4 border-pink-100 pl-6">{product.description}</p>

                    {/* Buttons */}
                    <div className="space-y-3">
                        <button onClick={handleWhatsAppOrder} className="w-full bg-[#25D366] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                            Order via WhatsApp 💬
                        </button>
                        <a href="https://instagram.com/prachicreations_30" target="_blank" rel="noreferrer" className="w-full bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-2 hover:shadow-lg transition-all">
                            Order via Instagram 📸
                        </a>
                    </div>

                    {/* Additional Info Box (Transparent Outline) */}
                    {product.additional_info && (
                        <div className="border-2 border-pink-100 p-6 rounded-3xl bg-transparent">
                            <p className="text-[#4A3B3B] whitespace-pre-line leading-relaxed italic">
                                {product.additional_info}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Similar Products */}
            {similarProducts.length > 0 && (
                <section className="max-w-6xl mx-auto px-6 mt-20">
                    <h3 className="brand-font text-3xl mb-8 text-[#4A3B3B]">You might also love</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {similarProducts.map(item => (
                            <Link key={item.id} to={`/product/${item.id}`} className="group bg-white p-3 rounded-3xl border border-pink-50 hover:shadow-md transition-all">
                                <div className="h-40 overflow-hidden rounded-2xl bg-gray-50 mb-3 flex items-center justify-center">
                                    <img src={getOptimizedUrl(item.image_url, 400)} alt={item.name} className="max-h-full object-contain group-hover:scale-110 transition-transform" />
                                </div>
                                <h4 className="text-sm font-bold text-[#4A3B3B] line-clamp-1">{item.name}</h4>
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* --- REVIEWS SECTION --- */}
            <section className="max-w-6xl mx-auto px-6 mt-20">
                <div className="bg-white rounded-[3rem] p-8 md:p-12 border border-pink-50 shadow-sm">
                    <h3 className="brand-font text-4xl text-[#4A3B3B] mb-8">Customer Reviews</h3>

                    <div className="grid md:grid-cols-2 gap-12">
                        {/* Review List */}
                        <div className="space-y-6 max-h-[500px] overflow-y-auto pr-4">
                            {reviews.length > 0 ? reviews.map(r => (
                                <div key={r.id} className="border-b border-pink-50 pb-4">
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="font-bold text-[#4A3B3B]">{r.customer_name}</span>
                                        <span className="text-yellow-400">{"★".repeat(r.rating)}</span>
                                    </div>
                                    <p className="text-gray-500 text-sm">{r.comment}</p>
                                </div>
                            )) : <p className="text-gray-400 italic">No reviews yet. Be the first to share your experience!</p>}
                        </div>

                        {/* Review Form */}
                        <form onSubmit={submitReview} className="space-y-4 bg-[#FFFDF9] p-6 rounded-3xl border border-pink-100">
                            <h4 className="font-bold text-[#4A3B3B]">Leave a Review</h4>
                            <input required value={reviewName} onChange={e => setReviewName(e.target.value)} placeholder="Your Name" className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200" />
                            <select value={reviewRating} onChange={e => setReviewRating(Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-pink-100 bg-white">
                                <option value="5">5 Stars - Loved it!</option>
                                <option value="4">4 Stars - Great</option>
                                <option value="3">3 Stars - Good</option>
                                <option value="2">2 Stars - OK</option>
                                <option value="1">1 Star - Not happy</option>
                            </select>
                            <textarea required value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="What did you think of this creation?" rows="4" className="w-full px-4 py-3 rounded-xl border border-pink-100 focus:outline-none focus:ring-2 focus:ring-pink-200"></textarea>
                            <button type="submit" className="w-full bg-pink-400 text-white py-3 rounded-xl font-bold hover:bg-pink-500 transition-colors">Post Review</button>
                        </form>
                    </div>
                </div>
            </section>

            {showBackToTop && (
                <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="fixed bottom-10 right-10 bg-white border-2 border-pink-100 text-pink-400 w-12 h-12 rounded-full shadow-lg flex items-center justify-center z-50 animate-bounce">↑</button>
            )}
        </div>
    );
};

export default ProductDetails;
