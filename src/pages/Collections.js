import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const Collections = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            setErrorMsg(null);

            // 1. Fetching from 'category' table
            const { data, error } = await supabase
                .from('category')
                .select('*')
                .order('id', { ascending: true });

            // DEBUG: Check your console to see what is actually returned
            console.log("Supabase Data:", data);
            console.log("Supabase Error:", error);

            if (error) throw error;

            if (data) {
                setCategories(data);
            }
        } catch (error) {
            console.error('Error fetching categories:', error.message);
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="brand-font text-2xl animate-pulse">Loading magic... ✨</p>
            </div>
        );
    }

    if (errorMsg) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 font-bold">Failed to load collections.</p>
                <p className="text-gray-400 text-sm">{errorMsg}</p>
                <button
                    onClick={fetchCategories}
                    className="mt-4 px-4 py-2 bg-pink-100 rounded-full text-sm"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="pb-20">
            {/* Header Section */}
            <section className="text-center py-20 bg-pink-50/30">
                <h2 className="brand-font text-5xl mb-4 text-[#4A3B3B]">Our Collections</h2>
                <p className="text-gray-500 italic text-lg">Aesthetic gifting, made exactly how you want it.</p>
                <div className="mt-6">
                    <span className="border border-pink-200 bg-white px-6 py-2 rounded-full text-sm shadow-sm font-medium">
                        Everything is customizable 💌
                    </span>
                </div>
            </section>

            {/* Grid Section */}
            <section className="px-6 md:px-10 mt-12">
                <h3 className="text-3xl font-bold text-center mb-2 text-[#4A3B3B]">Luxe Gifting</h3>
                <p className="text-center text-gray-400 mb-12">Curated aesthetic boxes for every special moment.</p>

                {categories.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-400">No categories found. Check your Supabase RLS policies!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {categories.map((item) => (
                            <Link
                                to={`/collections/${item.slug}`}
                                key={item.id}
                                className="group bg-white p-4 rounded-[2.5rem] border border-pink-50 shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300"
                            >
                                <div className="overflow-hidden rounded-[2rem] mb-6">
                                    <img
                                        src={item.image_url}
                                        alt={item.name}
                                        className="w-full h-80 object-contain group-hover:scale-105 transition-transform duration-500"
                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=No+Image'; }}
                                    />
                                </div>

                                <div className="px-2">
                                    <h4 className="text-2xl font-bold text-[#4A3B3B]">{item.name}</h4>
                                    <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="flex justify-between items-center mt-8">
                                        <span className="text-xs font-bold uppercase tracking-widest text-pink-300 underline decoration-pink-100 underline-offset-4">
                                            View Details
                                        </span>
                                        <button className="bg-[#FDE2E4] px-6 py-2 rounded-full text-sm font-bold text-[#4A3B3B] group-hover:bg-pink-200 transition-colors">
                                            Explore
                                        </button>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default Collections;