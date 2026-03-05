import type { Metadata } from 'next';
import React from 'react';
import '../globals.css';

export const metadata: Metadata = {
  title: 'TaskHub - Task Management',
  description: 'Task and documentation management app for software engineering team leads',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        {children}
      </body>
    </html>
  );
}
