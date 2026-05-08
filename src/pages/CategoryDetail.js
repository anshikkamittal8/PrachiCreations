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
                const { data: categoryData, error: catError } = await supabase
                    .from('category')
                    .select('id, name')
                    .eq('slug', slug)
                    .single();

                if (catError) throw catError;

                if (categoryData) {
                    setCategoryName(categoryData.name);
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
                <div className="brand-font text-2xl md:text-3xl animate-bounce text-pink-300">Loading treasures... ✨</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFFDF9] pb-20">
            {/* Breadcrumb Navigation */}
            <div className="px-6 md:px-10 py-4 md:py-6 text-xs md:text-sm text-gray-400">
                <Link to="/collections" className="hover:text-pink-400">Collections</Link>
                <span className="mx-2">/</span>
                <span className="text-gray-600 font-semibold">{categoryName}</span>
            </div>

            {/* Category Header */}
            <header className="text-center py-8 md:py-12 px-6">
                <h2 className="brand-font text-5xl md:text-7xl text-[#4A3B3B] mb-4">{categoryName}</h2>
                <p className="text-gray-500 italic text-sm md:text-base">Explore our curated {categoryName.toLowerCase()} options</p>
                {isWeddingTrousseauPage && (
                    <p className="text-gray-600 mt-4 max-w-3xl mx-auto text-xs md:text-base">
                        Send your items for decoration, or let us arrange and style them for you at an additional cost.
                    </p>
                )}
                <div className="w-16 md:w-24 h-1 bg-pink-100 mx-auto mt-6 rounded-full"></div>
            </header>

            {/* Products Grid */}
            <section className="px-4 md:px-20 mt-4 md:mt-10">
                {products.length > 0 ? (
                    /* MOBILE FIX: grid-cols-2 for side-by-side view 
                       GAP: smaller gap for mobile (gap-4)
                    */
                    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-12">
                        {products.map((product) => (
                            <div key={product.id} className="group bg-white rounded-[1.5rem] md:rounded-[2.5rem] overflow-hidden border border-pink-50 shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col">

                                {/* Image Container: Responsive heights */}
                                <div className="h-44 md:h-80 overflow-hidden bg-gray-50 flex items-center justify-center p-2 md:p-4">
                                    <img
                                        src={product.image_url.startsWith('http') ? product.image_url : `/${product.image_url.replace(/^\//, '')}`}
                                        alt={product.name}
                                        className="max-w-full max-h-full object-contain group-hover:scale-105 transition-transform duration-700"
                                        onError={(e) => {
                                            e.target.src = 'https://via.placeholder.com/400x500?text=Product+Image';
                                        }}
                                    />
                                </div>

                                {/* Product Info: Adjusted spacing for mobile */}
                                <div className="p-3 md:p-8 flex flex-col flex-grow">
                                    <div className="mb-2 md:mb-4">
                                        <h4 className="text-sm md:text-2xl font-bold text-[#4A3B3B] line-clamp-1">{product.name}</h4>
                                        <div className="mt-1">
                                            <span className="text-pink-500 font-bold text-[10px] md:text-sm bg-pink-50 px-2 py-0.5 rounded-full inline-block">
                                                {product.price === 0 || product.price === null
                                                    ? "Customizable"
                                                    : formatPrice(product.price)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Description: Hidden or clamped on mobile to keep cards uniform */}
                                    <p className="text-gray-500 text-[10px] md:text-sm leading-relaxed mb-4 line-clamp-2 md:line-clamp-none hidden md:block">
                                        {product.description}
                                    </p>

                                    <div className="mt-auto">
                                        <Link
                                            to={`/product/${product.id}`}
                                            className="block w-full bg-[#FDE2E4] text-[#4A3B3B] py-2 md:py-3 rounded-full font-bold text-[10px] md:text-base text-center hover:bg-pink-200 transition-colors"
                                        >
                                            View Details
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-[3rem] border border-dashed border-pink-200">
                        <p className="text-gray-400 italic px-6">Working on new designs for this collection... check back soon! 🌸</p>
                    </div>
                )}
            </section>
        </div>
    );
};

export default CategoryDetail;