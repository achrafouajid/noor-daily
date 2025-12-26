import React from 'react';
import { motion } from 'framer-motion';

const Background: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Deep Gradient Mesh */}
            <div
                className="absolute inset-0 opacity-60"
                style={{
                    background: `
            radial-gradient(circle at 15% 50%, rgba(2, 12, 27, 0.95), transparent 60%),
            radial-gradient(circle at 85% 30%, rgba(10, 25, 47, 0.9), transparent 50%),
            radial-gradient(circle at 50% 90%, rgba(20, 35, 60, 0.8), transparent 70%)
          `
                }}
            />

            {/* Animated Orbs/Glows */}
            <motion.div
                animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/4 left-1/3 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(212, 175, 55, 0.15) 0%, transparent 70%)' }}
            />

            <motion.div
                animate={{
                    scale: [1, 1.3, 1],
                    opacity: [0.2, 0.4, 0.2],
                    x: [0, -40, 0],
                    y: [0, 40, 0],
                }}
                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 2 }}
                className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] bg-indigo-900/10 rounded-full blur-3xl"
                style={{ background: 'radial-gradient(circle, rgba(17, 34, 64, 0.4) 0%, transparent 70%)' }}
            />

            {/* Geometric Overlay (Subtle) */}
            <div
                className="absolute inset-0 opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23d4af37' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
};

export default Background;
