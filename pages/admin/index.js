import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function AdminIndex() {
  const router = useRouter();
  useEffect(() => {
    // Replace immediately to avoid adding to history
    router.replace('/admin/dashboard');
  }, [router]);
  return null;
}
