import { NextRequest, NextResponse } from 'next/server';
import { writePage } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const parts = new URL(request.url).pathname.split('/');
    const slug = parts[parts.findIndex(p => p === 'pages') + 1];
    const body = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }

    if (!body.components_json) {
      return NextResponse.json(
        { error: 'components_json is required' },
        { status: 400 }
      );
    }

    const pageData = {
      slug,
      title_json: body.title_json || null,
      components_json: body.components_json,
      status: 'draft',
      updated_by: body.updated_by || 'anonymous',
      ...body
    };

    const result = await writePage(slug, pageData);

    return NextResponse.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error saving page:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}