'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Check, X, AlertTriangle, ArrowLeft, Copy, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ReportPage() {
    const { id } = useParams<{ id: string }>();
    const [report, setReport] = useState<any>(null);
    const [resume, setResume] = useState<any>(null); // Ideally fetch resume details too for name
    const [loading, setLoading] = useState(true);

    const [jdText, setJdText] = useState('');
    const [jdMatchResult, setJdMatchResult] = useState<any>(null);
    const [matchingJd, setMatchingJd] = useState(false);

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const { data } = await api.get(`/resume/report/${id}`);
                setReport(data);
            } catch (error) {
                toast.error('Failed to load report');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [id]);

    const handleJdMatch = async () => {
        if (!jdText) return toast.error('Please paste a Job Description');
        setMatchingJd(true);
        try {
            const { data } = await api.post('/resume/jd-match', {
                resumeId: report.resume,
                jobDescription: jdText
            });
            setJdMatchResult(data);
        } catch (error) {
            toast.error('JD Match failed');
        } finally {
            setMatchingJd(false);
        }
    };

    if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div></div>;
    if (!report) return <div className="min-h-screen bg-background flex items-center justify-center text-foreground">Report not found</div>;

    return (
        <div className="min-h-screen bg-background pb-20 font-spacemono flex flex-col relative">
            <Navbar />

            <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 w-full">
                <Link href="/dashboard" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6 transition-colors font-medium">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Score Card */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overall Score */}
                        <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h1 className="text-3xl font-bold mb-2 text-foreground">ATS Score</h1>
                                <p className="text-muted-foreground">Your resume's compatibility with ATS algorithms.</p>
                            </div>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#e2e8f0"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={report.totalScore > 70 ? '#10b981' : report.totalScore > 50 ? '#f59e0b' : '#ef4444'}
                                        strokeWidth="3"
                                        strokeDasharray={`${report.totalScore}, 100`}
                                        className="transition-all duration-1000 ease-out"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <span className="absolute text-3xl font-bold text-foreground">{report.totalScore}</span>
                            </div>
                        </div>

                        {/* AI Suggestions */}
                        <div className="bg-card p-6 md:p-8 rounded-2xl border border-border shadow-sm">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-foreground">
                                <span className="w-2.5 h-2.5 bg-primary rounded-full"></span> AI Improvement Suggestions
                            </h2>
                            <div className="prose prose-slate max-w-none">
                                <div className="bg-muted p-5 rounded-xl border border-border/50 text-foreground text-sm leading-relaxed">
                                    {report.suggestions ? (
                                        report.suggestions.split('\n').map((line: string, i: number) => (
                                            <p key={i} className="mb-2 last:mb-0">{line}</p>
                                        ))
                                    ) : 'No specific AI suggestions available.'}
                                </div>
                            </div>
                        </div>

                        {/* Formatting & Missing Keywords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
                                <h3 className="font-semibold mb-4 text-red-600 flex items-center gap-2">
                                    <AlertTriangle size={18} /> Missing Keywords
                                </h3>
                                {report.missingKeywords && report.missingKeywords.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {report.missingKeywords.map((k: string) => (
                                            <span key={k} className="px-2.5 py-1 bg-red-50 text-red-700 font-medium text-sm rounded-lg border border-red-200 shadow-sm">{k}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-emerald-600 flex items-center gap-2 font-medium bg-emerald-50 p-3 rounded-lg border border-emerald-200"><Check size={18} /> All target keywords found!</p>
                                )}
                            </div>

                            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col">
                                <h3 className="font-semibold mb-4 text-foreground">Score Breakdown</h3>
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm font-medium text-foreground mb-1">
                                            <span>Keyword Match</span>
                                            <span>{report.keywordMatch}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: `${(report.keywordMatch / 40) * 100}%` }}></div>
                                        </div>
                                    </div>

                                    <div>
                                        <div className="flex justify-between text-sm font-medium text-foreground mb-1">
                                            <span>Formatting</span>
                                            <span>{report.formattingScore}%</span>
                                        </div>
                                        <div className="w-full bg-muted rounded-full h-2">
                                            <div className="bg-primary/80 h-2 rounded-full" style={{ width: `${(report.formattingScore / 20) * 100}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: JD Match */}
                    <div className="space-y-6">
                        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm sticky top-28">
                            <h2 className="text-xl font-bold mb-3 text-foreground">Job Description Match</h2>
                            <p className="text-sm text-muted-foreground mb-5 leading-relaxed">Paste the job description below to see how well your resume matches a specific job role.</p>

                            <textarea
                                className="w-full h-40 bg-background border border-border rounded-xl p-4 text-sm text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 focus:outline-none mb-4 transition-all shadow-sm resize-none"
                                placeholder="Paste Job Description..."
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                            ></textarea>

                            <button
                                onClick={handleJdMatch}
                                disabled={matchingJd}
                                className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 disabled:opacity-70 text-primary-foreground font-bold py-3 rounded-xl transition-all shadow-sm"
                            >
                                {matchingJd ? (
                                    <>
                                        <RefreshCw className="animate-spin w-4 h-4" /> Analyzing...
                                    </>
                                ) : (
                                    'Compare with JD'
                                )}
                            </button>

                            {jdMatchResult && (
                                <div className="mt-6 pt-6 border-t border-border animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <div className="text-center mb-5">
                                        <div className="text-5xl font-bold text-foreground mb-2">{jdMatchResult.matchPercentage}%</div>
                                        <div className="text-xs text-muted-foreground uppercase tracking-wider font-bold">Match Score</div>
                                    </div>

                                    {jdMatchResult.missingKeywords?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-bold text-red-600 mb-3">Missing Critical Keywords:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {jdMatchResult.missingKeywords.map((k: string) => (
                                                    <span key={k} className="text-xs px-2.5 py-1 bg-red-50 text-red-700 font-medium rounded-md border border-red-200">{k}</span>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
