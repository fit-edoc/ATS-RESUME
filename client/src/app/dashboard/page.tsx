'use client';

import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import FileUpload from '@/components/FileUpload';
import api from '@/lib/axios';
import { useAuth } from '@/context/AuthContext';
import { toast } from 'react-hot-toast';
import { FileText, ChevronRight, BarChart2, CheckCircle, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ... imports

export default function Dashboard() {
    const { user, loading: authLoading } = useAuth();
    const [resumes, setResumes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState('Frontend');
    const [isUploading, setIsUploading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
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
            toast.error(message, { id: 'analyze' }); // Dismiss the loading toast if it exists
            setIsUploading(false);
        } finally {
            setIsUploading(false);
        }
    };

    if (authLoading || (!user && loading)) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background bg-dot-pattern pb-20 relative isolate">
            <div className="absolute inset-0 bg-background -z-10" />
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column: Upload & Actions */}
                    <div className="space-y-8">
                        <div className="glass-card p-6 rounded-2xl border border-white/10">
                            <h2 className="text-xl font-bold mb-4 text-white">Run New Analysis</h2>

                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Target Role</label>
                                <select
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-white/30 transition-colors appearance-none"
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

                        <div className="glass-card p-6 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-transparent">
                            <h3 className="text-lg font-semibold mb-2 text-white">Pro Tip</h3>
                            <p className="text-sm text-slate-400">
                                Tailor your resume keywords to the job description for a higher match score. Use our JD Match tool in the details page.
                            </p>
                        </div>
                    </div>

                    {/* Right Column: Recent Analyses */}
                    <div className="lg:col-span-2">
                        <h2 className="text-2xl font-bold mb-6 text-white">Recent Analyses</h2>
                        {loading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-white/5 rounded-xl animate-pulse"></div>)}
                            </div>
                        ) : resumes.length === 0 ? (
                            <div className="text-center py-20 text-slate-500 bg-white/5 rounded-2xl border border-dashed border-white/10">
                                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                                <p>No resumes uploaded yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {resumes.map((resume) => (
                                    <Link href={`/report/${resume._id}`} key={resume._id} className="block group">
                                        <div className="glass-card p-6 rounded-xl border border-white/10 hover:border-white/20 transition-all hover:bg-white/5">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className={`p-3 rounded-lg ${getScoreColor(resume.atsScore)}`}>
                                                        <span className="text-xl font-bold">{resume.atsScore}</span>
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold text-lg text-white">{resume.fileName}</h3>
                                                        <div className="flex items-center gap-2 text-sm text-slate-400">
                                                            <span className="bg-white/10 px-2 py-0.5 rounded text-xs uppercase text-slate-300">{resume.role}</span>
                                                            <span>•</span>
                                                            <span>{new Date(resume.createdAt).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <ChevronRight className="text-slate-600 group-hover:text-white transition-colors" />
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

function getScoreColor(score: number) {
    if (score >= 80) return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
    if (score >= 60) return 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20';
    return 'bg-red-500/10 text-red-400 border border-red-500/20';
}
