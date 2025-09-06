import React from 'react';
import './editor.css';

export const metadata = {
  title: 'Editor',
};

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
