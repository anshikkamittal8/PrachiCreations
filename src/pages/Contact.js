import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        contact: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const { error } = await supabase
                .from('inquiries')
                .insert([
                    {
                        customer_name: formData.name,
                        contact_info: formData.contact,
                        occasion_vibe: formData.message
                    }
                ]);

            if (error) throw error;

            setSubmitted(true);
            setFormData({ name: '', contact: '', message: '' });
        } catch (error) {
            alert("Error sending details: " + error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <section className="max-w-6xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-16 items-start">

            {/* Left Side: Text and Social Links */}
            <div className="md:w-5/12 space-y-8">
                <div className="inline-block p-3 bg-pink-50 rounded-2xl">
                    <span className="text-2xl">✨</span>
                </div>

                <h2 className="brand-font text-6xl leading-tight text-[#4A3B3B]">
                    Let's make <br /> something magical
                </h2>

                <div className="space-y-4">
                    <p className="font-semibold text-lg">Tell us your vibe, theme, or send Pinterest inspo ✨</p>
                    <p className="text-gray-500 leading-relaxed">
                        Whether it's a huge birthday hamper or a cute little bridesmaid box, we put our heart into every detail.
                    </p>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <p className="font-bold mb-6">Slide into our DMs instead?</p>

                    <div className="space-y-4">
                        {/* Instagram Card */}
                        <a href="https://instagram.com/prachi_creations30" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-4 bg-white border border-gray-100 rounded-[1.5rem] shadow-sm hover:shadow-md transition">
                            <div className="bg-pink-50 p-3 rounded-full">
                                <img src="https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg" alt="Instagram" className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="font-bold text-sm">Instagram</p>
                                <p className="text-xs text-gray-400">@prachi_creations30</p>
                            </div>
                        </a>
                    </div>
                </div>
            </div>

            {/* Right Side: Contact Form Container */}
            <div className="md:w-7/12 bg-white rounded-[3rem] p-10 shadow-2xl border border-gray-50">
                {submitted ? (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">✈️</div>
                        <h3 className="brand-font text-4xl text-[#4A3B3B] mb-4">Details Received!</h3>
                        <p className="text-gray-500">Prachi will get back to you shortly to discuss your magic. ✨</p>
                        <button
                            onClick={() => setSubmitted(false)}
                            className="mt-8 text-pink-400 font-bold hover:underline"
                        >
                            Send another inquiry
                        </button>
                    </div>
                ) : (
                    <>
                        <h3 className="text-2xl font-bold mb-8 flex items-center gap-2">
                            Drop your details below 👇
                        </h3>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-600">Your Name </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="e.g. Ananya"
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-600">Email or Phone Number</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.contact}
                                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                    placeholder="Where should we reach you?"
                                    className="w-full px-6 py-4 rounded-2xl border border-gray-100 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-pink-200 transition"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2 text-gray-600">What's the occasion? What's the vibe?</label>
                                <textarea
                                    rows="5"
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="e.g., I need a pastel pink birthday hamper for my sister. Budget is around..."
                                    className="w-full px-6 py-4 rounded-3xl border border-gray-100 bg-[#FAFAFA] focus:outline-none focus:ring-2 focus:ring-pink-200 transition resize-none"
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full ${isSubmitting ? 'bg-gray-200' : 'bg-[#F3C2D1] hover:bg-[#efb1c4]'} text-[#4A3B3B] py-5 rounded-2xl font-bold text-lg transition flex items-center justify-center gap-2 shadow-sm`}
                            >
                                {isSubmitting ? 'Sending...' : 'Send Details'} <span className="text-xl">✈️</span>
                            </button>
                        </form>
                    </>
                )}
            </div>
        </section>
    );
};

export default Contact;