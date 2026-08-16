'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { Menu, X, LogOut } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="fixed top-6 w-full z-50 flex justify-center px-4 pointer-events-none">
            <nav className={`pointer-events-auto w-[90%] max-w-7xl bg-background/80 backdrop-blur-md border border-border shadow-sm transition-all duration-300 ${isOpen ? 'rounded-3xl' : 'rounded-full'}`}>
                <div className="px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center">
                            <Link href="/" className="text-xl font-bold text-foreground tracking-tight flex items-center gap-2">
                                <div className="w-8 h-8 rounded-md bg-primary text-primary-foreground flex items-center justify-center font-bold">AP</div>
                                ATS<span className="text-primary">PROB</span>
                            </Link>
                        </div>
                        <div className="hidden md:block">
                            <div className="ml-10 flex items-center space-x-8">
                                <Link href="/" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                                    Home
                                </Link>
                                {user ? (
                                    <>
                                        <Link href="/dashboard" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                                            Dashboard
                                        </Link>
                                        <button onClick={logout} className="flex items-center gap-2 text-sm font-medium text-foreground/80 hover:text-red-500 transition-colors">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth?mode=login" className="text-sm font-medium text-foreground/80 hover:text-foreground transition-colors">
                                            Sign in
                                        </Link>
                                        <Link href="/auth?mode=register" className="bg-primary hover:bg-primary/90 text-primary-foreground px-5 py-2 rounded-xl text-sm font-bold transition-colors shadow-sm">
                                            Get Started
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="-mr-2 flex md:hidden">
                            <button
                                onClick={() => setIsOpen(!isOpen)}
                                className="inline-flex items-center justify-center p-2 rounded-full text-foreground/80 hover:text-foreground hover:bg-black/5 focus:outline-none transition-colors"
                            >
                                {isOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile menu */}
                {isOpen && (
                    <div className="md:hidden border-t border-border/50">
                        <div className="px-4 pt-2 pb-4 space-y-1 sm:px-3">
                            <Link href="/" className="block px-4 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-foreground hover:bg-black/5 transition-colors">Home</Link>
                            {user ? (
                                <>
                                    <Link href="/dashboard" className="block px-4 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-foreground hover:bg-black/5 transition-colors">Dashboard</Link>
                                    <button onClick={logout} className="w-full text-left block px-4 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-red-500 hover:bg-black/5 transition-colors">Logout</button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth?mode=login" className="block px-4 py-3 rounded-xl text-base font-medium text-foreground/80 hover:text-foreground hover:bg-black/5 transition-colors">Sign in</Link>
                                    <Link href="/auth?mode=register" className="block px-4 py-3 rounded-xl text-base font-bold text-primary-foreground bg-primary hover:bg-primary/90 transition-colors">Get Started</Link>
                                </>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </div>
    );
};

export default Navbar;
