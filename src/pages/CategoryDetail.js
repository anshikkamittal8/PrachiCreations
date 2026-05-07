import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const CategoryDetail = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [categoryName, setCategoryName] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                // 1. Find the category ID matching the URL slug
                const { data: categoryData, error: catError } = await supabase
                    .from('category')
                    .select('id, name')
                    .eq('slug', slug)
                    .single();

                if (catError) throw catError;

                if (categoryData) {
                    setCategoryName(categoryData.name);

                    // 2. Fetch products for this category
                    const { data: productData, error: prodError } = await supabase
                        .from('products')
                        .select('*')
                        .eq('category_id', categoryData.id);

                    if (prodError) throw prodError;
                    setProducts(productData || []);
                }
            } catch (error) {
                console.error("Error fetching details:", error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [slug]);

    // Helper to format currency (e.g., 2499 -> ₹2,499)
    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    const isWeddingTrousseauPage = categoryName.toLowerCase() === 'wedding trousseau';

    if (loading) {
        return (
            <div className="flex justify-center items-center h-[60vh]">
                <div className="brand-font text-3xl animate-bounce text-pink-300">Loading treasures... ✨</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFDF9] pb-20">
            {/* Breadcrumb Navigation */}
            <div className="px-10 py-6 text-sm text-gray-400">
                <Link to="/collections" className="hover:text-pink-400">Collections</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-600 font-semibold">{categoryName}</span>
            </div>

            {/* Category Header */}
            <header className="text-center py-12 px-6">
                <h2 className="brand-font text-7xl text-[#4A3B3B] mb-4">{categoryName}</h2>
                <p className="text-gray-500 italic">Explore our curated {categoryName.toLowerCase()} options</p>
                {isWeddingTrousseauPage && (
                    <p className="text-gray-600 mt-4 max-w-3xl mx-auto">
                        Send your items for decoration, or let us arrange and style them for you at an additional cost.
                    </p>
                )}
                <div className="w-24 h-1 bg-pink-100 mx-auto mt-6 rounded-full"></div>
            </header>

            {/* Products Grid */}
            <section className="px-10 md:px-20 mt-10">
                {products.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {products.map((product) => (
                            <div key={product.id} className="group bg-white rounded-[2.5rem] overflow-hidden border border-pink-50 shadow-sm hover:shadow-2xl transition-all duration-500">
                                {/* Product Image - Sourced from /public folder */}
                                <div className="h-80 overflow-hidden bg-gray-50">
                                    <img
                                        // This ensures that even if the DB has "/image.jpg" or "image.jpg", it resolves correctly
                                        src={product.image_url.startsWith('http') ? product.image_url : `/${product.image_url.replace(/^\//, '')}`}
                                        alt={product.name}
                                        className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
                                        onError={(e) => {
                                            console.error(`Failed to load image: ${e.target.src}`);
                                            e.target.src = 'https://via.placeholder.com/400x500?text=Check+Public+Folder';
                                        }}
                                    />
                                </div>

                                {/* Product Info */}
                                <div className="p-8">
                                    <div className="flex justify-between items-start mb-4">
                                        <h4 className="text-2xl font-bold text-[#4A3B3B]">{product.name}</h4>
                                        <span className="bg-pink-50 text-pink-500 font-bold px-4 py-1 rounded-full text-sm text-center">
                                        {product.price === 0 || product.price === null 
                                        ? "Customizable for your budget" 
                                        : formatPrice(product.price)}
                                        </span>
                                    </div>

                                    <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                        {product.description}
                                    </p>

                                    <div className="flex gap-3">
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="flex-1 bg-[#FDE2E4] text-[#4A3B3B] py-3 rounded-full font-bold text-center hover:bg-pink-200 transition-colors"
                                        >
                                            Order Now
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-pink-200">
                        <p className="text-gray-400 italic">Working on new designs for this collection... check back soon! 🌸</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CategoryDetail;