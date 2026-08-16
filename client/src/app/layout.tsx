import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import LenisProvider from "@/components/LenisProvider";

const spaceMono = localFont({
  src: "../../public/fonts/SpaceMono-Regular.ttf",
  variable: "--font-space-mono",
});

export const metadata: Metadata = {
  title: "ATS PROB",
  description: "Optimize your resume for ATS algorithms and get hired faster.",
  icons:{
    icon:"/logo.png"
  }

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} antialiased bg-background text-foreground min-h-screen`}
      >
        <LenisProvider>
          <AuthProvider>
            {children}
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  background: 'var(--card)',
                  color: 'var(--card-foreground)',
                  border: '1px solid var(--border)'
                }
              }}
            />
          </AuthProvider>
        </LenisProvider>
      </body>
    </html>
  );
}
