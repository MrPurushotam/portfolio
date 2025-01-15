"use client"
import Link from 'next/link';
import React, { useState } from 'react';

const ContactPage = () => {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        if (!formData.name || !formData.message || !formData.email || !formData.subject) {
            alert("Please fill the complete form before submiting.")
            return;
        }
        setLoading(true)

        try {
            const resp = await fetch("/api/contact", { method: "POST", body: JSON.stringify(formData) });
            const data = await resp.json();
            if (data.success) {
                alert(data.message);
            }
        } catch (error) {
            console.log("Error occured while sending message.", error.message);
        } finally {
            setLoading(true)
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-fit bg-gray-70 p-6 dark:bg-[#373737] ">
            <div className="max-w-6xl mx-auto dark:shadow-sm dark:shadow-[#373737] rounded-md p-8 dark:bg-[#2a282b] ">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    <div className="text-gray-900 space-y-8 dark:text-[#c6c6d0]">
                        <h1 className="text-4xl font-bold mb-6">Let's Connect!</h1>
                        <p className="text-lg opacity-90">
                            I'm always interested in hearing about new projects and opportunities.
                            Feel free to reach out!
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link href="mailto:work.purushotam@gmail.com" target='_blank' className="border-2 border-transparent hover:border-gray-900 p-4 rounded-full hover:bg-white/20 transition-colors">
                                <i className="ph-duotone ph-envelope text-3xl"></i>
                            </Link>
                            <Link href="https://www.github.com/MrPurushotam" target='_blank' className="border-2 border-transparent hover:border-gray-900 p-4 rounded-full hover:bg-white/20 transition-colors">
                                <i className="ph-duotone ph-github-logo text-3xl"></i>
                            </Link>
                            <Link href="https://www.linkedin.com/in/purushotamjeswani" target='_blank' className="border-2 border-transparent hover:border-gray-900 p-4 rounded-full hover:bg-white/20 transition-colors">
                                <i className="ph-duotone ph-linkedin-logo text-3xl "></i>
                            </Link>
                            <Link href="https://x.com/purushotam___j" target='_blank' className="border-2 border-transparent hover:border-gray-900 p-4 rounded-full hover:bg-white/20 transition-colors">
                                <i className="ph-duotone ph-x-logo text-3xl"></i>
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Contact Form */}
                    <div className="bg-gray-200/70 backdrop-blur-lg border border-black/10 rounded-xl dark:shadow-md dark:shadow-red-300">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-gray-900 text-sm">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full p-3 rounded-lg bg-white/50 border border-black/70 text-gray-900 placeholder-black/50 focus:outline-none focus:border-blue-500/90 transition-colors"
                                        placeholder="Your name"
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-900 text-sm">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full p-3 rounded-lg bg-white/50 border border-black/70 text-gray-900 placeholder-black/50 focus:outline-none focus:border-blue-500/90 transition-colors"
                                        placeholder="your@email.com"
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-900 text-sm">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="w-full p-3 rounded-lg bg-white/50 border border-black/70 text-gray-900 placeholder-black/50 focus:outline-none focus:border-blue-500/90 transition-colors"
                                        placeholder="What's this about?"
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-900 text-sm">Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        className="w-full p-3 rounded-lg bg-white/50 border border-black/70 text-gray-900 placeholder-black/50 focus:outline-none focus:border-blue-500/90 transition-colors resize-none"
                                        placeholder="Your message..."
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-red-500 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-colors group border border-black/90 focus:border-blue-500/90 disabled:opacity-80 relative overflow-hidden"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="opacity-0">Send Message</span>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <i className="ph-duotone ph-paper-plane-tilt text-xl animate-button-fly"></i>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <i className="ph-duotone ph-paper-plane-tilt text-lg transition-transform group-hover:translate-x-1"></i>
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;