import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const ProductDetails = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (error) throw error;
                setProduct(data);
            } catch (error) {
                console.error("Error fetching product:", error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [productId]);

    if (loading) return <div className="h-screen flex items-center justify-center brand-font text-2xl">Unwrapping your gift... ✨</div>;
    if (!product) return <div className="text-center py-20">Product not found.</div>;

    // WHATSAPP REDIRECT LOGIC
    const handleWhatsAppOrder = () => {
        const phoneNumber = "917735515342"; // Replace with your actual WhatsApp number
        const message = `Hi Prachi! I just saw the "${product.name}" on your website and I'd love to order/customize it. (Ref ID: ${product.id})`;
        const encodedMessage = encodeURIComponent(message);
        window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
    };

    const additionalInfo =
        product.additional_info ||
        product.additionalInfo ||
        product['additional info'] ||
        product.additionalinfo ||
        '';

    return (
        <div className="min-h-screen bg-[#FFFDF9] pb-20">
            {/* Breadcrumb */}
            <div className="px-10 py-6 text-sm text-gray-400">
                <Link to="/collections" className="hover:text-pink-400">Collections</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-600 font-semibold">{product.name}</span>
            </div>

            <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row gap-16 mt-4">
                {/* Left: Big Image */}
                <div className="md:w-1/2 bg-white p-4 rounded-[3rem] shadow-sm border border-pink-50">
                    <img
                        // The leading / is crucial to tell the browser to look in the root public folder
                        src={product.image_url.startsWith('http') ? product.image_url : `/${product.image_url.replace(/^\//, '')}`}
                        alt={product.name}
                        className="w-full h-auto rounded-[2.5rem] object-contain max-h-[600px]"
                        onError={(e) => {
                            console.error("Image failed to load at path:", e.target.src);
                            e.target.src = 'https://via.placeholder.com/600x600?text=Image+Not+Found';
                        }}
                    />
                </div>

                {/* Right: Info and Order buttons */}
                <div className="md:w-1/2 space-y-8 py-4">
                    <div>
                        <h1 className="brand-font text-6xl text-[#4A3B3B] mb-4">{product.name}</h1>
                        <span className="text-3xl font-bold text-pink-400">
                            ₹{Number(product.price).toLocaleString('en-IN')}
                        </span>
                    </div>

                    <p className="text-gray-500 text-lg leading-relaxed border-l-4 border-pink-100 pl-6">
                        {product.description}
                    </p>

                    {additionalInfo && (
                        <div className="bg-white border border-pink-100 p-6 rounded-3xl">
                            <h3 className="text-xl font-semibold text-[#4A3B3B] mb-2">Additional Information</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {additionalInfo}
                            </p>
                        </div>
                    )}

                    <div className="space-y-4 pt-6">
                        <button
                            onClick={handleWhatsAppOrder}
                            className="w-full bg-[#25D366] text-white py-5 rounded-2xl font-bold text-xl hover:shadow-lg transition flex items-center justify-center gap-3"
                        >
                            Order via WhatsApp <span className="text-2xl">💬</span>
                        </button>

                        <a
                            href="https://instagram.com/prachi_creations30"
                            target="_blank"
                            rel="noreferrer"
                            className="w-full bg-white border-2 border-pink-100 text-[#4A3B3B] py-5 rounded-2xl font-bold text-xl hover:bg-pink-50 transition flex items-center justify-center gap-3"
                        >
                            DM on Instagram <span className="text-2xl">📸</span>
                        </a>
                    </div>

                    <div className="bg-pink-50/50 p-6 rounded-3xl">
                        <p className="text-sm text-gray-500 italic">
                            💡 Every piece is 100% customizable. You can choose different colors, themes, or add personalized names after clicking order.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;