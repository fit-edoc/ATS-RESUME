'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, CheckCircle, FileText, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {


const companies = [
  {
    title: "Google",
    image: "https://logo.svgcdn.com/logos/google.svg",
  },
  {
    title: "Netflix",
    image: "https://logo.svgcdn.com/logos/netflix.svg",
  },
  {
    title: "Amazon",
    image: "https://imgs.search.brave.com/we4J9Nce1CapScBva4Ygw_EXcYv5Jcson02x0CePSjs/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly8xMDAw/bG9nb3MubmV0L3dw/LWNvbnRlbnQvdXBs/b2Fkcy8yMDE2LzEw/L0FtYXpvbi1Mb2dv/LTIwMDAtNTAweDI4/MS5wbmc",
  },
  {
    title: "Meta",
    image: "https://logo.svgcdn.com/logos/meta.svg",
  },
  {
    title: "Apple",
    image: "https://logo.svgcdn.com/logos/apple.svg",
  },
];



  return (
    <div className="min-h-screen bg-background text-foreground bg-dot-pattern relative isolate">
      {/* Gradient overlay for better text readability if needed, or subtle glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-background to-background pointer-events-none -z-10" />

      <Navbar />

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
           

            <h1 className="text-5xl md:text-7xl font-medium tracking-tight text-white mb-6 max-w-4xl mx-auto leading-[1.1]">
              Master the ATS. <br />
              <span className="text-slate-400">Land Your Dream Job.</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-xl text-slate-400 leading-relaxed">
              Stop getting rejected by robots. Our AI-powered resume analyzer helps you optimize your resume for Applicant Tracking Systems in seconds.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/register" className="inline-flex h-12 items-center justify-center rounded-full border-t-2 border-b-2 border-white px-8 text-sm font-semibold text-white transition-colors hover:bg-slate-200 hover:text-black focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                Analyze My Resume
              </Link>
              <Link href="/login" className="inline-flex h-12 items-center justify-center rounded-full   border-slate-700 border-t-2 border-b-2 bg-transparent px-8 text-sm font-semibold text-white transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-900">
                Sign in
              </Link>
            </div>
          </motion.div>

          {/* Social Proof / Logos */}
          <div className="mt-24 pt-10 border-t border-slate-800/50">
            <p className="text-sm text-slate-500 font-medium mb-8 uppercase tracking-wider">Trusted by candidates who got into</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16">

              {/* Placeholder Logos */}

              {companies.map((company) => (
                <div key={company.title} className="text-xl font-bold text-white flex items-center gap-2">
                  <img src={company.image} className='h-[20px]' alt={company.title} />
                  
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white tracking-tight">How ResumeAI Works</h2>
            <p className="text-slate-400 max-w-2xl mx-auto text-lg">
              Create a resume that stands out to both algorithms and recruiters. We simulate real ATS behavior to give you the competitive edge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: 'Real-time Scoring', desc: 'Get an instant score (0-100) based on role-specific criteria.', icon: <CheckCircle className="text-white" size={32} /> },
              { title: 'Format Validation', desc: 'Detect tables, columns, and graphics that confuse ATS parsers.', icon: <FileText className="text-white" size={32} /> },
              { title: 'AI Suggestions', desc: 'Receive smart rewrite suggestions to improve impact and clarity.', icon: <Upload className="text-white" size={32} /> },
            ].map((feature, i) => (
              <div key={i} className="group relative bg-[#0A0A0A] rounded-2xl p-8 border border-slate-800 hover:border-slate-700 transition-all duration-300 flex flex-col min-h-[300px] justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-800 opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10">
                  <div className="mb-6 p-3 bg-slate-900/50 w-fit rounded-xl border border-slate-800 group-hover:border-slate-600 transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                  <p className="text-slate-400 leading-relaxed">{feature.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </main>

      {/* <footer className="border-t border-slate-800 py-12 ">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex justify-center gap-8 mb-8">
            <Link href="#" className="text-yellow-300">Docs</Link>
            <Link href="#" className="text-yellow-300">Company</Link>
            <Link href="#" className="text-yellow-300">Careers</Link>
            <Link href="#" className="text-yellow-300">Blog</Link>
          </div>
          <p className="text-slate-600">&copy; 2025 ResumeAI. All rights reserved.</p>
        </div>
      </footer> */}
     
    </div>
  );
}
