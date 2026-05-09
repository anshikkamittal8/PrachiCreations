import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <main className="min-h-[90vh] flex flex-col justify-center overflow-hidden">
            <section className="container mx-auto px-6 md:px-12 py-12 md:py-24 flex flex-col md:flex-row items-center gap-16">

                {/* Text Content Area */}
                <div className="w-full md:w-1/2 space-y-8 animate-fade-in-up">
                    <div className="space-y-4">
                        <span className="inline-block bg-white border border-pink-100 px-5 py-1.5 rounded-full text-xs md:text-sm font-medium tracking-wide text-pink-400 uppercase shadow-sm">
                            Made with love & a little extra sparkle ✨
                        </span>

                        <h1 className="brand-font text-7xl md:text-8xl lg:text-9xl text-[#4A3B3B] leading-none">
                            Prachi <br /> Creations
                        </h1>

                        <div className="relative inline-block">
                            <p className="text-xl md:text-2xl font-semibold text-[#5a4a4a]">
                                Handmade happiness, wrapped with love 🎀
                            </p>
                            {/* Decorative underline */}
                            <div className="h-1 w-24 bg-pink-100 mt-2 rounded-full"></div>
                        </div>
                    </div>

                    <p className="text-gray-500 text-lg leading-relaxed max-w-lg">
                        When basic gifts just won't cut it. We curate hyper-personal,
                        aesthetic gifting experiences designed to make them gasp and
                        cherish the moment forever.
                    </p>

                    <div className="flex flex-wrap gap-5 pt-6">
                        <Link to="/collections"
                            className="bg-[#FDE2E4] hover:bg-[#fad2d5] text-[#4A3B3B] px-10 py-4 rounded-full font-bold shadow-lg shadow-pink-100 transform hover:-translate-y-1 transition-all duration-300">
                            Shop Now
                        </Link>
                        <Link to="/collections"
                            className="group flex items-center gap-2 border border-pink-200 px-10 py-4 rounded-full font-bold text-[#4A3B3B] hover:bg-pink-50 transition-all duration-300">
                            Explore Collections
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </Link>
                    </div>
                </div>

                {/* Visual Image Area */}
                <div className="w-full md:w-1/2 relative group">
                    {/* Decorative floating shapes */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-50 rounded-full blur-3xl opacity-60"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-50 rounded-full blur-3xl opacity-60"></div>

                    {/* Image Container */}
                    <div className="relative z-10 overflow-hidden rounded-[2.5rem] shadow-2xl border-8 border-white bg-white">
                        <img
                            src="homepage.jpeg"
                            alt="Main Gift Showcase"
                            loading="lazy"  // <--- This stops images off-screen from slowing down the initial load
                            decoding="async"
                            fetchpriority="high"
                            /* 
                               Changed 'object-cover' to 'object-contain' to ensure nothing is cut off.
                               Added 'h-auto' so the container expands to fit the full image height.
                            */
                            className="w-full h-auto max-h-[700px] object-contain transform group-hover:scale-[1.02] transition-transform duration-700 ease-in-out"
                        />
                        {/* Subtle soft overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-pink-50/10 to-transparent pointer-events-none"></div>
                    </div>
                </div>

            </section>

            {/* Subtle bottom detail */}
            <div className="w-full flex justify-center pb-10">
                <div className="animate-bounce text-pink-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                </div>
            </div>
        </main>
    );
};

export default Home;
