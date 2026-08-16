'use client';

import { useState, Suspense, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function AuthContent() {
    const searchParams = useSearchParams();
    const mode = searchParams.get('mode');
    const [isLogin, setIsLogin] = useState(mode !== 'register');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { login, register } = useAuth();
    const router = useRouter();

    useEffect(() => {
        setIsLogin(mode !== 'register');
    }, [mode]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await login({ email, password });
                toast.success('Logged in successfully');
            } else {
                await register({ name, email, password });
                toast.success('Registration successful');
            }
            router.push('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-background">
            <div className="max-w-md w-full bg-card p-8 rounded-2xl border border-border shadow-sm">
                
                {/* Toggle */}
                <div className="flex p-1 bg-muted rounded-xl mb-8">
                    <button 
                        onClick={() => setIsLogin(true)} 
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${isLogin ? 'bg-card text-card-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Sign In
                    </button>
                    <button 
                        onClick={() => setIsLogin(false)} 
                        className={`flex-1 py-2 text-sm font-bold rounded-lg transition-all ${!isLogin ? 'bg-card text-card-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                    >
                        Create Account
                    </button>
                </div>

                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-foreground">
                        {isLogin ? 'Welcome Back' : 'Get Started'}
                    </h2>
                    <p className="text-muted-foreground text-sm mt-2">
                        {isLogin ? 'Enter your credentials to access your account' : 'Create an account to start optimizing your resume'}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    {!isLogin && (
                        <div>
                            <label className="block text-sm font-medium text-foreground mb-1">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required={!isLogin}
                                placeholder="John Doe"
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Email Address</label>
                        <input
                            type="email"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            placeholder="you@example.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-foreground mb-1">Password</label>
                        <input
                            type="password"
                            className="w-full bg-background border border-border rounded-xl px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-sm disabled:opacity-70"
                    >
                        {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-muted-foreground">
                    <Link href="/" className="hover:text-foreground transition-colors underline underline-offset-4">
                        Back to Home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default function AuthPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        }>
            <AuthContent />
        </Suspense>
    );
}
