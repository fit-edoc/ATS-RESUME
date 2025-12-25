'use client';

import { useState, useEffect, use } from 'react';
import Navbar from '@/components/Navbar';
import api from '@/lib/axios';
import { toast } from 'react-hot-toast';
import { ResponsiveContainer, RadialBarChart, RadialBar, Legend, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';
import { Check, X, AlertTriangle, ArrowLeft, Copy, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
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

    if (loading) return <div className="min-h-screen bg-slate-950 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-indigo-500"></div></div>;
    if (!report) return <div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Report not found</div>;

    const scoreData = [
        { name: 'Keywords', value: report.keywordMatch, fill: '#8884d8' },
        { name: 'Formatting', value: report.formattingScore, fill: '#83a6ed' },
        { name: 'Sections', value: report.sectionScore, fill: '#8dd1e1' },
        { name: 'Experience', value: report.experienceScore, fill: '#82ca9d' },
    ];

    return (
        <div className="min-h-screen bg-slate-950 pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
                <Link href="/dashboard" className="inline-flex items-center text-slate-400 hover:text-white mb-6">
                    <ArrowLeft size={16} className="mr-2" /> Back to Dashboard
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Score Card */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Overall Score */}
                        <div className="glass p-8 rounded-2xl border border-slate-700 flex flex-col md:flex-row items-center justify-between gap-8">
                            <div>
                                <h1 className="text-3xl font-bold mb-2">ATS Score</h1>
                                <p className="text-slate-400">Your resume's compatibility with ATS algorithms.</p>
                            </div>
                            <div className="relative w-32 h-32 flex items-center justify-center">
                                <svg className="w-full h-full" viewBox="0 0 36 36">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="#334155"
                                        strokeWidth="3"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke={report.totalScore > 70 ? '#10b981' : report.totalScore > 50 ? '#eab308' : '#ef4444'}
                                        strokeWidth="3"
                                        strokeDasharray={`${report.totalScore}, 100`}
                                        className="animate-[spin_1s_ease-out_reverse]"
                                    />
                                </svg>
                                <span className="absolute text-3xl font-bold">{report.totalScore}</span>
                            </div>
                        </div>

                        {/* AI Suggestions */}
                        <div className="glass p-6 rounded-2xl border border-slate-700">
                            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span className="w-2 h-2 bg-indigo-500 rounded-full"></span> AI Improvement Suggestions
                            </h2>
                            <div className="prose prose-invert max-w-none">
                                <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 text-slate-300">
                                    {report.suggestions ? (
                                        report.suggestions.split('\n').map((line: string, i: number) => (
                                            <p key={i} className="mb-2">{line}</p>
                                        ))
                                    ) : 'No specific AI suggestions available.'}
                                </div>
                            </div>
                        </div>

                        {/* Formatting & Missing Keywords */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass p-6 rounded-2xl border border-slate-700">
                                <h3 className="font-semibold mb-4 text-red-400">Missing Keywords</h3>
                                {report.missingKeywords.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {report.missingKeywords.map((k: string) => (
                                            <span key={k} className="px-2 py-1 bg-red-500/10 text-red-400 text-sm rounded border border-red-500/20">{k}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-emerald-400 flex items-center gap-2"><Check size={16} /> All target keywords found!</p>
                                )}
                            </div>

                            <div className="glass p-6 rounded-2xl border border-slate-700">
                                <h3 className="font-semibold mb-4 text-indigo-400">Score Breakdown</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between text-sm">
                                        <span>Keyword Match</span>
                                        <span>{report.keywordMatch}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                                        <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${(report.keywordMatch / 40) * 100}%` }}></div>
                                    </div>

                                    <div className="flex justify-between text-sm">
                                        <span>Formatting</span>
                                        <span>{report.formattingScore}%</span>
                                    </div>
                                    <div className="w-full bg-slate-800 rounded-full h-1.5">
                                        <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${(report.formattingScore / 20) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar: JD Match */}
                    <div className="space-y-6">
                        <div className="glass p-6 rounded-2xl border border-slate-700">
                            <h2 className="text-xl font-bold mb-4">Job Description Match</h2>
                            <p className="text-sm text-slate-400 mb-4">Paste the job description below to see how well your resume matches a specific job.</p>

                            <textarea
                                className="w-full h-40 bg-slate-900 border border-slate-700 rounded-lg p-3 text-sm text-white focus:border-indigo-500 focus:outline-none mb-4"
                                placeholder="Paste Job Description..."
                                value={jdText}
                                onChange={(e) => setJdText(e.target.value)}
                            ></textarea>

                            <button
                                onClick={handleJdMatch}
                                disabled={matchingJd}
                                className="w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
                            >
                                {matchingJd ? (
                                    <RefreshCw className="animate-spin w-4 h-4" />
                                ) : (
                                    'Compare'
                                )}
                            </button>

                            {jdMatchResult && (
                                <div className="mt-6 pt-6 border-t border-slate-700 animate-in fade-in slide-in-from-bottom-4">
                                    <div className="text-center mb-4">
                                        <div className="text-4xl font-bold text-white mb-1">{jdMatchResult.matchPercentage}%</div>
                                        <div className="text-xs text-slate-400 uppercase tracking-widest">Match Score</div>
                                    </div>

                                    {jdMatchResult.missingKeywords?.length > 0 && (
                                        <div>
                                            <p className="text-sm font-semibold text-red-400 mb-2">Missing Critical Keywords:</p>
                                            <div className="flex flex-wrap gap-2">
                                                {jdMatchResult.missingKeywords.map((k: string) => (
                                                    <span key={k} className="text-xs px-2 py-1 bg-red-900/20 text-red-300 rounded border border-red-900/40">{k}</span>
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
