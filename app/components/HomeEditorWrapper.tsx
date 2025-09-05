'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const HomeEditorClient = dynamic(() => import('./HomeEditorClient'), { ssr: false });

export default function HomeEditorWrapper({ initialComponents }: { initialComponents?: any[] }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const edit = params.get('edit');
      if (edit === '1') setActive(true);
    } catch (e) {
      // ignore
    }
  }, []);

  if (!active) return null;
  return <HomeEditorClient initialComponents={initialComponents} />;
}
