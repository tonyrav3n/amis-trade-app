import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/components/Header';
import { Providers } from '@/app/Providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Amis Trade ',
  description: 'A modern trading platform for digital assets',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
      <html lang="en">
      <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Providers>
        <Header/>
        {children}
        <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#10B981',
                color: '#fff',
                borderRadius: '12px',
                padding: '16px',
              },
              success: {
                iconTheme: {
                  primary: '#fff',
                  secondary: '#10B981',
                },
              },
            }}
        />
      </Providers>
      </body>
      </html>
  );
}
