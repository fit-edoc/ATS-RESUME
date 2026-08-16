'use client';

import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { ArrowRight, CheckCircle, FileText, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground relative isolate font-spacemono">
      <Navbar />

      <main className="pt-32 pb-16">
        {/* Hero Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl mx-auto leading-[1.1]">
              Beat the Algorithms. <br />
              <span className="text-muted-foreground font-normal">Land Your Dream Job.</span>
            </h1>

            <p className="mt-6 max-w-2xl mx-auto text-xl text-muted-foreground leading-relaxed">
              Our AI-powered tool simulates Applicant Tracking Systems to optimize your resume, ensuring you pass the bots and impress human recruiters.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/auth?mode=register" className="inline-flex h-14 items-center justify-center rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm group">
                Analyze My Resume <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link href="/auth?mode=login" className="inline-flex h-14 items-center justify-center rounded-xl border-2 border-border bg-card px-8 text-base font-bold text-foreground transition-all hover:bg-muted hover:border-muted-foreground/30 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 shadow-sm">
                Sign in
              </Link>
            </div>
          </motion.div>
        </div>

        {/* How It Works Section */}
        <div className="py-24 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground tracking-tight">How It Works</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                Three simple steps to significantly increase your interview callback rate.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: 'Upload & Scan', desc: 'Securely upload your resume. We parse it exactly how modern ATS software does.', icon: <FileText className="text-primary-foreground" size={28} /> },
                { title: 'Instant Scoring', desc: 'Get a detailed score based on keywords, format, and industry-specific criteria.', icon: <CheckCircle className="text-primary-foreground" size={28} /> },
                { title: 'Optimize', desc: 'Apply our smart AI suggestions to fix formatting errors and improve keyword matching.', icon: <Zap className="text-primary-foreground" size={28} /> },
              ].map((feature, i) => (
                <div key={i} className="bg-card rounded-2xl p-8 border border-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="mb-6 p-4 bg-primary/20 w-fit rounded-xl border border-primary/30 text-primary">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </main>

      <footer className="py-12 border-t border-border bg-background">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-muted-foreground font-medium">&copy; {new Date().getFullYear()} ATSPROB. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
