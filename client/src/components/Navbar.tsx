'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, User as UserIcon, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <Link href="/" className="text-xl font-semibold text-white tracking-tight flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center font-bold">R</div>
                            ATSPROB
                        </Link>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-center space-x-8">
                            <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                Home
                            </Link>
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                        Dashboard
                                    </Link>
                                    <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-red-400 transition-colors">
                                        <LogOut size={16} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/login" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                                        Sign in
                                    </Link>
                                    <Link href="/register" className="bg-white hover:bg-slate-200 text-black px-4 py-2 rounded-md text-sm font-semibold transition-colors">
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="-mr-2 flex md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-white/10 focus:outline-none"
                        >
                            {isOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {isOpen && (
                <div className="md:hidden bg-background border-t border-white/10">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <Link href="/" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5">Home</Link>
                        {user ? (
                            <>
                                <Link href="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5">Dashboard</Link>
                                <button onClick={logout} className="w-full text-left block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-red-400 hover:bg-white/5">Logout</button>
                            </>
                        ) : (
                            <>
                                <Link href="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-300 hover:text-white hover:bg-white/5">Sign in</Link>
                                <Link href="/register" className="block px-3 py-2 rounded-md text-base font-medium text-black bg-white hover:bg-slate-200">Get Started</Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
