"use client"
import { PaperPlaneIcon, PaperPlaneTiltIcon, XLogoIcon } from '@phosphor-icons/react';
import { EnvelopeIcon, GithubLogoIcon, LinkedinLogoIcon } from '@phosphor-icons/react/dist/ssr';
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
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.log("Error occured while sending message.", error.message);
        } finally {
            setLoading(false)
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    return (
        <div className="min-h-fit bg-gray-70 p-6 dark:bg-[#10151b] ">
            <div className="max-w-6xl mx-auto rounded-md p-8 ">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="text-gray-900 space-y-8 dark:text-[#c6c6d0]">
                        <h1 className="text-4xl font-bold mb-6">Let's Connect!</h1>
                        <p className="text-lg opacity-90">
                            I'm always interested in hearing about new projects and opportunities.
                            Feel free to reach out!
                        </p>

                        <div className="flex flex-wrap gap-4 mt-8">
                            <Link href="mailto:work.purushotam@gmail.com" target='_blank' className="border-2 border-transparent  p-4 rounded-full hover:scale-105 transition-colors">
                                <EnvelopeIcon size={22} />
                            </Link>
                            <Link href="https://www.github.com/MrPurushotam" target='_blank' className="border-2 border-transparent p-4 rounded-full hover:scale-105 transition-colors">
                                <GithubLogoIcon size={22} />
                            </Link>
                            <Link href="https://www.linkedin.com/in/purushotamjeswani" target='_blank' className="border-2 border-transparent p-4 rounded-full hover:scale-105 transition-colors">
                                <LinkedinLogoIcon size={22} />
                            </Link>
                            <Link href="https://x.com/purushotam___j" target='_blank' className="border-2 border-transparent p-4 rounded-full hover:scale-105 transition-colors">
                                <XLogoIcon size={22} />
                            </Link>
                        </div>
                    </div>

                    {/* Right side - Contact Form */}
                    <div className="w-full max-w-xl bg-neutral-200/60 dark:bg-[#1e1e1e] rounded-2xl backdrop-blur-lg border border-grey-700 dark:shadow-lg dark:shadow-blue-600/40 ">
                        <div className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-gray-700 dark:text-gray-300">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Your name"
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-900 text-sm dark:text-gray-300">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="your@email.com"
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-900 text-sm dark:text-gray-300">Subject</label>
                                    <input
                                        type="text"
                                        name="subject"
                                        className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="What's this about?"
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-gray-900 text-sm dark:text-gray-300">Message</label>
                                    <textarea
                                        name="message"
                                        rows="4"
                                        className="w-full px-4 py-3 text-gray-900 dark:text-white bg-white dark:bg-[#1f1f1f] rounded-xl border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                        placeholder="Your message..."
                                        onChange={handleChange}
                                        required
                                        disabled={loading}
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full bg-white text-red-500 py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-white/90 transition-colors group border border-black/90 focus:border-blue-500/90 disabled:opacity-80 relative overflow-hidden shadow-md hover:shadow-lg hover:shadow-red-400/40 "
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <span className="opacity-0">Send Message</span>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <PaperPlaneIcon
                                                    size={18}
                                                    className='animate-button-fly'
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            Send Message
                                            <PaperPlaneTiltIcon size={18} className=" transition-transform group-hover:translate-x-1" />
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