import { NextRequest, NextResponse } from 'next/server';
import { readPage } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const mode = searchParams.get('mode') || 'published';
    const parts = new URL(request.url).pathname.split('/');
    const slug = parts[parts.findIndex(p => p === 'pages') + 1];

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    const page = await readPage(slug);
    
    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    // If requesting draft mode, return draft version
    if (mode === 'draft') {
      return NextResponse.json(page);
    }

    // For published mode, only return if status is published
    if (page.status !== 'published') {
      return NextResponse.json({ error: 'Page not published' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}