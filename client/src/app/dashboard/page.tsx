'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { FileText, ChevronRight, LayoutDashboard, Settings, History, PlusCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('Frontend');
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth?mode=login');
        }
    }, [authLoading, user, router]);

    const fetchResumes = async () => {
        try {
            const { data } = await api.get('/resume');
            setResumes(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchResumes();
        }
    }, [user]);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        const formData = new FormData();
        formData.append('resume', file);
        formData.append('role', role);

        try {
            // 1. Upload
            const { data: resume } = await api.post('/resume/upload', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });

            // 2. Trigger Analysis
            toast.loading('Analyzing resume...', { id: 'analyze' });
            const { data: report } = await api.post('/resume/analyze', { resumeId: resume._id });

            toast.success('Analysis complete!', { id: 'analyze' });

            // Refresh list
            fetchResumes();
        } catch (error: any) {
            console.error(error);
            const message = error.response?.data?.message || 'Upload or Analysis failed';
            toast.error(message, { id: 'analyze' });
        } finally {
            setIsUploading(false);
        }
    };

    if (authLoading || (!user && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background relative flex flex-col font-spacemono">
            <Navbar />

            <div className="flex-1 flex pt-16 h-screen">
                {/* Sidebar */}
                <aside className="w-64 border-r border-border bg-card flex-shrink-0 hidden md:flex flex-col h-full sticky top-16">
                    <div className="p-6">
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">Menu</p>
                        <nav className="space-y-2">
                            <Link href="/dashboard" className="flex items-center gap-3 px-3 py-2 bg-primary/10 text-primary font-medium rounded-lg">
                                <LayoutDashboard size={18} />
                                Overview
                            </Link>
                        </nav>
                    </div>

                    <div className="flex-1 overflow-y-auto px-6 py-2">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Resumes</p>
                        </div>
                        <div className="space-y-1">
                            {loading ? (
                                <div className="space-y-2">
                                    {[1, 2, 3].map(i => <div key={i} className="h-8 bg-muted rounded-md animate-pulse"></div>)}
                                </div>
                            ) : resumes.length === 0 ? (
                                <p className="text-sm text-muted-foreground py-2">No resumes yet.</p>
                            ) : (
                                resumes.slice(0, 5).map(resume => (
                                    <Link href={`/report/${resume._id}`} key={resume._id} className="flex items-center gap-2 px-3 py-2 text-sm text-foreground hover:bg-muted rounded-md transition-colors truncate">
                                        <FileText size={14} className="text-muted-foreground flex-shrink-0" />
                                        <span className="truncate">{resume.fileName}</span>
                                    </Link>
                                ))
                            )}
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-muted/20">
                    <div className="max-w-5xl mx-auto space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
                            <p className="text-muted-foreground mt-1">Manage your resumes and analyze new ones.</p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Upload Card */}
                            <div className="lg:col-span-1">
                                <div className="bg-card rounded-2xl border border-border p-6 shadow-sm flex flex-col h-full">
                                    <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                                        <PlusCircle size={18} className="text-primary" /> New Analysis
                                    </h2>
                                    
                                    <div className="mb-6 flex-1">
                                        <label className="block text-sm font-medium text-foreground mb-2">Target Role</label>
                                        <select
                                            value={role}
                                            onChange={(e) => setRole(e.target.value)}
                                            className="w-full bg-background border border-border rounded-xl px-4 py-2.5 text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all shadow-sm appearance-none"
                                        >
                                            <option value="Frontend">Frontend Developer</option>
                                            <option value="Backend">Backend Developer</option>
                                            <option value="Fullstack">Full Stack Developer</option>
                                            <option value="MERN">MERN Stack Developer</option>
                                            <option value="DevOps">DevOps Engineer</option>
                                        </select>
                                    </div>

                                    <FileUpload onUpload={handleUpload} isLoading={isUploading} />
                                </div>
                            </div>

                            {/* Resumes List Card */}
                            <div className="lg:col-span-2">
                                <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col h-full">
                                    <div className="p-6 border-b border-border">
                                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                                            <History size={18} className="text-primary" /> Analysis History
                                        </h2>
                                    </div>
                                    
                                    <div className="flex-1 p-0">
                                        {loading ? (
                                            <div className="p-6 space-y-4">
                                                {[1, 2, 3].map(i => <div key={i} className="h-16 bg-muted rounded-xl animate-pulse"></div>)}
                                            </div>
                                        ) : resumes.length === 0 ? (
                                            <div className="p-12 text-center text-muted-foreground flex flex-col items-center justify-center h-full">
                                                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
                                                    <FileText size={24} className="text-muted-foreground/50" />
                                                </div>
                                                <p>No resumes uploaded yet.</p>
                                                <p className="text-sm mt-1">Upload a resume to get started.</p>
                                            </div>
                                        ) : (
                                            <div className="divide-y divide-border">
                                                {resumes.map((resume) => (
                                                    <Link href={`/report/${resume._id}`} key={resume._id} className="block group hover:bg-muted/50 transition-colors p-4 sm:px-6">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-4 min-w-0">
                                                                <div className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold shadow-sm border ${getScoreColor(resume.atsScore)}`}>
                                                                    {resume.atsScore}
                                                                </div>
                                                                <div className="min-w-0">
                                                                    <h3 className="font-bold text-foreground truncate">{resume.fileName}</h3>
                                                                    <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                                                                        <span className="font-semibold px-2 py-0.5 rounded bg-muted text-foreground border border-border/50">{resume.role}</span>
                                                                        <span>•</span>
                                                                        <span>{new Date(resume.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <ChevronRight className="text-muted-foreground flex-shrink-0 group-hover:text-foreground transition-colors ml-4" size={20} />
                                                        </div>
                                                    </Link>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}

function getScoreColor(score: number) {
    if (score >= 80) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (score >= 60) return 'bg-amber-50 text-amber-700 border-amber-200';
    return 'bg-red-50 text-red-700 border-red-200';
}
