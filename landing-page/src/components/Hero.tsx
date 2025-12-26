import React from 'react';
import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';

const Hero: React.FC = () => {
    return (
        <section className="relative min-h-screen flex items-center justify-center px-6 py-20">
            <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

                {/* Text Content */}
                <div className="text-left space-y-8 order-2 md:order-1">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold/10 border border-gold/20 text-gold text-sm tracking-widest uppercase mb-6">
                            <Sparkles size={14} />
                            Ramadan 2025 Ready
                        </span>
                        <h1 className="text-5xl md:text-7xl leading-tight mb-4 text-white drop-shadow-lg">
                            Noor<span className="text-gold">Daily</span>
                        </h1>
                        <p className="text-xl md:text-2xl text-blue-100/80 font-light max-w-lg leading-relaxed">
                            Elevate your spiritual journey with a companion designed for clarity, beauty, and peace.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <button
                            className="group relative px-8 py-4 bg-gold text-bg-deep font-bold rounded-lg overflow-hidden shadow-[0_0_20px_rgba(212,175,55,0.3)] hover:shadow-[0_0_30px_rgba(212,175,55,0.5)] transition-all transform hover:-translate-y-1"
                            onClick={() => window.open('#', '_blank')}
                        >
                            <span className="relative z-10 flex items-center gap-3 text-lg">
                                <Download size={24} />
                                Download APK
                            </span>
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                        </button>

                        <button className="px-8 py-4 border border-blue-200/20 text-blue-100 font-semibold rounded-lg hover:bg-white/5 hover:border-blue-200/40 transition-all">
                            Learn More
                        </button>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1, duration: 1 }}
                        className="flex items-center gap-6 pt-4 border-t border-white/5"
                    >
                        <div className="flex -space-x-3">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 border-2 border-bg-deep" />
                            ))}
                        </div>
                        <p className="text-sm text-gray-400">Trusted by 10,000+ Muslims worldwide</p>
                    </motion.div>
                </div>

                {/* Visual/App Preview */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
                    animate={{ opacity: 1, scale: 1, rotate: 0 }}
                    transition={{ duration: 1, delay: 0.2, type: "spring" }}
                    className="order-1 md:order-2 flex justify-center relative"
                >
                    {/* Abstract Phone/App Representation */}
                    <div className="relative w-[300px] h-[600px] bg-black rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden backdrop-blur-md">
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-900 to-black">
                            {/* Mock UI Content */}
                            <div className="h-full w-full p-6 flex flex-col justify-between relative z-10">
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center text-white/50">
                                        <div className="w-8 h-8 rounded-full bg-white/10" />
                                        <div className="w-8 h-8 rounded-full bg-white/10" />
                                    </div>
                                    <div className="h-40 rounded-2xl bg-gradient-to-br from-gold/20 to-transparent border border-gold/10 backdrop-blur-sm p-4">
                                        <div className="w-1/2 h-4 bg-gold/30 rounded mb-2" />
                                        <div className="w-3/4 h-8 bg-gold/50 rounded" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="h-16 rounded-xl bg-white/5 border border-white/5" />
                                    <div className="h-16 rounded-xl bg-white/5 border border-white/5" />
                                    <div className="h-16 rounded-xl bg-white/5 border border-white/5" />
                                </div>
                            </div>

                            {/* Reflections */}
                            <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/5 to-transparent pointer-events-none" />
                        </div>
                    </div>

                    {/* Decorative Elements behind phone */}
                    <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-gold/5 rounded-full blur-[100px]" />
                </motion.div>

            </div>
        </section>
    );
};

export default Hero;
