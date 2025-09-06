"use client";
import React from 'react';
import { ThemeProvider } from '@/lib/theme';

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}
