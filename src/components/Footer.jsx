import React, { useState } from 'react';
import { Mail, Instagram, Twitter, Facebook, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const [email, setEmail] = useState('');
    const currentYear = new Date().getFullYear();

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Here you would typically send the email to your backend for newsletter subscription
        alert(`Thank you for subscribing, ${email}!`);
        setEmail('');
    };

    const links = [
        {
            title: "Shop",
            items: [
                { name: "All Products", href: "/allproducts" },
                { name: "New Arrivals", href: "#" },
                { name: "Sale", href: "#" },
            ],
        },
        {
            title: "Company",
            items: [
                { name: "About Us", href: "/about" },
                { name: "Contact", href: "/contact" },
                { name: "Careers", href: "#" },
            ],
        },
        {
            title: "Support",
            items: [
                { name: "FAQ", href: "#" },
                { name: "Shipping & Returns", href: "#" },
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
            ],
        },
    ];

    return (
        <footer className="bg-[#1a1a1a] text-gray-300 border-t border-gray-800 font-inter">
            <div className="max-w-7xl mx-auto px-6 py-16">
                
                {/* Top Section: Newsletter and Brand Info */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-700">
                    
                    {/* Brand/Logo */}
                    <div className="md:col-span-1">
                        <Link to="/home" className="text-3xl font-bold tracking-tight text-white transition-colors duration-300 hover:text-gray-100">
                            SHOP NAME
                        </Link>
                        <p className="mt-4 text-sm text-gray-400 max-w-xs">
                            Curated style, delivered to your door. Quality apparel and accessories for the modern wardrobe.
                        </p>
                    </div>

                    {/* Newsletter Subscription (Mobile first, spans full width) */}
                    
                </div>

                {/* Middle Section: Navigation Links */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-8 py-12">
                    {links.map((section, index) => (
                        <div key={index} className="flex flex-col gap-4">
                            <h4 className="text-md font-semibold text-white uppercase tracking-wider mb-2">{section.title}</h4>
                            <ul className="space-y-3">
                                {section.items.map((item) => (
                                    <li key={item.name}>
                                        <Link 
                                            to={item.href} 
                                            className="text-sm text-gray-400 hover:text-white transition-colors duration-300"
                                        >
                                            {item.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Section: Copyright and Social Media */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between border-t border-gray-700">
                    
                    {/* Copyright */}
                    <p className="text-sm text-gray-400 order-2 md:order-1 mt-6 md:mt-0">
                        &copy; {currentYear} SHOP NAME. All rights reserved.
                    </p>

                    {/* Social Icons */}
                    <div className="flex space-x-6 order-1 md:order-2">
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                            <Twitter className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
                        </a>
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                            <Facebook className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <Instagram className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
                        </a>
                        <a href="mailto:support@shopname.com" aria-label="Email">
                            <Mail className="w-6 h-6 text-gray-400 hover:text-white transition-colors duration-300" />
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
