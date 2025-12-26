import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="relative z-10 py-8 text-center text-white/30 text-sm">
            <div className="border-t border-white/5 max-w-6xl mx-auto pt-8 flex flex-col md:flex-row justify-between items-center px-6 gap-4">
                <p>&copy; {new Date().getFullYear()} NoorDaily. All rights reserved.</p>
                <div className="flex gap-6">
                    <a href="#" className="hover:text-gold transition-colors">Privacy</a>
                    <a href="#" className="hover:text-gold transition-colors">Terms</a>
                    <a href="#" className="hover:text-gold transition-colors">Contact</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
