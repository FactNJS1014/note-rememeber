import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Note Remember | Personal Knowledge & Reminder SaaS',
  description: 'Smart personal knowledge management and reminder application built with Next.js, Prisma, and Neon PostgreSQL.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen bg-slate-50 dark:bg-[#0b0f19] text-slate-900 dark:text-slate-100">
        {children}
      </body>
    </html>
  );
}
